<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm
      date-mode="single"
      date1-title="Отчётная дата"
      show-save
      :show-investors="showInvestors"
      @report-request="requestReport"
      @report-save="saveReport"
    />
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
    <table
      v-if="report.length"
      ref="table"
      class="ui very compact small collapsing sortable celled table"
      :class="{ loading: isLoading }"
    >
      <thead>
        <tr>
          <th>п/н</th>
          <th>Номер</th>
          <th>Дата<br />начала</th>
          <th>Дата<br />окончания</th>
          <th>Осталось<br />дней</th>
          <th>Автомобиль</th>
          <th>Клиент</th>
          <th v-if="showInvestors">Инвестор</th>
          <th>Филиал</th>
          <th class="right aligned">Стоимость<br />автомобиля</th>
          <th class="right aligned">Выкупная<br />стоимость</th>
          <th class="right aligned">Остаток<br />к выплате</th>
          <th class="right aligned">Остаточная<br />стоимость<br />автомобиля</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in report" :key="index">
          <td :data-sort-value="parseInt(item.row_number)">{{ item.row_number }}</td>
          <td :data-sort-value="parseInt(item.id)">{{ item.id }}</td>
          <td :data-sort-value="item.date_opened">{{ $filters.date(item.date_opened) }}</td>
          <td :data-sort-value="item.contract_end_date">{{ $filters.date(item.contract_end_date) }}</td>
          <td :data-sort-value="parseInt(item.days_left)">{{ item.days_left }}</td>
          <td>{{ item.car }}</td>
          <td>{{ item.fio }}</td>
          <td v-if="showInvestors">{{ item.investor }}</td>
          <td>{{ item.branch }}</td>
          <!-- <td class="right aligned">{{ $filters.money(item.car_price) }}</td>
          <td class="right aligned">{{ $filters.money(item.contract_total_payout) }}</td>
          <td class="right aligned">{{ $filters.money(item.ostatok) }}</td>
          <td class="right aligned">{{ $filters.money(item.ostatok_debt_no_interest) }}</td> -->
          <UIMoneyCell :value="item.car_price" :data-sort-value="parseInt(item.car_price)" />
          <UIMoneyCell :value="item.contract_total_payout" :data-sort-value="parseInt(item.contract_total_payout)" />
          <UIMoneyCell :value="item.ostatok" :data-sort-value="parseInt(item.ostatok)" />
          <UIMoneyCell
            :value="item.ostatok_debt_no_interest"
            :data-sort-value="parseInt(item.ostatok_debt_no_interest)"
          />
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="9"></td>
          <UIMoneyCell :value="lastRow.car_price" :data-sort-value="parseInt(lastRow.car_price)" />
          <UIMoneyCell
            :value="lastRow.contract_total_payout"
            :data-sort-value="parseInt(lastRow.contract_total_payout)"
          />
          <UIMoneyCell :value="lastRow.ostatok" :data-sort-value="parseInt(lastRow.ostatok)" />
          <UIMoneyCell
            :value="lastRow.ostatok_debt_no_interest"
            :data-sort-value="parseInt(lastRow.ostatok_debt_no_interest)"
          />
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import { exportCsv } from "@/utils/utils.js";
import CMReportForm from "@/components/CMReportForm.vue";
import "jquery-tablesort/jquery.tablesort.min.js";

export default {
  name: "CMReportToPay",

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
      lastRow: {},
      isLoading: false,
    };
  },

  updated() {
    // console.log("updated");
    // Make sorting
    $.tablesort.DEBUG = false;
    // console.warn($.tablesort);

    $(this.$refs.table).tablesort(); // Make the table sortable.
    // $(this.$refs.table).on("tablesort:start", function (event, tablesort) {
    //   console.log("Starting the sort...");
    // });
    // var _tablesort = $(this.$refs.table).data("tablesort"); // Get a reference to it's tablesort instance
    // console.warn(this.$refs);
  },

  methods: {
    requestReport(payload) {
      console.log("requestReport: ", payload);
      if (payload.date1) {
        this.fetchReport("topay", payload.date1, payload.date2, payload.investors, payload.branches);
      }
    },
    saveCsv(filename, data) {
      exportCsv(filename, data, [
        "Номер",
        "п/н",
        "Дата начала",
        "Дата окончания",
        "Остаток дней",
        "Автомобиль",
        "Клиент",
        "Город",
        "Cтоимость авто",
        "Выкупная стоимость",
        "Остаток к выплате",
        "Остаточная стоимость автомобиля",
        "Отчётная дата",
        "Инвестор",
        "Филиал ID",
        "Филиал",
      ]);
    },
    saveReport() {
      this.saveCsv("report_topay.csv", this.report);
    },
    async fetchReport(name, date1, date2, investors_filter, branches_filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getReport(name, date1, date2, investors_filter, branches_filter);
        this.lastRow = result.pop();
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
