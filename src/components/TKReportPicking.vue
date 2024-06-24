<template>
  <!--  -->
  <div>
    <!-- Filter Form -->
    <YReportForm date-mode="none" @report-request="requestReport" @report-save="saveReport" />
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
          <th>№</th>
          <th>ID заказа</th>
          <th>Покупатель</th>
          <th>ID товара</th>
          <th>Товар</th>
          <th class="right aligned">Кол-во</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" :item="item">
          <td>{{ item.row_num }}</td>
          <td>{{ item.order_id }}</td>
          <td>{{ item.customer_fio }}</td>
          <td>{{ item.good_id }}</td>
          <td class="nobr">
            {{ item.good_name }}
          </td>
          <td class="right aligned nobr">
            {{ item.good_quantity }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import YReportForm from "@/components/YReportForm.vue";

export default {
  name: "TKReportPicking",

  components: {
    YReportForm,
  },

  data() {
    return {
      reportName: "picking",
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
      // console.log("requestReport: ", payload);
      this.fetchReport(this.reportName, payload.date1, payload.date2, payload.investors, payload.branches);
    },
    saveReport() {
      // this.saveCsv("report_.csv", this.report);
    },
    async fetchReport(name, date1, date2, investors_filter, branches_filter) {
      this.isLoading = true;

      try {
        this.report = await apiService.getReport(name, date1, date2, investors_filter, branches_filter);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
