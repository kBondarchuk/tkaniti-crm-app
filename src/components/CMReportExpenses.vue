<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm show-save :show-investors="showInvestors" @report-request="requestReport" @report-save="saveReport" />
    <div class="ui divider"></div>
    <!-- Loading block -->
    <div v-if="isLoading && !report.length" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !report.length" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Пусто</span>
    </div>
    <!-- Table -->
    <table v-if="report.length" class="ui very compact small collapsing celled table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>Филиал</th>
          <th>Категории</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in report" :key="index" :item="item">
          <!--  -->
          <td v-if="item.branch_id" :class="{ 'text-bold': item.category_name == null }">
            {{ item.branch }}
          </td>
          <td v-else></td>
          <!--  -->
          <td v-if="item.category_name">
            {{ item.category_name }}
          </td>
          <td v-else-if="item.branch_id == null"></td>
          <td v-else :class="{ 'text-bold': item.category_name == null }">Всего</td>
          <!--  -->
          <td class="right aligned">
            <span :class="{ 'text-bold': item.category_name == null }">{{ $filters.money(item.total) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import { exportCsv } from "@/utils/utils.js";
import CMReportForm from "@/components/CMReportForm.vue";

export default {
  name: "CMReportExpenses",
  components: {
    CMReportForm,
  },
  props: {
    showInvestors: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      report: [],
      isLoading: false,
      columns: ["", "Филиал", "Категории", "Сумма"],
    };
  },

  methods: {
    saveReport() {
      this.saveCsv("report_expenses.csv", this.report);
    },
    saveCsv(filename, data) {
      exportCsv(filename, data, this.columns);
    },
    requestReport(payload) {
      // console.log("requestReport: ", payload);
      this.fetchReport("expenses", payload.date1, payload.date2, payload.investors, payload.branches);
    },
    // Networking
    async fetchReport(name, date1, date2, investors_filter, branches_filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getReport(name, date1, date2, investors_filter, branches_filter);
        this.report = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
