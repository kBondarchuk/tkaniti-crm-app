<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm :show-investors="false" date-mode="none" @report-request="requestReport" @report-save="saveReport" />
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
          <th>Сотрудник</th>
          <th class="right aligned">Выдано</th>
          <th class="right aligned">Потрачено</th>
          <th class="right aligned">Задолженность сотрудника</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in report" :key="index" :item="item">
          <td>{{ item.username }}</td>
          <td class="right aligned">{{ $filters.money(item.advance_sum) }}</td>
          <td class="right aligned">{{ $filters.money(item.report_sum) }}</td>
          <td class="right aligned">{{ $filters.money(item.dolg_sum) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- История -->
    <table v-if="report2.length" class="ui very compact small collapsing celled table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>Сотрудник</th>
          <th>Дата</th>
          <th>Документ</th>
          <th class="right aligned">Выдано</th>
          <th class="right aligned">Потрачено</th>
          <th class="right aligned">Задолженность сотрудника</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in report2" :key="index" :item="item">
          <td>{{ item.username }}</td>
          <td>{{ $filters.date(item.date) }}</td>
          <td>{{ item.title }}</td>
          <td class="right aligned">{{ $filters.money(item.sum_1) }}</td>
          <td class="right aligned">{{ $filters.money(item.sum_2) }}</td>
          <td class="right aligned">{{ $filters.money(item.total) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMReportForm from "@/components/CMReportForm.vue";

export default {
  name: "CMReportAdvances",

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
      report2: [],
      isLoading: false,
    };
  },

  methods: {
    requestReport(payload) {
      console.log("requestReport: ", payload);

      this.fetchReport(payload.date1, payload.date2, payload.investors, payload.branches);
    },
    saveReport() {
      // this.saveCsv("report_.csv", this.report);
    },
    async fetchReport(date1, date2, investors_filter, branches_filter) {
      this.isLoading = true;

      try {
        this.report = await apiService.getReport("advances", date1, date2, investors_filter, branches_filter);
        this.report2 = await apiService.getReport("advances_history", date1, date2, investors_filter, branches_filter);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
