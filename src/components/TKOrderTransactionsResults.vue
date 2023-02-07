<template>
  <!-- Transactions Results -->
  <table class="ui very compact small celled unstackable table" :class="{ loading: isLoading }" style="width: 40%">
    <thead>
      <!-- <tr>
              <th colspan="7">Состояние расчётов по договору ({{contract_id}})</th>
            </tr>-->
      <tr>
        <th></th>
        <th class="ui right aligned">Начислено</th>
        <th class="ui right aligned">Оплачено</th>
        <th class="ui right aligned">Задолженность</th>
      </tr>
    </thead>
    <!--  -->
    <tbody>
      <tr>
        <td class="gray_bg right aligned">Оплата заказов</td>
        <!-- <UIMoneyCell :value="accounts.payment_credit" /> -->
        <UIMoneyCell :value="accounts.order_price" />
        <UIMoneyCell :value="accounts.payment_balance" />
        <!-- <UIMoneyCell :value="accounts.payment_debt_to_pay" /> -->
        <UIMoneyCell :value="accounts.order_balance" colored />
      </tr>
    </tbody>
    <!--  -->
    <!-- <tfoot>
      <tr>
        <th class="right aligned bold-text">Итого</th>
        <UIMoneyCell :value="accounts.total_credit" class="text-bold" />
        <UIMoneyCell :value="accounts.total_debet" class="text-bold" />
        <td></td>
      </tr>
    </tfoot> -->
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "TKOrderTransactionsResults",

  props: {
    orderId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      accounts: {},
      isLoading: false,
    };
  },

  mounted() {
    if (this.orderId) {
      this.fetchItem(this.orderId);
    }
  },

  methods: {
    async fetchItem(order_id) {
      this.isLoading = true;
      try {
        this.accounts = await apiService.getOrderAccounts(order_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
