<template>
  <!-- New FormAbortContract Modal -->
  <UIModal
    modal_id="modalFormAbortContract"
    :title="title"
    :active="active"
    approve-button-text="Закрыть договор"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <table style="width: 100%">
      <tr>
        <td style="width: 50%">Инвестор:</td>
        <td>{{ contract.investor }}</td>
      </tr>
      <tr>
        <td>Клиент:</td>
        <td>{{ customer.last_name }} {{ customer.first_name }} {{ customer.second_name }}</td>
      </tr>
      <tr>
        <td>Текущий срок договора:</td>
        <td>
          {{ contract.current_period }} из {{ contract.contract_days }} дней (осталось
          {{ contract.contract_days - contract.current_period }} дней)
        </td>
      </tr>
    </table>
    <table>
      <tr>
        <th colspan="2"><br />К ВОЗВРАТУ:</th>
      </tr>
      <tr>
        <td>Текущий баланс депозита</td>
        <td style="text-align: right">{{ $filters.money(accounts.deposit_balance) }} &#8381;</td>
      </tr>
      <tr>
        <td>Оплачено основного долга</td>
        <td style="text-align: right">{{ $filters.money(accounts.debt_debet) }} &#8381;</td>
      </tr>
      <tr>
        <td>Первоначальный платёж</td>
        <td style="text-align: right">{{ $filters.money(-contract.down_payment) }} &#8381;</td>
      </tr>
      <tr>
        <td>Долг по пене</td>
        <td style="text-align: right">{{ $filters.money(accounts.penalty_balance) }} &#8381;</td>
      </tr>
      <tr>
        <td>Долг по процентам</td>
        <td style="text-align: right">{{ $filters.money(accounts.interest_balance) }} &#8381;</td>
      </tr>
      <tr v-if="accounts.abort_total >= 0">
        <th>Всего к возврату</th>
        <th style="text-align: right">{{ $filters.money(accounts.abort_total) }} &#8381;</th>
      </tr>
      <tr v-if="accounts.abort_total < 0">
        <th>Итоговый долг за клиентом</th>
        <th style="text-align: right">{{ $filters.money(accounts.abort_total) }} &#8381;</th>
      </tr>
      <tr v-if="accounts.abort_total >= 0" style="text-align: right">
        <td colspan="2">
          <!-- <div> -->
          <input
            id="do_not_refund"
            v-model="do_not_refund"
            type="checkbox"
            style="vertical-align: middle; margin-top: -2px"
          />
          <label for="do_not_refund"> Не возвращать</label>
          <!-- </div> -->
        </td>
      </tr>
      <tr>
        <td>Выплатить дополнительно</td>
        <td style="text-align: right">
          <UIInputMoney
            v-model.trim.lazy="amount_to_payout"
            :error="parseFloat(amount_to_payout) > parseFloat(contract.down_payment)"
            :disabled="isLoading || amount_to_hold > 0"
          ></UIInputMoney>
        </td>
      </tr>
      <tr v-if="accounts.abort_total >= 0">
        <td>Удержать дополнительно</td>
        <td style="text-align: right">
          <UIInputMoney
            v-model.trim.lazy="amount_to_hold"
            :error="total < 0"
            :disabled="isLoading || amount_to_payout > 0 || do_not_refund"
          />
        </td>
      </tr>
      <tr>
        <th>Итого к возврату с учётом доп. выплат/удержания</th>
        <th style="text-align: right">{{ $filters.money(total) }} &#8381;</th>
      </tr>
    </table>

    <br />
    <div v-if="total < 0 && accounts.abort_total >= 0" class="ui negative message">
      <div class="header">Внимание!</div>
      <p>Сумма удержания не может быть больше $filters.money(accounts.abort_total ) &#8381;!<br /></p>
    </div>
    <div class="ui negative message">
      <div class="header">Внимание!</div>
      <p>
        После подтверждения, договор будет переведен в статус "Закрыт". Автомобиль будет переведен в статус "В
        гараже".<br />
        <span v-if="accounts.abort_total >= 0"> Возврат клиенту в сумме $filters.money(this.total ) &#8381; </span>
        <span v-if="accounts.abort_total < 0">
          На договоре останется долг $filters.money(accounts.abort_total ) &#8381;
        </span>
      </p>
    </div>
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent>
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <!-- <button type="submit" hidden>Submit</button> -->
    </form>
  </UIModal>
  <!-- /New FormAbortContract Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormAbortContract",
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
      amount_to_hold: "0.0",
      amount_to_payout: "0.0",
      do_not_refund: false,
      // View
      title: "Отмена/удаление договора",
      isLoading: false,
      api_error: "",
    };
  },
  computed: {
    total() {
      return (
        parseFloat(this.accounts.abort_total) -
        parseFloat(this.amount_to_hold || 0) +
        parseFloat(this.amount_to_payout || 0)
      );
    },
  },

  watch: {
    do_not_refund(newValue) {
      if (newValue) {
        this.amount_to_hold = this.accounts.abort_total;
        this.amount_to_payout = 0;
      }
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
      // if (this.total < 0) {
      //   return;
      // }
      if (parseFloat(this.amount_to_payout) > parseFloat(this.contract.down_payment)) {
        return;
      }

      var confirmed = confirm("Вы действительно хотите закрыть договор?");
      if (confirmed) {
        console.log("approved: " + modal_id);
        this.fetchAbort();
      }
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    // Networking
    async fetchAbort() {
      this.isLoading = true;

      try {
        await apiService.contractAbort(this.contractId, this.amount_to_hold, this.amount_to_payout);
        console.log("apiService.contractAbort", this.contractId, this.amount_to_hold);

        this.$UIService.showSuccess("", "Договор " + this.contractId + " переведен в статус Закрыт.");
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

<style scoped>
.field :deep(.ui.input input) {
  padding: 0.27857143em 0.7em;
  text-align: right;
}
</style>
