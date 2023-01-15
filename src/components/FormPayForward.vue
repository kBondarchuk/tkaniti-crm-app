<template>
  <!-- New FormPayForward Modal -->
  <UIModal
    modal_id="modalPayForward"
    :title="title"
    :active="active"
    :is-approvable="isValid"
    approve-button-text="Применить"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
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
      <tr>
        <td></td>
        <td>&nbsp;</td>
      </tr>
      <tr :class="{ 'text-color-red': accounts.total_balance < 0 }">
        <td>Текущий баланс:</td>
        <td>{{ $filters.money(accounts.total_balance) }} &#8381;</td>
      </tr>
    </table>

    <div class="ui hidden divider"></div>
    <!--  -->
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <!-- Сумма -->
        <UIInputMoney v-model.trim.lazy="toPay.amount">Сумма погашения</UIInputMoney>
        <!-- Тип -->
        <UIInputDropdown
          v-model.number="toPay.type"
          label="Тип учёта"
          :options="[
            { name: 'Уменьшение срока', value: 1 },
            { name: 'Уменьшение платежа', value: 2 },
            { name: 'Полное погашение', value: 3 },
          ]"
          @update:model-value="typeChanged"
        />
      </div>
      <!--  -->
      <UITextfield v-model.trim.lazy="toPay.notes" label="Комментарий" :disabled="isLoading" />
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- Calc -->
      <div v-if="toPay.type < 3" class="field">
        <UIButton :class="{ disabled: !toPay.amount }" @click.prevent="calcCred">Рассчитать</UIButton>
      </div>
      <!-- submit button -->
      <button type="submit" hidden :disabled="!isValid">Submit</button>
      <!-- Message -->
      <div
        v-if="accounts.total_balance < 0 && Object.keys(calcResults).length > 0 && toPay.type < 3"
        class="ui negative message"
      >
        <div class="header">Внимание!</div>
        <p>
          На договоре числится долг в размере
          <strong class="nobr">{{ $filters.money(accounts.total_balance) }} &#8381;</strong>
          .
        </p>
        <p>Данный расчет будет действителен при условии:</p>
        <ul>
          <li>
            погашения долга в размере: <strong>{{ $filters.money(accounts.total_balance) }} &#8381;</strong>
          </li>
          <li>
            оплаты депозита в размере: <strong>{{ $filters.money(toPay.amount) }} &#8381;</strong>
          </li>
        </ul>
        <p>
          Общая сумма:
          <strong>
            {{ $filters.money(-parseFloat(accounts.total_balance) + parseFloat(toPay.amount)) }}
            &#8381;
          </strong>
        </p>
      </div>
      <!--  -->
      <!-- Message: Полное погашение -->
      <div v-if="accounts.total_balance < 0 && toPay.type == 3" class="ui negative message">
        <div class="header">Внимание!</div>
        <p>
          На договоре числится долг в размере
          <strong class="nobr">{{ $filters.money(accounts.total_balance) }} &#8381;</strong>.
        </p>
        <p>Для полного досрочного погашения требуется:</p>
        <ul>
          <li>
            закрыть долг в размере: <strong>{{ $filters.money(accounts.total_balance) }} &#8381;</strong>
          </li>
          <li>
            выплатить основной долг в размере:
            <strong>{{ $filters.money(accounts.contract_debt_left) }} &#8381;</strong>
          </li>
        </ul>
        <p>
          Общая сумма для полного погашения:
          <strong>
            {{
              $filters.money((-parseFloat(accounts.total_balance) + parseFloat(accounts.contract_debt_left)).toFixed(2))
            }}
            &#8381;
          </strong>
        </p>
      </div>
      <!--  -->
      <!-- Calc Results -->
      <div v-if="Object.keys(calcResults).length > 0 && toPay.type < 3" class="ui segment">
        <div class="ui sub header">Расчёт новых параметров</div>
        <table>
          <tr>
            <td>Дневной процент:</td>
            <td>{{ calcResults.daily_percentage }}</td>
          </tr>
          <tr>
            <td>Остаток срока:</td>
            <td>
              <strong>{{ calcResults.days }}</strong> дней
            </td>
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
    </form>
  </UIModal>
  <!-- /New FormPayForward Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormPayForward",
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
    contract_daily_payment: {
      type: String,
      default: null,
    },
    contract_to_pay: {
      type: String,
      default: null,
    },
  },
  emits: ["hide", "saved"],
  data() {
    return {
      // data
      toPay: {
        amount: "",
        type: 1,
        notes: "",
        //
        debt: "",
        days: 0,
        percent: "",
      },
      accounts: {},
      contract: {},
      calcResults: {},
      // View
      title: "Досрочное погашение",
      isLoading: false,
      api_error: "",
    };
  },
  computed: {
    isValid() {
      return (
        parseFloat(this.toPay.amount) > 0 &&
        parseFloat(this.toPay.amount) <= parseFloat(this.accounts.deposit_balance) &&
        parseFloat(this.toPay.amount) <= parseFloat(this.accounts.contract_debt_left)
      );
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    calcCred() {
      console.log("calc");

      if (this.toPay.type == 2) {
        // Уменьшение платежа
        this.fetchCalcResults();
      } else if (this.toPay.type == 1) {
        var ostatok = parseFloat(this.toPay.debt) - parseFloat(this.toPay.amount);
        // var contract_days = Math.ceil(
        //   Math.log(
        //     this.contract.current_daily_payment /
        //       (this.contract.current_daily_payment - (this.toPay.percent / 100) * ostatok)
        //   ) / Math.log(1 + this.toPay.percent / 100)
        // );

        this.fetchCalcResultsWithAnnuitet(ostatok, this.toPay.percent, this.contract.current_daily_payment);
      }
    },
    typeChanged(type) {
      console.log(type);
      if (parseInt(type) == 3) {
        this.toPay.amount = this.accounts.contract_debt_left;
      }
    },
    // Modal
    reset() {
      this.api_error = "";
      this.accounts = {};
      this.toPay.amount = "";
      this.toPay.type = 1;
      this.toPay.notes = "";
      this.toPay.days = 0;
      this.toPay.percent = "";
      this.toPay.debt = "";
      this.contract = {};
      this.calcResults = {};
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
      try {
        let result = await apiService.contractPayForward(
          this.contractId,
          this.toPay.amount,
          this.toPay.type,
          this.toPay.notes
        );

        console.log(result);
        this.$UIService.showSuccess("", "Досрочное погашение учтено по договору " + this.contractId);
        console.log(this.toPay);
        // saved
        this.$emit("saved");
        // close modal
        this.$emit("hide");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchAccountInfo(contract_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getAccountsForContract(contract_id);
        this.accounts = result;
        this.toPay.debt = this.accounts.contract_debt_left;
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
        this.toPay.days = this.contract.contract_days - this.contract.current_period;
        this.toPay.percent = this.contract.current_daily_percentage;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCalcResults() {
      this.isLoading = true;
      try {
        let result = await apiService.calc(
          (parseFloat(this.toPay.debt) - (parseFloat(this.toPay.amount) || 0)).toFixed(2),
          0,
          this.toPay.percent,
          this.toPay.days
        );
        this.calcResults = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCalcResultsWithAnnuitet(ostatok, percent, annuitet) {
      this.isLoading = true;
      try {
        let result = await apiService.calcWithAnnuitet(ostatok.toFixed(2), 0, percent, annuitet);
        this.calcResults = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
