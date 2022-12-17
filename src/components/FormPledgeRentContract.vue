<template>
  <UIModal
    modal_id="modalFormPledgeRentContract"
    :title="title"
    :active="active"
    approve-button-text="Выплатить"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <div class="ui sub header">Статус договора</div>

    <table style="width: 100%">
      <tr>
        <td>Инвестор:</td>
        <td>{{ contract.investor }}</td>
      </tr>
      <tr>
        <td>Клиент:</td>
        <td>{{ customer.last_name }} {{ customer.first_name }} {{ customer.second_name }}</td>
      </tr>
      <tr>
        <td>Остаток залога</td>
        <td>{{ $filters.money(accounts.pledge_balance) }} &#8381;</td>
      </tr>
    </table>

    <br />
    <!-- Form -->
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <UIInputMoney v-model.trim.lazy="payload.amount" :disabled="isLoading">Сумма возврата</UIInputMoney>
      </div>
      <!-- <UITextfield v-model.trim.lazy="payload.notes" :disabled="isLoading">Комментарий</UITextfield> -->
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden>Submit</button>
    </form>

    <!-- <br /> -->
    <!-- <div class="ui positive message">
      <div class="header">Внимание!</div>
      <p></p>
    </div> -->
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

import UIModal from "@/components/UIModal.vue";
// import UITextfield from "@/components/UITextfield.vue";
import UIInputMoney from "@/components/UIInputMoney.vue";

export default {
  name: "FormPledgeRentContract",

  components: {
    UIModal,
    // UITextfield,
    UIInputMoney,
  },

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
      payload: {
        amount: "",
        notes: "",
      },
      // View
      title: "Возврат залога",
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
      this.fetchRefundPledge();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    // Network
    async fetchRefundPledge() {
      this.isLoading = true;

      try {
        await apiService.rentContractRefundPledge(this.contractId, this.payload.amount);

        // this.$UIService.showSuccess("", "Договор " + this.contractId + " завершён.");
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
        let result = await apiService.getAccountsForRentContract(contract_id);
        this.accounts = result;
        this.payload.amount = this.accounts.pledge_balance;
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
        let result = await apiService.getRentContract(contract_id);
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
