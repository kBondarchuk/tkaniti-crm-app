<template>
  <!-- Пополнения с карт -->
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
          <th>Дата</th>
          <th class="right aligned">Сумма</th>
          <th>Куда</th>
          <th>Автомобиль</th>
          <th>Клиент</th>
          <th v-if="showInvestors">Инвестор</th>
          <th>Филиал</th>
          <th>ID оплаты</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" :item="item">
          <td>{{ $filters.date(item.datetime) }}</td>
          <td class="right aligned">
            <span class="nobr">{{ $filters.money(item.amount) }}</span>
          </td>
          <td>{{ item.deposit_type }}</td>
          <td>{{ item.car }}</td>
          <td>{{ item.customer }}</td>
          <td v-if="showInvestors">{{ item.investor }}</td>
          <td>{{ item.branch }}</td>
          <td>{{ item.orderId }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMReportForm from "@/components/CMReportForm.vue";

export default {
  name: "CMReportTransactionsList",
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
      return this.report;
    },
  },
  methods: {
    requestReport(payload) {
      console.log("requestReport: ", payload);
      this.fetchReport("acquiring_operations", payload.date1, payload.date2, payload.investors, payload.branches);
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
            item.investor = "-";
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
