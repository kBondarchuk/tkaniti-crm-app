<template>
  <!-- Leasing Contracts Results -->
  <table class="ui very compact small celled table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="7" class="ui center aligned">СОСТОЯНИЕ РАСЧЁТОВ ПО ДОГОВОРАМ ВЫКУПА</th>
      </tr>
      <tr>
        <th colspan="2"></th>
        <th colspan="2" class="ui center aligned">НАЧИСЛЕНИЯ</th>
        <th colspan="3" class="ui center aligned">ОПЛАТА</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class></td>
        <td class="ui right aligned gray_bg">Всего</td>
        <td class="ui right aligned gray_bg">Начислено</td>
        <td class="ui right aligned gray_bg">Осталось</td>
        <td class="ui right aligned gray_bg">Оплачено</td>
        <td class="ui right aligned gray_bg">Осталось</td>
        <td class="ui right aligned gray_bg">Текущ. задолж.</td>
      </tr>
      <tr>
        <td class="gray_bg">Основной долг</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_debt) }}</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_debt_debet) }}</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_debt_left) }}</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_debt_credit) }}</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_debt_to_pay) }}</td>
        <td
          class="ui right aligned"
          :class="{
            positive: leasing_contracts_results.contracts_debt_balance > 0,
            negative: leasing_contracts_results.contracts_debt_balance < 0,
          }"
        >
          {{ $filters.money(leasing_contracts_results.contracts_debt_balance) }}
        </td>
      </tr>
      <tr>
        <td class="gray_bg">Проценты</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_interest) }}</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_interest_debet) }}</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_interest_left) }}</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_interest_credit) }}</td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_interest_to_pay) }}</td>
        <td
          class="ui right aligned"
          :class="{
            positive: leasing_contracts_results.contracts_interest_balance > 0,
            negative: leasing_contracts_results.contracts_interest_balance < 0,
          }"
        >
          {{ $filters.money(leasing_contracts_results.contracts_interest_balance) }}
        </td>
      </tr>
      <tr>
        <td class="gray_bg">Пеня</td>
        <td class="ui right aligned"></td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_penalty_debet) }}</td>
        <td class="ui right aligned"></td>
        <td class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_penalty_credit) }}</td>
        <td class="ui right aligned"></td>
        <td
          class="ui right aligned"
          :class="{
            positive: leasing_contracts_results.contracts_penalty_balance > 0,
            negative: leasing_contracts_results.contracts_penalty_balance < 0,
          }"
        >
          {{ $filters.money(leasing_contracts_results.contracts_penalty_balance) }}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th>ИТОГО</th>
        <th class="ui right aligned">
          <span class="nobr">{{ $filters.money(leasing_contracts_results.contracts_total) }}</span>
        </th>
        <th class="ui right aligned">
          <span class="nobr">{{ $filters.money(leasing_contracts_results.contracts_total_debet) }}</span>
        </th>
        <th class="ui right aligned">
          <span class="nobr">{{ $filters.money(leasing_contracts_results.contracts_total_left) }}</span>
        </th>
        <th class="ui right aligned">
          <span class="text-bold">{{ $filters.money(leasing_contracts_results.contracts_total_credit) }}</span>
        </th>
        <th class="ui right aligned">
          <span class="nobr">{{ $filters.money(leasing_contracts_results.contracts_total_to_pay) }}</span>
        </th>
        <th class="ui right aligned">
          <span class="nobr">{{ $filters.money(leasing_contracts_results.contracts_total_balance) }}</span>
        </th>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMInvestorLeasingContractsResults",

  props: {
    investorId: {
      type: Number,
    },
  },

  data() {
    return {
      leasing_contracts_results: {},
      isLoading: false,
    };
  },

  mounted() {
    this.fetchLeasingContractsTotals(this.investorId);
  },

  methods: {
    // Network
    async fetchLeasingContractsTotals(investor_id) {
      this.isLoading = true;
      try {
        this.leasing_contracts_results = await apiService.getInvestorsLeasingContractsTotals(investor_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
