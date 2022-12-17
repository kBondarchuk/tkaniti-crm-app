<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm :show-investors="showInvestors" @report-request="requestReport" @report-save="saveReport" />
    <div class="ui divider"></div>
    <!-- Loading block -->
    <div v-if="isLoading && !items.length" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !items.length" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Пусто</span>
    </div>
    <!-- Table -->
    <table v-if="items.length" class="ui very compact small collapsing celled table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>Тип операции</th>
          <th class="right aligned">Начислено</th>
          <th class="right aligned">Оплачено</th>
          <th class="right aligned">Исполнение, %</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" :item="item">
          <td>{{ mapType(item.type) }}</td>
          <td class="right aligned">{{ $filters.money(item.charge) }}</td>
          <td class="right aligned">{{ $filters.money(item.payment) }}</td>
          <td class="right aligned">{{ $filters.money(item.percent) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMReportForm from "@/components/CMReportForm.vue";

export default {
  name: "CMReportChargesPayments",
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
  computed: {
    items() {
      if (this.report.length > 0) {
        return this.report.filter((item) => item.charge);
      } else {
        return [];
      }
    },
  },
  methods: {
    mapType(type) {
      switch (type) {
        case "payment":
          type = "Оплата";
          break;
        case "charge":
          type = "Начисление";
          break;

        default:
          break;
      }
      return type;
    },
    requestReport(payload) {
      console.log("requestReport: ", payload);
      this.fetchReport("charges_payments", payload.date1, payload.date2, payload.investors, payload.branches);
    },
    saveReport() {
      // this.saveCsv("report_.csv", this.report);
    },
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
