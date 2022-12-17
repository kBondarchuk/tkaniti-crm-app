<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm :show-investors="showInvestors" @report-request="requestReport" @report-save="saveReport" />
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
          <th>Дата</th>
          <th>Привел клиент</th>
          <th>Приведенный клиент</th>
          <th>Договор</th>
          <th v-if="showInvestors">Инвестор</th>
          <th>Филиал</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in report" :key="index" :item="item">
          <td>{{ $filters.date(item.datetime) }}</td>
          <td>{{ item.referrer + " " + item.referrer_id }}</td>
          <td>{{ item.customer + " " + item.customer_id }}</td>
          <td>{{ item.contract_id }}</td>
          <td v-if="showInvestors">{{ item.investor }}</td>
          <td>{{ item.branch }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMReportForm from "@/components/CMReportForm.vue";

export default {
  name: "CMReportReferrers",
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
    };
  },

  methods: {
    requestReport(payload) {
      console.log("requestReport: ", payload);
      if (payload.date1) {
        this.fetchReport("referrers", payload.date1, payload.date2, payload.investors, payload.branches);
      }
    },
    saveReport() {
      // this.saveCsv("report_.csv", this.report);
    },
    async fetchReport(name, date1, date2, investors_filter, branches_filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getReport(name, date1, date2, investors_filter, branches_filter);
        this.report = result;
        this.report.map((item) => {
          if (!this.showInvestors) {
            item.investor_id = "-";
          }
          return item;
        });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
