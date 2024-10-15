<template>
  <!--  -->
  <div>
    <!-- Filter Form -->
    <YReportForm
      date-mode="single"
      show-print
      @report-request="requestReport"
      @report-save="saveReport"
      @report-print="printReport"
    />
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
    <div id="data-table">
      <h1 class="print-only">Задание на упаковку</h1>
      <table v-if="items.length" class="ui very compact small collapsing celled table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th>№</th>
            <th>ID клиента</th>
            <th>Клиент</th>
            <th class="right aligned">Кол-во заказов</th>
            <th>Параметры</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in items" :key="item.order_id">
            <tr>
              <td>{{ index + 1 }}</td>
              <td>{{ item.customer_id }}</td>
              <td>{{ item.customer_fio }}</td>
              <td class="right aligned nobr">
                {{ item.order_count }}
              </td>
              <td style="width: 20em"></td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="page-break"></div>
    </div>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import YReportForm from "@/components/YReportForm.vue";

export default {
  name: "TKReportPacking",

  components: {
    YReportForm,
  },

  data() {
    return {
      reportName: "packing",
      report: [],
      groupedReport: [],
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
    printReport() {
      // Open the print window
      const WinPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0");

      // Get table by ID
      const _table = document.getElementById("data-table").cloneNode(true);
      console.warn(_table);
      WinPrint.document.write(`<!DOCTYPE html>
  <html>
    <head>
      <title>Задание на упаковку</title>
      <style>
      @media print {
        .page-break {
          display: block;
          page-break-before: always;
        }
      }
      table, th, td {
        font-family: monospace;
        border: 1px solid black;
        border-collapse: collapse;
      }
      th, td {
        padding: 0.3em 0.6em;
      }
      td.right {
        text-align: right;
      }
      tfoot {
        font-weight: bold;
      }
      </style>
    </head>
    <body id='body'>
    </body>
  </html>`);

      const _body = WinPrint.document.getElementById("body");
      _body.appendChild(_table);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      // WinPrint.close();
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

<style scoped>
@media screen {
  .print-only {
    display: none;
  }
}
</style>
