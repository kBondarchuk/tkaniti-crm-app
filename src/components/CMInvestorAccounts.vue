<template>
  <!-- Accounts -->
  <table class="ui very compact small celled two column table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="2" class="ui center aligned">СОСТОЯНИЕ ОПЕРАЦИОННОГО СЧЁТА</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="gray_bg">Приход</td>
        <td class="right aligned gray_bg">{{ $filters.money(accounts.debet) }}</td>
      </tr>
      <tr>
        <td>&mdash; прямые инвестиции</td>
        <td class="right aligned">{{ $filters.money(accounts.investments) }}</td>
      </tr>
      <tr>
        <td>&mdash; доход</td>
        <td class="right aligned">{{ $filters.money(accounts.reinvestments) }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Расход</td>
        <td class="right aligned gray_bg">{{ $filters.money(accounts.credit) }}</td>
      </tr>
      <tr>
        <td>&mdash; затраты</td>
        <td class="right aligned">{{ $filters.money(accounts.expenses) }}</td>
      </tr>
      <tr>
        <td>&mdash; снятие средств</td>
        <td class="right aligned">{{ $filters.money(accounts.withdraws) }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Баланс</td>
        <td class="right aligned gray_bg">{{ $filters.money(accounts.balance) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMInvestorAccounts",

  props: {
    investorId: {
      type: Number,
    },
  },

  data() {
    return {
      accounts: {},
      isLoading: false,
    };
  },

  mounted() {
    this.fetchAccounts(this.investorId);
  },

  methods: {
    // Network
    async fetchAccounts(investor_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestorAccounts(investor_id);
        this.accounts = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
