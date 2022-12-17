<template>
  <!-- Grid -->
  <div class="ui grid">
    <!-- fist column -->
    <div class="seven wide column">
      <!-- Table -->
      <table class="ui very compact small celled table" :class="{ loading: isLoading }">
        <tbody>
          <tr>
            <td>Название</td>
            <td>{{ branch.name }}</td>
          </tr>
          <tr>
            <td v-if="branch.description" colspan="2">{{ branch.description }}</td>
            <td v-else colspan="2">&mdash;</td>
          </tr>
        </tbody>
      </table>

      <!-- Accounts -->
      <table class="ui very compact small celled table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th colspan="2" class="ui center aligned">СОСТОЯНИЕ СЧЕТОВ ФИЛИАЛА</th>
          </tr>
        </thead>
        <tbody>
          <!--  -->
          <tr>
            <td class="gray_bg">Баланс Кассы</td>
            <td class="right aligned gray_bg">{{ $filters.money(accounts.kassa_balance) }}</td>
          </tr>
          <tr>
            <td>&mdash; приход</td>
            <td class="right aligned">{{ $filters.money(accounts.kassa_debet) }}</td>
          </tr>
          <tr>
            <td>&mdash; расход</td>
            <td class="right aligned">{{ $filters.money(accounts.kassa_credit) }}</td>
          </tr>
          <!--  -->
          <tr>
            <td class="gray_bg">Расходы</td>
            <td class="right aligned gray_bg"></td>
          </tr>
          <tr>
            <td>&mdash; филиальные расходы</td>
            <td class="right aligned">{{ $filters.money(accounts.general_expenses) }}</td>
          </tr>
          <tr>
            <td>&mdash; автомобильные расходы</td>
            <td class="right aligned">{{ $filters.money(accounts.cars_expenses) }}</td>
          </tr>
          <!--  -->
          <tr>
            <td class="gray_bg">Продажи</td>
            <td class="right aligned gray_bg">{{ $filters.money(accounts.sales) }}</td>
          </tr>
        </tbody>
      </table>
      <!-- OLD -->
      <!-- <table class="ui very compact small celled table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th>По договорам</th>
            <th class="right aligned">Всего</th>
            <th class="right aligned">Начислено</th>
            <th class="right aligned">Оплачено</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Выкуп</td>
            <td class="right aligned">{{ $filters.money(leasing_contracts_results.contracts_debt) }}</td>
            <td class="right aligned">{{ $filters.money(leasing_contracts_results.contracts_debt_debet) }}</td>
            <td class="right aligned">{{ $filters.money(leasing_contracts_results.contracts_debt_credit) }}</td>
          </tr>
          <tr>
            <td>Проценты</td>
            <td class="right aligned">{{ $filters.money(leasing_contracts_results.interest) }}</td>
            <td class="right aligned">{{ $filters.money(leasing_contracts_results.contracts_interest_debet) }}</td>
            <td class="right aligned">{{ $filters.money(leasing_contracts_results.contracts_interest_credit) }}</td>
          </tr>
          <tr>
            <td>Пеня</td>
            <td class="right aligned"></td>
            <td class="right aligned">{{ $filters.money(leasing_contracts_results.contracts_penalty_debet) }}</td>
            <td class="right aligned">{{ $filters.money(leasing_contracts_results.contracts_penalty_credit) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Итого</th>
            <th class="right aligned">{{ $filters.money(leasing_contracts_results.contracts_total) }}</th>
            <th class="right aligned">{{ $filters.money(leasing_contracts_results.charged_total) }}</th>
            <th class="right aligned">{{ $filters.money(leasing_contracts_results.payed_total) }}</th>
          </tr>
        </tfoot>
      </table> -->
      <!-- /Table -->
      <!-- Expenses Totals -->
      <!-- <CMExpensesTotalsList :investor-id="branch.id" :group-branches="true"></CMExpensesTotalsList> -->
      <!-- /Expenses Totals -->
    </div>
    <!-- second column -->
    <div class="nine wide second column">
      <!-- Contracts -->
      <!-- <div class="segment"> -->

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
            <th class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_total) }}</th>
            <th class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_total_debet) }}</th>
            <th class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_total_left) }}</th>
            <th class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_total_credit) }}</th>
            <th class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_total_to_pay) }}</th>
            <th class="ui right aligned">{{ $filters.money(leasing_contracts_results.contracts_total_balance) }}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMBranchDetails",

  components: {},

  props: {
    branchId: {
      type: Number,
    },
  },

  data() {
    return {
      branch: {},
      accounts: {},
      leasing_contracts_results: {},
      isLoading: false,
    };
  },

  mounted() {
    this.fetchBranch(this.branchId);
    this.fetchAccounts(this.branchId);
    this.fetchLeasingContractsTotals(this.branchId);
  },

  methods: {
    // Network
    async fetchBranch(branch_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getBranch(branch_id);
        this.branch = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchAccounts(branch_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getBranchAccounts(branch_id);
        this.accounts = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchLeasingContractsTotals(branch_id) {
      this.isLoading = true;
      try {
        this.leasing_contracts_results = await apiService.getBranchLeasingContractsTotals(branch_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
