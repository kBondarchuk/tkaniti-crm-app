<template>
  <div>
    <!-- Loading block -->
    <div v-if="isLoading && !items.length" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !items.length" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Пусто</span>
    </div>
    <!-- Table -->
    <table v-if="items.length" class="ui very compact small table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>#</th>
          <th>Инвесторы</th>
          <th class="right aligned">Нач. основной долг</th>
          <th class="right aligned">Нач. проценты</th>
          <th class="right aligned">Нач. пеня</th>
          <th class="right aligned">Инвестиции</th>
          <th class="right aligned">Затраты по договорам</th>
          <th class="right aligned">Общие затраты</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" :item="item">
          <td>{{ item.investor_id }}</td>
          <td v-if="item.investor_id">{{ item.last_name }}</td>
          <td v-else>ИТОГО</td>
          <td class="right aligned">{{ $filters.money(item.debt) }}</td>
          <td class="right aligned">{{ $filters.money(item.interest) }}</td>
          <td class="right aligned">{{ $filters.money(item.penalty) }}</td>
          <td class="right aligned">{{ $filters.money(item.investments) }}</td>
          <td class="right aligned">{{ $filters.money(item.contracts_expenses) }}</td>
          <td class="right aligned">{{ $filters.money(item.generel_expenses) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMReportSummary",
  data() {
    return {
      report: [],
      isLoading: false,
    };
  },
  computed: {
    items() {
      return this.report;
    },
  },
  mounted() {
    this.fetchReport();
  },
  methods: {
    async fetchReport() {
      this.isLoading = true;

      try {
        let result = await apiService.getReport("summary");
        this.report = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.ui.circular.button {
  background-color: transparent;
  padding: 3px;
}
.ui.circular.button:hover {
  background-color: #cacbcd;
}
</style>
