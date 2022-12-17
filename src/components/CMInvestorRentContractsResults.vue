<template>
  <!-- Leasing Contracts Results -->
  <table class="ui very compact small celled table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="7" class="ui center aligned">СОСТОЯНИЕ РАСЧЁТОВ ПО ДОГОВОРАМ АРЕНДЫ</th>
      </tr>
      <tr>
        <th colspan="1"></th>
        <th colspan="1" class="ui center aligned">НАЧИСЛЕНИЯ</th>
        <th colspan="1" class="ui center aligned">ОПЛАТА</th>
        <th colspan="1" class="ui center aligned">ДОЛГ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="gray_bg">Арендные платежи</td>
        <td class="ui right aligned">{{ $filters.money(results.debt_debet) }}</td>
        <td class="ui right aligned text-bold">{{ $filters.money(results.debt_credit) }}</td>
        <td
          class="ui right aligned"
          :class="{ positive: results.debt_balance > 0, negative: results.debt_balance < 0 }"
        >
          {{ $filters.money(results.debt_balance) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMInvestorRentContractsResults",

  props: {
    investorId: {
      type: Number,
    },
  },

  data() {
    return {
      results: {},
      isLoading: false,
    };
  },

  mounted() {
    this.fetchRentContractsTotals(this.investorId);
  },

  methods: {
    // Network
    async fetchRentContractsTotals(investor_id) {
      this.isLoading = true;
      try {
        this.results = (await apiService.getInvestorsRentContractsTotals(investor_id)) || {};
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
