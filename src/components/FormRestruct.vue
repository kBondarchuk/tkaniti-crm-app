<template>
  <!-- New FormRestruct Modal -->
  <UIModal
    modal_id="modalFormRestruct"
    :title="title"
    :active="active"
    :is-approvable="isValid"
    approve-button-text="Применить"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <!-- Доступно на балансе: $filters.money(this.accounts.deposit_balance ) -->
    <!-- <br /> -->
    <div class="ui sub header">Текущий договор</div>
    <table>
      <tr>
        <td>Остаток основного долга:</td>
        <td>{{ $filters.money(accounts.contract_debt_left) }} &#8381;</td>
      </tr>
      <tr>
        <td>Текущий дневной платёж:</td>
        <td>{{ $filters.money(contract.current_daily_payment) }} &#8381;</td>
      </tr>
      <tr>
        <td>Текущий срок договора:</td>
        <td>
          {{ contract.current_period }} из {{ contract.contract_days }} дней (осталось
          {{ contract.contract_days - contract.current_period }} дней)
        </td>
      </tr>
      <tr>
        <td>Текущий дневной процент:</td>
        <td>{{ contract.daily_percentage }}</td>
      </tr>
    </table>
    <br />
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="three fields">
        <!-- Сумма изменения основного долга -->
        <UIInputMoney v-model.lazy="restruct.amount">Сумма увеличения</UIInputMoney>
        <!-- Срок -->
        <UIInputNumber v-model.lazy="restruct.days">Остаток срока</UIInputNumber>
        <!-- Процент -->
        <UIInputMoney id="daily_percent" v-model.lazy="restruct.percent" :decimal-scale="3">Новый процент</UIInputMoney>
      </div>
      <!-- Notes -->
      <UITextfield v-model.trim.lazy="restruct.notes" :disabled="isLoading">Комментарий</UITextfield>
      <div class="field">
        <div class="ui tiny compact button" @click="calcCred">Рассчитать</div>
      </div>
      <!--
      daily_payment:"3312.54"
      daily_percentage:"0.211"
      days:"100"
      debt_to_pay:"298357.10"
      down_payment:"0"
      interest_to_pay:"32896.25"
      price:"298357.10"
      total_payout:"331253.35"-->
      <!-- Calc Results -->
      <div v-if="Object.keys(calcResults).length > 0" class="ui segment">
        <div class="ui sub header">Расчёт новых параметров</div>
        <table>
          <tr>
            <td>Дневной процент:</td>
            <td>{{ calcResults.daily_percentage }}</td>
          </tr>
          <tr>
            <td>Срок договора:</td>
            <td>{{ calcResults.days }}</td>
          </tr>
          <tr>
            <td>Дневной платёж:</td>
            <td>
              <strong>{{ $filters.money(calcResults.daily_payment) }}</strong> &#8381;
            </td>
          </tr>
          <tr>
            <td>Остаток долга:</td>
            <td>{{ $filters.money(calcResults.debt_to_pay) }} &#8381;</td>
          </tr>
          <tr>
            <td>Сумма процентов:</td>
            <td>{{ $filters.money(calcResults.interest_to_pay) }} &#8381;</td>
          </tr>
          <tr>
            <td>Всего к оплате:</td>
            <td>{{ $filters.money(calcResults.total_payout) }} &#8381;</td>
          </tr>
        </table>
      </div>
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden :disabled="!isValid">Submit</button>
    </form>
  </UIModal>
  <!-- /New FormRestruct Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormRestruct",

  components: {},

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    contractId: {
      type: Number,
      default: null,
    },
  },

  emits: ["saved", "hide"],

  data() {
    return {
      // data
      restruct: {
        amount: "",
        days: 100,
        debt: "",
        percent: "",
        notes: "",
      },
      accounts: {},
      contract: {},
      calcResults: {},
      // View
      title: "Изменение параметров договора",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    isValid() {
      return parseFloat(this.restruct.days) > 0 && parseFloat(this.restruct.days) <= 5000;
    },
    percent_table() {
      return this.$store.getters["prefs/percentTable"];
    },
  },

  watch: {
    "restruct.days": function (newValue) {
      // newValue, oldValue
      if (isNaN(newValue)) return;

      const found = this.percent_table.find((item) => item.term >= parseInt(newValue));

      var percent = "0.26";

      if (found != undefined) {
        percent = found.percent;
      }
      if (this.restruct.percent !== String(percent)) {
        this.restruct.percent = String(percent);
        $("#daily_percent").transition({
          animation: "pulse",
          reverse: true,
          duration: 200,
          interval: 100,
        });
      }
      // console.log(newValue, "percent: ", percent);
    },
  },

  mounted() {
    this.reset();
  },

  methods: {
    calcCred() {
      console.log("calc");
      this.fetchCalcResults();
    },
    // Modal
    reset() {
      this.api_error = "";
      this.accounts = {};
      this.contract = {};
      this.calcResults = {};
      this.restruct.debt = "";
      this.restruct.notes = "";
    },
    didShow(modal_id) {
      console.log("didShow: " + modal_id);
      this.reset();
      if (this.contractId) {
        this.fetchAccountInfo(this.contractId);
        this.fetchContractDetails(this.contractId);
      }
      // this.fetch();
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
      // contractRestruct(contract_id, contract_days, daily_percentage, notes)
      try {
        let result = await apiService.contractRestruct(
          this.contractId,
          this.restruct.amount,
          this.restruct.days,
          this.restruct.percent,
          this.restruct.notes
        );

        console.log(result);
        this.$UIService.showSuccess("", "Изменены параметры договора " + this.contractId);
        // console.log(this.restuct);
        // saved
        this.$emit("saved");
        // close modal
        this.$emit("hide");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchAccountInfo(contract_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getAccountsForContract(contract_id);
        this.accounts = result;
        this.restruct.debt = this.accounts.contract_debt_left;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchContractDetails(contract_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getContract(contract_id);
        this.contract = result;
        this.restruct.days = this.contract.contract_days - this.contract.current_period;
        this.restruct.percent = this.contract.current_daily_percentage;
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCalcResults() {
      this.isLoading = true;
      try {
        let result = await apiService.calc(
          parseFloat(this.restruct.debt) + (parseFloat(this.restruct.amount) || 0),
          0,
          this.restruct.percent,
          this.restruct.days
        );
        this.calcResults = result;
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
