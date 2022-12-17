<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm
      date-mode="none"
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
    <div class="table-wrapper">
      <table v-if="report.length" class="ui very compact small collapsing celled table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th>№</th>
            <th>Марка</th>
            <th>Модель</th>
            <th>Год выпуска</th>
            <th class="right aligned">Рыночная стоимость</th>
            <th>Госномер</th>
            <th>ПТС</th>
            <th>Клиент</th>
            <th>Дата начала договора</th>
            <th>Дата окончания договора</th>
            <th class="right aligned">Сумма к выкупу</th>
            <th class="right aligned">Сумма выплачена клиентом</th>
            <th>Статус</th>
            <th v-if="showInvestors">Инвестор</th>
            <th>Филиал</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in report" :key="index" :item="item">
            <td>{{ item.row_number }}</td>
            <td>{{ item.brand }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.year_of_issue }}</td>
            <td class="right aligned">
              <span class="nobr">{{ $filters.money(item.car_price) }}</span>
            </td>
            <td>{{ item.plate_number }}</td>
            <td>{{ item.pts_no }}</td>
            <td>
              <span class="nobr">{{ item.customer }}</span>
            </td>
            <td>{{ item.contract_date }}</td>
            <td>{{ item.contract_end_date }}</td>
            <td class="right aligned">
              <span class="nobr">{{ $filters.money(item.contract_to_pay) }}</span>
            </td>
            <td class="right aligned">
              <span class="nobr">{{ $filters.money(item.contract_payed_out) }}</span>
            </td>
            <td>
              <span class="nobr">{{ item.status }}</span>
            </td>
            <td v-if="showInvestors">
              <span class="nobr">{{ item.investor }}</span>
            </td>
            <td>
              <span class="nobr">{{ item.branch }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import { exportCsv } from "@/utils/utils.js";
import CMReportForm from "@/components/CMReportForm.vue";

export default {
  name: "CMReportCars",
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
      columns: [
        "№",
        "Марка",
        "Модель",
        "Год выпуска",
        "Рыночная стоимость",
        "Госномер",
        "ПТС",
        "Клиент",
        "Дата начала договора",
        "Дата окончания договора",
        "Сумма к выкупу",
        "Сумма выплачена клиентом",
        "Статус",
        "Инвестор",
        "Филиал",
      ],
    };
  },

  methods: {
    saveReport() {
      this.saveCsv("report_cars.csv", this.report);
    },
    saveCsv(filename, data) {
      exportCsv(filename, data, this.columns);
    },
    requestReport(payload) {
      // console.log("requestReport: ", payload);
      this.fetchReport("cars", "2000-01-01", "2000-01-01", payload.investors, payload.branches);
    },
    // Networking
    async fetchReport(name, date1, date2, investors_filter, branches_filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getReport(name, date1, date2, investors_filter, branches_filter);
        this.report = result;
        this.report.map((item) => {
          item.contract_date = this.$filters["date"](item.contract_date);
          item.contract_end_date = this.$filters["date"](item.contract_end_date);
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

<style scoped>
.table-wrapper {
  /* border: 1px solid red; */
  /* background-color: green; */
  width: calc(100vw - 19rem) !important;
  height: 100%;
  overflow: auto;
}
</style>
