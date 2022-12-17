<template>
  <!-- Accounts -->
  <table class="ui very compact small celled two column table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="2" class="ui center aligned">СОСТОЯНИЕ ИНВЕСТИЦИОННОГО СЧЁТА</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="gray_bg">Инвестиции</td>
        <td class="right aligned gray_bg">{{ $filters.money(accounts.investments_balance) }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Накопленные проценты</td>
        <td class="right aligned gray_bg">{{ $filters.money(accounts.interest_balance) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMInvestorAccountsInvestments",

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
        let result = await apiService.getInvestorAccountsInvestments(investor_id);
        this.accounts = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
