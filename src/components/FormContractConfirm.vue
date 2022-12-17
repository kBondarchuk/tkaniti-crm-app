<template>
  <!-- New penalty Modal -->
  <UIModal
    :modal_id="$options.name"
    :title="title"
    :active="active"
    approve-button-text="Создать договор"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <!-- <h2>{{ contractTitle }}</h2> -->
      <table style="width: 100%">
        <tbody>
          <tr>
            <td>Номер договора</td>
            <td>{{ params.contract_number }} от {{ $filters.date(params.contract_date) }}</td>
          </tr>
          <tr>
            <td>Юр. лицо</td>
            <td>{{ selectedCompany }}</td>
          </tr>
          <tr>
            <td colspan="2" style="height: 1em">&nbsp;</td>
          </tr>
          <tr>
            <td>Инвестор</td>
            <td>{{ selectedInvestor }}</td>
          </tr>
          <tr>
            <td>Клиент</td>
            <td>{{ selectedCustomer }}</td>
          </tr>
          <tr>
            <td>Автомобиль</td>
            <td>{{ selectedCar }}</td>
          </tr>
          <tr>
            <td colspan="2" style="height: 1em">&nbsp;</td>
          </tr>
          <tr>
            <td>Дата первого платежа</td>
            <td>{{ $filters.date(params.first_pay_date) }}</td>
          </tr>
          <tr>
            <td>Срок договора</td>
            <td>{{ params.days }} дней</td>
          </tr>
          <tr>
            <td colspan="2" style="height: 1em">&nbsp;</td>
          </tr>
          <tr>
            <td>Стоимость автомобиля</td>
            <td>{{ $filters.money(params.price) }} &#8381;</td>
          </tr>
          <tr>
            <td>Первоначальный взнос</td>
            <td>
              {{ $filters.money(params.down_payment) }} &#8381;
              <span v-if="params.use_accum" class="text-color-red"> [ЮМ.копилка]</span>
            </td>
          </tr>
          <tr>
            <td>Дневной процент</td>
            <td>{{ params.daily_percentage }}</td>
          </tr>
          <!--  -->
          <tr>
            <td colspan="2" style="height: 1em">&nbsp;</td>
          </tr>
          <tr>
            <td>Выкупная стоимость</td>
            <td>{{ $filters.money(results.total_payout) }} &#8381;</td>
          </tr>
          <tr>
            <td>Основной долг</td>
            <td>{{ $filters.money(results.debt_to_pay) }} &#8381;</td>
          </tr>
          <tr>
            <td>Сумма процентов</td>
            <td>{{ $filters.money(results.interest_to_pay) }} &#8381;</td>
          </tr>
          <tr>
            <td>Дневной платёж</td>
            <td>{{ $filters.money(results.daily_payment) }} &#8381;</td>
          </tr>
        </tbody>
      </table>
      <!--
          this.params.notes -->

      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden>Submit</button>
    </form>
  </UIModal>
  <!-- /New penalty Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";

export default {
  name: "FormContractConfirm",

  components: {
    UIModal,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: null,
    },
    selectedObjects: {
      type: Object,
      default: null,
    },
  },

  emits: ["saved", "hide"],

  data() {
    return {
      // Calc Results
      results: {
        daily_payment: 0,
        debt_to_pay: 0,
        interest_to_pay: 0,
        total_payout: 0,
      },
      //
      title: "Подтверждение создания договора",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    contractTitle() {
      return this.params.contract_number + " от " + this.$filters.date(this.params.contract_date);
    },
    selectedCustomer() {
      if (this.selectedObjects.customer === undefined) {
        return "";
      } else
        return (
          this.selectedObjects.customer.last_name +
          " " +
          this.selectedObjects.customer.first_name +
          " " +
          this.selectedObjects.customer.second_name
        );
    },
    selectedInvestor() {
      if (this.selectedObjects.car === undefined) {
        return undefined;
      } else return this.selectedObjects.car.investor;
    },
    selectedCar() {
      if (this.selectedObjects.car === undefined) {
        return "";
      } else
        return (
          this.selectedObjects.car.brand +
          " " +
          this.selectedObjects.car.model +
          " " +
          this.selectedObjects.car.year_of_issue +
          " [" +
          this.selectedObjects.car.plate_number +
          "]"
        );
    },
    selectedCompany() {
      if (this.selectedObjects.company === undefined) {
        return undefined;
      } else return this.selectedObjects.company.name;
    },
  },

  methods: {
    // Modal

    reset() {
      this.results = {
        daily_payment: 0,
        debt_to_pay: 0,
        interest_to_pay: 0,
        total_payout: 0,
      };
      this.api_error = "";
    },
    didShow(modal_id) {
      console.log("didShow: " + modal_id);
      this.reset();
      this.fetchCalc();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.save();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    async save() {
      this.isLoading = true;

      // try {
      //   let result = await apiService.setContractPenaltyOff(
      //     this.contract_id,
      //     this.penalty.date1,
      //     this.penalty.date2,
      //     this.penalty.notes
      //   );

      //   console.log(result);
      //   this.$UIService.showSuccess("", "Установлен период отключения пени. ");

      // saved
      this.$emit("saved");
      // close modal
      this.$emit("hide");
      // } catch (error) {
      //   // console.log("!!!! " + error);
      //   this.$UIService.showNetworkError(error);
      // }

      this.isLoading = false;
    },
    // Networking
    async fetchCalc() {
      this.isLoading = true;

      try {
        let result = await apiService.calc(
          this.params.price,
          this.params.down_payment,
          this.params.daily_percentage,
          this.params.days
        );

        // console.log(result);
        this.results.daily_payment = result["daily_payment"];
        this.results.debt_to_pay = result["debt_to_pay"];
        this.results.interest_to_pay = result["interest_to_pay"];
        this.results.total_payout = result["total_payout"];
      } catch (error) {
        // console.log("!!!! " + error);
        // this.$UIService.showError("Ошибка", error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
