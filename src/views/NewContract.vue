<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton icon="left arrow" type="basic labeled" color="white" @click="back('contracts')">Назад</UIButton>
    </template>
    <!-- /Toolbar -->

    <!-- fist column -->
    <template #side>
      <div id="side">
        <form class="ui form" :class="{ loading: isLoading }" autocomplete="off" @submit.prevent="recalc">
          <!--  -->
          <div class="two fields">
            <!-- Номер договора -->
            <UITextfield
              id="contract_number"
              v-model.trim.lazy="params.contract_number"
              label="Номер договора"
              placeholder="Произвольный номер"
              :class="validateContractNumber"
            />
            <!-- Дата договора -->
            <UIInputDate v-model="params.contract_date" label="Дата договора" :class="validateContractDate" />
          </div>

          <!-- Юр. лицо -->
          <CUISelectCompany v-model="params.company_id" :class="validateCompany" @selected="companySelected" />

          <div class="ui divider"></div>

          <!-- Select Car -->
          <CUISelectCar :car-id="params.car_id" :class="validateCar" :filter-status="[1]" @selected="carSelected" />

          <!-- Select Customer -->
          <CUISelectCustomer
            :class="validateCustomer"
            :filter-branch-id="selectedBranchId"
            @selected="customerSelected"
          />

          <!--  -->
          <UITransition mode="out-in" :duration="1150">
            <div v-if="parseFloat(selectedObjects.customer?.accum) > 0" class="box" :class="validateAccum">
              <div class="header">
                Баланс ЮМ.копилки:
                <span class="value">{{ $filters.money(selectedObjects.customer.accum) }} ₽</span>
              </div>

              <div
                class="ui checkbox"
                style="margin-top: 0.6em"
                :class="{ disabled: selectedObjects.customer.accum == 0 }"
              >
                <input
                  v-model="params.use_accum"
                  type="checkbox"
                  name="checkbox"
                  :disabled="selectedObjects.customer.accum == 0"
                />
                <label @click.prevent="params.use_accum = !params.use_accum">
                  Использовать для первоначального взноса
                </label>
              </div>
            </div>
          </UITransition>

          <div class="ui hidden divider"></div>
          <!--  -->
          <div class="two fields">
            <!-- Стоимость автомобиля -->
            <UIInputMoney v-model.trim.lazy="params.price" label="Стоимость автомобиля" :class="validatePrice" />
            <!-- Первоначальный взнос -->
            <UIInputMoney
              v-model.trim.lazy="params.down_payment"
              label="Первоначальный взнос"
              :class="validateDownPayment"
            />
          </div>
          <!--  -->
          <div class="two fields">
            <!-- Срок в днях -->
            <UIInputNumber
              id="days"
              v-model.lazy="params.days"
              label="Срок в днях"
              :class="validateDays"
              :error="errors.days"
            />
            <!-- Дневной процент -->
            <UIInputMoney
              id="daily_percent"
              v-model.trim.lazy="params.daily_percentage"
              label="Дневной процент"
              :decimal-scale="3"
              :class="validatePercent"
            />
          </div>

          <div class="ui hidden divider"></div>
          <!-- Дата первого списания -->
          <UIInputDate
            v-model.trim.lazy="params.first_pay_date"
            label="Дата первого платежа"
            :class="validateFirstPaymentDate"
          />
          <!-- Заметки -->
          <UITextfield v-model.trim.lazy="params.notes">Заметки</UITextfield>

          <!-- Желаемый платёж -->
          <div class="ui divider" style="margin-top: 1.5em"></div>

          <UIInputMoney
            v-model.trim.lazy="desiredPayment"
            label="Желаемый платёж"
            button
            button-text="Подобрать срок"
            :error="errors.desiredPayment"
            @click="calculateTerm()"
          />

          <div class="ui hidden divider"></div>

          <UIButton text="Рассчитать" type="primary" :disabled="!canCalculate" @click.prevent="recalc" />

          <UIButton
            text="Создать договор"
            type="green compact right labeled"
            icon="right chevron"
            :class="{ loading: isLoading, disabled: !canSubmit }"
            @click.prevent="modals.confirm = true"
          />

          <!-- <UIButton color="green" @click.prevent>Создать договор</UIButton> -->
          <!-- (?) -->
          <span class="ui right floated">
            <i id="popover" class="circular percent icon link right float" style="float: right"></i>
          </span>
          <!-- <div class="ui error message"></div> -->
        </form>
        <!--  -->
        <CMPercentTableList :items="percent_table" />
        <!--  -->
      </div>
    </template>

    <!-- second column -->
    <div class="ui horizontal divider">Расчёт параметров договора</div>
    <!-- Calc Results -->
    <CMCalcResults
      :key="calc_key"
      :branch="selectedBranch"
      :investor="selectedInvestor"
      :price="params.price"
      :down_payment="params.down_payment"
      :days="params.days"
      :daily_percentage="params.daily_percentage"
      :recommended_payment="recommendedPayment"
    />
    <!-- /Calc Results -->
    <div class="ui hidden divider"></div>
    <div class="ui horizontal divider">График платежей</div>
    <div class="ui divider" style="margin: 0"></div>
    <!-- Calc Graph -->
    <div style="overflow: auto; max-height: 70vh">
      <CMScheduleList
        :key="calc_key"
        :price="params.price"
        :down_payment="params.down_payment"
        :days="params.days"
        :daily_percentage="params.daily_percentage"
        :show-title="false"
        :header-sticked-at="0"
      />
    </div>
    <!-- /Calc Graph -->

    <!-- Confirm Modal -->
    <FormContractConfirm
      :active="modals.confirm"
      :params="params"
      :selected-objects="selectedObjects"
      @hide="modals.confirm = false"
      @saved="save"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";
import { CalcSharedMixin } from "@/mixins/CalcSharedMixin.js";
import { CreateContractSharedMixin } from "@/mixins/CreateContractSharedMixin.js";

// Components
import LayoutPage from "@/components/LayoutPage.vue";
// import UIInputSelect from "@/components/UIInputSelect.vue";
import CUISelectCompany from "@/components/CUISelectCompany.vue";
import CUISelectCar from "@/components/CUISelectCar.vue";
import CUISelectCustomer from "@/components/CUISelectCustomer.vue";
import CMScheduleList from "@/components/CMScheduleList.vue";
import CMCalcResults from "@/components/CMCalcResults.vue";
import CMPercentTableList from "@/components/CMPercentTableList.vue";
import FormContractConfirm from "@/components/FormContractConfirm.vue";
import UITransition from "@/components/UITransition.vue";

export default {
  name: "NewContract",

  components: {
    LayoutPage,
    CUISelectCompany,
    CUISelectCar,
    CUISelectCustomer,
    CMScheduleList,
    CMCalcResults,
    CMPercentTableList,
    FormContractConfirm,
    UITransition,
  },

  mixins: [viewMixin, CalcSharedMixin, CreateContractSharedMixin],

  data() {
    return {
      // Contract params
      // params: {
      //   contract_number: "",
      //   contract_date: "",
      //   first_pay_date: "",
      //   price: undefined,
      //   down_payment: undefined,
      //   days: 0,
      //   daily_percentage: null,
      //   notes: "",
      //   use_accum: 0,
      //   company_id: null,
      //   customer_id: null,
      //   car_id: null,
      // },
      // Selections
      // selectedObjects: {
      //   car: undefined,
      //   customer: undefined,
      //   investor: undefined,
      // },
      // // Подбор
      // desiredPayment: undefined,
      // lastContractNumber: "000",

      // presets: {
      //   days: 720,
      //   percent: "0.26",
      //   maxDays: 1825, //1095,
      // },

      // UI
      // Calc, Graph Keys
      calc_key: 0,
      // Modals
      modals: {
        confirm: false,
      },
      // // Errors
      // errors: {
      //   days: null,
      //   desiredPayment: null,
      // },
      // isLoading: false,
      view: { title: "Новый договор выкупа", subTitle: "Создание нового договора" },
    };
  },

  computed: {
    // Selected
    selectedInvestor() {
      return this.selectedObjects.car?.investor;
    },
    selectedBranch() {
      return this.selectedObjects.car?.branch;
    },
    selectedBranchId() {
      return this.selectedObjects.car?.branch_id;
    },
  },

  created() {
    console.log("[NewContract]: created: ", this.$route.query);

    // Set selected car
    if (this.$route.query.car_id) {
      this.params.car_id = parseInt(this.$route.query.car_id);
    }
  },

  // mounted() {
  //   $("#popover").popup({
  //     hoverable: true,
  //     popup: ".percent-table",
  //     position: "bottom right",
  //     lastResort: "left center",
  //     inline: true,
  //   });
  // },

  methods: {
    recalc() {
      console.log("[NewContract]: recalc");
      this.calc_key++;
    },

    // Effects
    flashContractNumber() {
      $("#contract_number").transition({
        animation: "pulse",
        reverse: true,
        duration: 200,
        interval: 100,
      });
    },
    flashDays() {
      $("#days").transition({
        animation: "pulse",
        reverse: true,
        duration: 200,
        interval: 100,
      });
    },
    flashDailyPercent() {
      $("#daily_percent").transition({
        animation: "pulse",
        reverse: true,
        duration: 200,
        interval: 100,
      });
    },
    preloadDone() {
      // this.isReady = true;

      this.$nextTick(() => {
        $("#popover").popup({
          hoverable: true,
          popup: ".percent-table",
          position: "top center",
          lastResort: "top center",
          inline: true,
        });
        this.params.days = this.presets.days; // this.$store.state.prefs.calc.default_days;
      });
    },

    // Networking
    async save() {
      console.log("[NewContract]: save");

      this.isLoading = true;
      try {
        let result = await apiService.createContract(
          this.params.contract_number,
          this.params.contract_date,
          this.params.first_pay_date,
          this.params.price,
          this.params.down_payment,
          this.params.daily_percentage,
          this.params.days,
          this.params.investor_id,
          this.params.customer_id,
          this.params.car_id,
          this.params.notes,
          this.params.use_accum,
          this.params.company_id
        );

        console.log("[NewContract]: save response: ", result);

        this.$UIService.showSuccess("", "Новый Договор успешно создан! Номер: " + result.id);

        this.$router.push({
          name: "contract_details",
          params: { id: result.id },
        });
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
#side {
  padding-bottom: 3rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  width: 30rem;
}

.ui.horizontal.divider:after,
.ui.horizontal.divider:before {
  background-image: none;
}

.box {
  background: #f8f8f9;
  border-radius: 0.28571429rem;
  padding: 1em 1.5em;
  border: 1px solid #f8f8f9;
}

.box.error {
  background: #fff6f6;
  color: #9f3a38;
  border: 1px solid #e0b4b4;
}

.box.success {
  background: #fcfff5;
  color: #2c662d;
  border: 1px solid #a3c293;
}

.box > .header {
  font-weight: bold;
}

.box > .header > .value {
  font-weight: bold;
  float: right;
}
</style>
