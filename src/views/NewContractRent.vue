<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton icon="left arrow" type="basic labeled" color="white" @click="back('contracts_rent')">Назад</UIButton>
    </template>
    <!-- /Toolbar -->

    <!-- fist column -->
    <template #side>
      <div id="side">
        <form class="ui form" :class="{ loading: isLoading }" autocomplete="off">
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
            <!--  -->
          </div>

          <div class="ui divider"></div>

          <!-- Select Car -->
          <UIInputSelect
            label="Автомобиль"
            placeholder="Автомобиль не выбран"
            :value="selectedCar"
            :class="validateCar"
            @button-did-click="browseCars"
          />
          <!-- /Select Car -->

          <!-- Select Customer -->
          <UIInputSelect
            label="Клиент"
            placeholder="Клиент не выбран"
            :value="selectedCustomer"
            :class="validateCustomer"
            @button-did-click="browseCustomers"
          />
          <!-- /Select Customer -->

          <!--  -->

          <div class="ui hidden divider"></div>

          <div class="two fields">
            <!-- Дата первого списания -->
            <UIInputDate
              v-model.lazy="params.first_pay_date"
              label="Первый день аренды"
              :class="validateFirstPaymentDate"
            />
            <!-- Срок в днях -->
            <UIInputNumber
              v-model.lazy="params.days"
              label="Срок аренды в днях"
              :class="validateDays"
              :error="errors.days"
            />
          </div>
          <!--  -->
          <div class="two fields">
            <!-- Дневной тариф -->
            <UIInputMoney v-model.lazy="params.daily_payment" label="Дневная стоимость" :class="validateDailyPayment" />
            <!-- Сумма залога -->
            <UIInputMoney v-model.lazy="params.pledge" label="Сумма залога" :class="validatePledge" />
          </div>

          <div class="ui hidden divider"></div>
          <!-- Заметки -->
          <UITextfield v-model.trim.lazy="params.notes" label="Заметки" />

          <div class="ui hidden divider"></div>

          <UIButton
            text="Создать договор"
            type="green compact right labeled"
            icon="right chevron"
            :class="{ loading: isLoading, disabled: !canSubmit }"
            @click.prevent="save"
          />
          <!--  -->
        </form>
      </div>
    </template>

    <!-- second column -->
    <div class="ui horizontal divider">Расчёт параметров договора</div>
    <!-- Calc Results -->
    <CMRentCalcResults
      :key="calc_key"
      :branch="selectedBranch"
      :investor="selectedInvestor"
      :price="params.price"
      :pledge="params.pledge"
      :days="params.days"
      :daily_payment="params.daily_payment"
    />
    <!-- /Calc Results -->
    <!-- New Customers Browser -->
    <!-- :filter-branch-id="selectedBranchId" -->
    <BrowseCustomers
      :active="modals.browseCustomers"
      @hide="modals.browseCustomers = false"
      @selected="customerSelected"
    />
    <!------->
    <!-- New Cars Browser -->
    <BrowseCars
      :active="modals.browseCars"
      :filter-status="[1]"
      @hide="modals.browseCars = false"
      @selected="carSelected"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";
import { getCurrentDate } from "@/utils/utils.js";
// Components
import BrowseCustomers from "@/components/BrowseCustomers.vue";
import BrowseCars from "@/components/BrowseCars.vue";
import CMRentCalcResults from "@/components/CMRentCalcResults.vue";
// import FormContractConfirm from "@/components/FormContractConfirm.vue";

export default {
  name: "NewContractRent",
  components: {
    BrowseCustomers,
    BrowseCars,
    CMRentCalcResults,
    // FormContractConfirm,
  },
  mixins: [viewMixin],
  data() {
    return {
      view: { title: "Новый договор аренды", subTitle: "Создание нового договора аренды" },
      isLoading: false,
      params: {
        // Contract params
        contract_number: "",
        contract_date: "",
        first_pay_date: "",
        daily_paymeny: undefined,
        pledge: undefined, // залог
        days: 10,
        notes: "",
        use_accum: 0,
        // Selections
        investor: undefined,
        customer: undefined,
        car: undefined,
      },
      // this.params.contract_number,
      // this.params.contract_date,
      // this.params.first_pay_date,
      // this.params.days,
      // this.params.contract_daily_payment,
      // this.params.contract_pledge,
      // this.params.customer_id,
      // this.params.car_id,
      // this.params.notes,
      // this.params.use_accum
      // Подбор
      desiredPayment: undefined,
      // percent_table: null,
      lastContractNumber: "000",
      // Modals
      modals: {
        browseCustomers: false,
        // browseInvestors: false,
        browseCars: false,
        confirm: false,
      },
      // Calc, Graph Keys
      calc_key: 0,
      //
      maxDays: 1825, //1095,
      // Errors
      errors: {
        days: "",
      },
    };
  },
  computed: {
    canSubmit() {
      const valid =
        this.params.customer !== undefined &&
        this.params.car !== undefined &&
        this.params.car.investor_id &&
        this.params.first_pay_date &&
        this.params.contract_date &&
        this.params.contract_number &&
        this.params.days > 0 &&
        this.params.days <= this.maxDays &&
        // this.params.customer.branch_id == this.params.car.branch_id &&
        this.checkFirstPaymentDate &&
        ((this.validateAccum.success && this.params.use_accum) || !this.params.use_accum);
      return valid && !this.isLoading;
    },
    validateCar() {
      return {
        success: this.params.car && this.params.car.ref_car_status == 1,
        error: this.params.car && this.params.car.ref_car_status != 1,
      };
    },
    validateDays() {
      return {
        success: this.params.days > 0 && this.params.days <= this.maxDays,
        error: this.params.days < 0 || this.params.days > this.maxDays,
      };
    },
    validateCustomer() {
      return {
        success: this.params.customer && this.params.customer.id > 0 && this.params.car, // &&
        // this.params.customer.branch_id == this.params.car.branch_id,
        error: this.params.car && !this.params.customer, //, || this.params.customer.branch_id != this.params.car.branch_id)
      };
    },
    validateContractDate() {
      return {
        success: this.params.contract_date && this.params.contract_date.length == 10,
        error: this.params.contract_date && this.params.contract_date.length != 10,
      };
    },
    validateContractNumber() {
      return {
        success: this.params.contract_number && this.params.contract_number.length > 3,
        error: this.params.contract_number && this.params.contract_number.length < 4,
      };
    },
    validateFirstPaymentDate() {
      return {
        success: this.params.first_pay_date && this.params.first_pay_date.length == 10 && this.checkFirstPaymentDate,
        error: this.params.first_pay_date && (this.params.first_pay_date.length != 10 || !this.checkFirstPaymentDate),
      };
    },
    validateDailyPayment() {
      return {
        success: this.params.daily_payment && this.params.daily_payment > 0,
        error: this.params.daily_payment && this.params.daily_payment < 0,
      };
    },
    validatePledge() {
      return {
        success: this.params.pledge && this.params.pledge > 0,
        error: this.params.pledge && this.params.pledge < 0,
      };
    },
    validateAccum() {
      return {
        success: this.params.use_accum && this.params.customer,
        error: this.params.use_accum && this.params.customer,
      };
    },
    checkFirstPaymentDate() {
      const date_selected = new Date(this.params.first_pay_date);
      const date_current = new Date(getCurrentDate());

      if (date_selected <= date_current) {
        return false;
      } else {
        return true;
      }
    },
    selectedCustomer() {
      if (this.params.customer === undefined) {
        return "";
      } else
        return (
          this.params.customer.last_name +
          " " +
          this.params.customer.first_name +
          " " +
          this.params.customer.second_name
        );
    },
    selectedInvestor() {
      if (this.params.car === undefined) {
        return undefined;
      } else return this.params.car.investor;
    },
    selectedCar() {
      if (this.params.car === undefined) {
        return "";
      } else
        return (
          this.params.car.brand +
          " " +
          this.params.car.model +
          " " +
          this.params.car.year_of_issue +
          " [" +
          this.params.car.plate_number +
          "] <" +
          this.params.car.car_status +
          ">"
        );
    },
    selectedBranch() {
      if (this.params.car === undefined) {
        return undefined;
      } else return this.params.car.branch;
    },
    selectedBranchId() {
      if (this.params.car === undefined) {
        return null;
      } else return this.params.car.branch_id;
    },
    contractNumberGenerated() {
      let contractPrefix = "ИНВ";

      if (this.params.investor !== undefined && this.params.investor.first_name !== "") {
        contractPrefix = this.params.investor.first_name[0] + (this.params.investor.second_name[0] || "");
      }

      const part1 = this.lastContractNumber.split(" ")[1];
      let contractLastIntNumber = "000";
      if (part1) {
        contractLastIntNumber = parseInt(part1.split("/")[0]);
      }

      const contractNumber = ("00" + (contractLastIntNumber + 1)).slice(-3);
      const contractYear = this.params.contract_date.split("-")[0].substr(-2, 2);
      return "АР-" + contractPrefix + " " + contractNumber + "/" + contractYear;
    },
  },
  watch: {
    "params.contract_date": function () {
      // newValue, oldValue
      // if (isNaN(newValue)) return;
      this.changeContractNumber();
      // console.log(newValue);
    },
  },
  mounted() {
    this.fetchLastContractNumber();

    if (this.$route.query.car_id) {
      this.fetchCar(this.$route.query.car_id);
    }
  },
  methods: {
    // back() {
    //   this.$router.push({ name: "contracts" });
    // },
    browseCustomers() {
      this.modals.browseCustomers = true;
    },
    customerSelected(item) {
      this.params.customer = item;
      this.params.use_accum = 0;
      this.modals.browseCustomers = false;
      this.fetchCustomer(item.id);
    },
    browseInvestors() {
      this.modals.browseInvestors = true;
    },
    investorSelected(item) {
      this.params.investor = item;
      // this.modals.browseInvestors = false;
      // Refresh Contract number
      this.changeContractNumber();
    },
    browseCars() {
      this.modals.browseCars = true;
    },
    carSelected(item) {
      this.params.car = item;
      this.params.price = item.price;
      this.params.daily_payment = item.rent_price;
      this.modals.browseCars = false;
      this.fetchInvestor(this.params.car.investor_id);
    },
    changeContractNumber() {
      // Refresh Contract number
      this.params.contract_number = this.contractNumberGenerated;
      $("#contract_number").transition({
        animation: "pulse",
        reverse: true,
        duration: 200,
        interval: 100,
      });
    },

    // Networking
    async save() {
      this.isLoading = true;
      try {
        let result = await apiService.createRentContract(
          this.params.contract_number,
          this.params.contract_date,
          this.params.first_pay_date, // daye opened
          this.params.days,
          this.params.daily_payment,
          this.params.pledge,
          this.params.customer.id,
          this.params.car.id,
          this.params.notes,
          this.params.use_accum
        );

        console.log(result);
        this.$UIService.showSuccess("", "Новый Договор аренды успешно создан! Номер: " + result.id);
        this.$router.push({
          name: "contract_rent_details",
          params: { id: result.id },
        });
      } catch (error) {
        console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchLastContractNumber() {
      this.isLoading = true;
      try {
        let result = await apiService.getRentContractLastNumber();
        this.lastContractNumber = result.contract_number;
      } catch (error) {
        if (error.response && error.response.status == 404) {
          console.log("Договоры не найдены. Оставляем номер по умолчанию.");
        } else {
          this.$UIService.showNetworkError(error);
        }
      }
      this.isLoading = false;
    },
    async fetchCar(car_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getCar(car_id);
        // this.params.car = result;
        this.carSelected(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCustomer(customer_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getCustomer(customer_id);
        this.params.customer = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchInvestor(investor_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestor(investor_id);
        // this.params.car = result;
        // this.params.investor = result;
        this.investorSelected(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
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

/* .box {
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
} */
</style>
