<template>
  <UIModal
    modal_id="modalFormFinishContract"
    :title="title"
    :active="active"
    approve-button-text="Завершить договор"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <table>
      <tr>
        <td>Инвестор:</td>
        <td>{{ contract.investor }}</td>
      </tr>
      <tr>
        <td>Клиент:</td>
        <td>{{ customer.last_name }} {{ customer.first_name }} {{ customer.second_name }}</td>
      </tr>
      <!-- <tr>
        <td>Текущий срок договора:</td>
        <td>{{contract.current_period}} из {{contract.contract_days}} дней (осталось {{ contract.contract_days-contract.current_period }} дней)</td>
      </tr>-->
      <tr>
        <th colspan="2"><br />К ВОЗВРАТУ:</th>
      </tr>
      <tr>
        <td>Текущий баланс депозита</td>
        <td style="text-align: right">{{ $filters.money(accounts.deposit_balance) }} &#8381;</td>
      </tr>
      <!-- <tr>
        <td>Оплачено основного долга</td>
        <td style="text-align: right">{{$filters.money(accounts.debt_debet ) &#8381;}}</td>
      </tr>
      <tr>
        <td>Первоначальный платёж</td>
        <td style="text-align: right">&minus;$filters.money(contract.down_payment ) &#8381;</td>
      </tr>-->
      <!-- <tr>
        <th>Всего в возврату</th>
        <th style="text-align: right">{{$filters.money(accounts.abort_total ) &#8381;}}</th>
      </tr>-->
    </table>
    <br />
    <div class="ui positive message">
      <div class="header">Внимание!</div>
      <p>
        После подтверждения, договор будет переведен в статус "Архив". Автомобиль будет переведен в статус "Выкуплен".
      </p>
    </div>
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden>Submit</button>
    </form>
  </UIModal>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormFinishContract",
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
  emits: ["hide", "saved"],
  data() {
    return {
      accounts: {},
      contract: {},
      customer: {},
      // View
      title: "Завершение договора",
      isLoading: false,
      api_error: "",
    };
  },
  mounted() {
    this.reset();
  },
  methods: {
    // Modal
    reset() {
      this.api_error = "";
      this.accounts = {};
      this.contract = {};
    },
    didShow(modal_id) {
      console.log("didShow: " + modal_id);
      this.reset();
      if (this.contractId) {
        this.fetchAccountInfo(this.contractId);
        this.fetchContractDetails(this.contractId);
      }
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.fetchFinish();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    // Network
    async fetchFinish() {
      this.isLoading = true;

      try {
        await apiService.contractFinish(this.contractId);

        this.$UIService.showSuccess("", "Договор " + this.contractId + " переведён в Архив.");
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
        // this.restuct.debt = this.accounts.contract_debt_left;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCustomer(customer_id) {
      // this.isLoading = true;
      try {
        let result = await apiService.getCustomer(customer_id);
        this.customer = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      // this.isLoading = false;
    },
    async fetchContractDetails(contract_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getContract(contract_id);
        this.contract = result;
        this.fetchCustomer(result.customer_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
