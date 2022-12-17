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
            <th>Договор</th>
            <th>Дата начала</th>
            <th>Дата окончания</th>
            <th>Автомобиль</th>
            <th>Клиент</th>
            <th v-if="showInvestors">Инвестор</th>
            <th>Филиал</th>
            <th class="right aligned">Стоимость автомобиля</th>
            <th class="right aligned">Сумма к выплате</th>
            <th class="right aligned">Выплачено ОД</th>
            <th class="right aligned">Доля выплаты ОД</th>
            <th class="right aligned">Доля выплаты</th>
            <th class="right aligned">Выплачено аренды</th>
            <th class="right aligned">Уплачено пени</th>
            <th class="right aligned">Выплачено итого</th>
            <th class="right aligned">Валовая прибыль</th>
            <th class="right aligned">Осталось к выплате</th>
            <th class="right aligned">Срок договора, дн.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in report" :key="index" :item="item">
            <td>{{ item.row_number }}</td>
            <td>{{ item.id }}</td>
            <td>{{ item.date_opened }}</td>
            <td>{{ item.contract_end_date }}</td>
            <td>{{ item.car }}</td>
            <td>
              <span class="nobr">{{ item.customer }}</span>
            </td>
            <td>{{ item.branch }}</td>
            <td v-if="showInvestors">{{ item.investor }}</td>
            <td class="right aligned nobr">
              {{ $filters.money(item.car_price) }}
            </td>
            <td class="right aligned nobr">
              {{ $filters.money(item.total_payout) }}
            </td>
            <td class="right aligned nobr">
              {{ $filters.money(item.debt_paid) }}
            </td>
            <td class="right aligned nobr">{{ $filters.money(item.debt_paid_percent) }}%</td>

            <td class="right aligned nobr">{{ $filters.money(item.contract_paid_percent) }}%</td>

            <td class="right aligned nobr">
              {{ $filters.money(item.interest_paid) }}
            </td>
            <td class="right aligned nobr">
              {{ $filters.money(item.penalty_paid) }}
            </td>
            <td class="right aligned nobr">
              {{ $filters.money(item.total_paid) }}
            </td>
            <td class="right aligned nobr">{{ $filters.money(item.gross_percent) }}%</td>
            <td class="right aligned nobr">
              {{ $filters.money(item.total_left) }}
            </td>
            <td class="right aligned nobr">
              {{ item.contract_days }}
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
  name: "CMReportLeasingContracts",
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
        "Договор",
        "Дата начала",
        "Дата окончания",
        "Автомобиль",
        "Клиент",
        "Инвестор",
        "Филиал",
        "Стоимость автомобиля",
        "Сумма к выплате",
        "Выплачено ОД",
        "Выплачено аренды",
        "Уплачено пени",
        "Осталось к выплате",
        "Выплачено итого",
        "Доля выплаты ОД",
        "Валовая прибыль",
        "Срок договора в днях",
        "Инвестор ID",
        "Филиал ID",
        "Авто ID",
        "Клиент ID",
      ],
    };
  },

  methods: {
    saveReport() {
      this.saveCsv("report_leasing_contracts.csv", this.report);
    },
    saveCsv(filename, data) {
      exportCsv(filename, data, this.columns);
    },
    requestReport(payload) {
      // console.log("requestReport: ", payload);
      this.fetchReport("leasing_contracts", "2000-01-01", "2000-01-01", payload.investors, payload.branches);
    },
    // Networking
    async fetchReport(name, date1, date2, investors_filter, branches_filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getReport(name, date1, date2, investors_filter, branches_filter);
        this.report = result;
        this.report.map((item) => {
          item.date_opened = this.$filters["date"](item.date_opened);
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
