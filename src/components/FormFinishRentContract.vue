<template>
  <UIModal
    modal_id="modalFormFinishContract"
    :title="title"
    :active="active"
    :is-approvable="isFormValid"
    approve-button-text="Завершить договор"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error warning form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <table style="width: 100%">
        <tbody>
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
            <th colspan="2" style="padding-top: 1em">
              <div class="ui sub header">ТЕКУЩЕЕ СОСТОЯНИЕ СЧЕТОВ</div>
            </th>
          </tr>
          <tr>
            <td>Остаток залога</td>
            <!-- <td style="text-align: right">
                <strong>{{ $filters.money(accounts.pledge_balance) }} &#8381;</strong>
              </td> -->
            <UIMoneyCell
              :value="accounts.pledge_balance"
              :colored="accounts.pledge_balance < 0"
              rub
              style="font-weight: bold"
            />
          </tr>
          <tr>
            <td>Остаток на депозите</td>
            <td style="text-align: right">
              <strong>{{ $filters.money(accounts.deposit_balance) }} &#8381;</strong>
            </td>
          </tr>
          <tr>
            <td>Задолженность по оплате аренды</td>
            <!-- <td style="text-align: right">
            <strong>{{ $filters.money(accounts.debt_balance) }} &#8381;</strong>
          </td> -->
            <UIMoneyCell :value="accounts.debt_balance" colored rub style="font-weight: bold" />
          </tr>
          <!-- <tr>
            <td></td>
            <td>
              <UICheckbox id="pledge_check" v-model="pledgeCheck" label="Погасить долг из залога" />
            </td>
          </tr> -->
          <tr>
            <th colspan="2" style="padding-top: 1em">
              <div class="ui sub header">Расчёт при закрытии</div>
            </th>
          </tr>
          <tr>
            <td>Сумма к возврату</td>
            <td style="text-align: right">
              <UIInputMoney v-model.trim.lazy="payload.amount" :disabled="isLoading" :class="validateAmount" />
            </td>
          </tr>
          <tr>
            <td>Сумма в оплату договора</td>
            <td style="text-align: right">
              <strong>
                {{ $filters.money(parseFloat(accounts.deposit_balance) - parseFloat(payload.amount)) }}
                &#8381;
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
      <br />

      <!--  -->
      <div v-if="pledgeToPay > 0" class="ui warning message">
        <!-- <div class="header">Внимание!</div> -->
        <p>
          Задолженность на сумму <UIMoney :value="pledgeToPay" rub />
          будет погашена из залога !
        </p>
      </div>
      <!--  -->
      <div v-if="debtBalance < 0" class="ui negative message">
        <!-- <div class="header">Внимание!</div> -->
        <p>Договор будет закрыт с долгом <UIMoney :value="debtBalance" rub /> !</p>
      </div>

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
// import UICheckbox from "@/components/UICheckbox.vue";

export default {
  name: "FormFinishRentContract",

  components: {
    UIModal,
    // UICheckbox,
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
        amount: "0.00",
      },
      pledgeCheck: false,
      // View
      title: "Завершение договора",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    pledgeToPay() {
      const debt = parseFloat(this.accounts.debt_balance);
      const pledge = parseFloat(this.accounts.pledge_balance);

      if (debt < 0 && pledge > 0) {
        if (Math.abs(debt) <= pledge) {
          return Math.abs(debt);
        } else {
          return pledge;
        }
      } else {
        return 0;
      }
    },
    debtBalance() {
      const debt = parseFloat(this.accounts.debt_balance);
      const pledge = parseFloat(this.accounts.pledge_balance);

      if (Math.abs(debt) <= pledge) {
        return 0;
      } else {
        return debt + pledge;
      }
    },

    // Validation
    isFormValid() {
      return this.validateAmount.success;
    },
    validateAmount() {
      return {
        success: parseFloat(this.payload.amount) <= parseFloat(this.accounts.deposit_balance),
        error: parseFloat(this.payload.amount) > parseFloat(this.accounts.deposit_balance),
        disabled: parseFloat(this.accounts.deposit_balance) <= 0,
      };
    },
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
        await apiService.rentContractFinish(this.contractId, this.payload.amount);

        this.$UIService.showSuccess("", "Договор " + this.contractId + " завершён.");
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
        this.payload.amount = this.accounts.deposit_balance;
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

<style scoped>
.field :deep(.ui.input input) {
  padding: 0.27857143em 0.7em;
  text-align: right;
}
</style>
