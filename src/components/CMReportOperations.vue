<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm show-save="" date-type="month" @report-request="requestReport" @report-save="saveReport" />
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
    <div class="table-wrapper">
      <table v-if="items.length" class="ui very compact small collapsing celled table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th rowspan="2" class="sticky-row">Филиал</th>
            <th class="right aligned" rowspan="2">Депозит</th>
            <th class="right aligned" rowspan="2">Возврат</th>
            <th class="center aligned" rowspan="2">Начислено</th>
            <th class="center aligned" rowspan="2">Коррекция начислений</th>
            <th class="center aligned" colspan="6">Оплачено</th>
            <th class="right aligned" rowspan="2">Процент пени</th>
            <th class="right aligned" rowspan="2">Средний чек</th>
            <th class="right aligned" rowspan="2">Средний баланс</th>
            <th class="right aligned" rowspan="2">Сумма задолж.</th>
            <th class="right aligned" rowspan="2">Кол-во задолж.</th>
            <th class="right aligned" rowspan="2">Дней просрочки</th>
            <th class="right aligned" rowspan="2">Общие затраты</th>
            <th class="right aligned" rowspan="2">Риски</th>
            <th class="right aligned" rowspan="2">Новых договоров</th>
            <th class="right aligned" rowspan="2">Закрыто договоров</th>
            <th class="right aligned" rowspan="2">Выплачено договоров</th>
            <th class="right aligned" rowspan="2">Активных договоров <br />(на конец периода)</th>
            <th class="right aligned" rowspan="2">Процент закрытых</th>
          </tr>
          <tr>
            <th class="right aligned" style="border-left: 1px solid rgba(34, 36, 38, 0.1)">Всего</th>
            <th class="right aligned" style="border-left: 1px solid rgba(34, 36, 38, 0.1)">Коррекция</th>
            <th class="right aligned">Первоначальные взносы</th>
            <th class="right aligned">Досрочные погашения</th>
            <th class="right aligned">Регулярные платежи</th>
            <th class="right aligned">Пеня</th>
          </tr>
        </thead>
        <tbody style="white-space: nowrap">
          <template v-for="(item, index) in items" :key="index">
            <tr :class="{ bold: item.branch == null }">
              <td v-if="item.branch == null" class="sticky-row">Компания</td>
              <td v-else class="sticky-row" v-html="'&nbsp;&nbsp;' + item.branch"></td>
              <td class="right aligned">{{ $filters.money(item.deposit) }}</td>
              <td class="right aligned">{{ $filters.money(item.refund) }}</td>
              <td class="right aligned">{{ $filters.money(item.charge) }}</td>
              <td class="right aligned">{{ $filters.money(item.charge_correction) }}</td>
              <td class="right aligned">{{ $filters.money(item.payment_total) }}</td>
              <td class="right aligned">{{ $filters.money(item.payment_correction) }}</td>
              <td class="right aligned">{{ $filters.money(item.payment_down) }}</td>
              <td class="right aligned">{{ $filters.money(item.payment_forward) }}</td>
              <td class="right aligned">{{ $filters.money(item.payment) }}</td>
              <td class="right aligned">{{ $filters.money(item.penalty_payed) }}</td>
              <td class="right aligned">
                <span v-if="item.penalty_percent">{{ $filters.money(item.penalty_percent) }}%</span>
              </td>
              <td class="right aligned">{{ $filters.money(item.contract_daily_payment) }}</td>
              <td class="right aligned">{{ $filters.money(item.contract_balance) }}</td>
              <td class="right aligned">{{ $filters.money(item.contract_debts) }}</td>
              <td class="right aligned">{{ $filters.money(item.contract_debts_count) }}</td>
              <td class="right aligned">{{ $filters.money(item.contract_debts_days) }}</td>
              <td class="right aligned">{{ $filters.money(item.expense_general) }}</td>
              <td class="right aligned">{{ $filters.money(item.expense_risk) }}</td>
              <td class="right aligned">{{ item.contracts_count }}</td>
              <td class="right aligned">{{ item.contracts_aborted }}</td>
              <td class="right aligned">{{ item.contracts_payedout }}</td>
              <td class="right aligned">{{ item.contracts_active }}</td>
              <td class="right aligned">
                <span v-if="item.penalty_percent">{{ item.aborted_percent }}%</span>
              </td>
            </tr>
          </template>
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
  name: "CMReportOperations",
  components: {
    CMReportForm,
  },
  data() {
    return {
      report: [],
      isLoading: false,
      // eslint-disable-next-line prettier/prettier
    };
  },
  computed: {
    items() {
      if (this.report.length > 0) {
        return this.report;
      } else {
        return [];
      }
    },
  },
  methods: {
    mapMonth(num) {
      return this.monthes[num];
    },
    saveCsv(filename, data) {
      exportCsv(filename, data, [
        "Филиал",
        "Депозит",
        "Возврат",
        "Начислено",
        "Коррекция начислений",
        "Оплачено всего",
        "Коррекция оплат",
        "Оплачено первоначальных платежей",
        "Оплачено досрочно",
        "Оплачено регулярно",
        "Оплачено пени",
        "Процент пени",
        "Общие затраты",
        "Риски",
        "Новых договоров",
        "Закрыто договоров",
        "Выплачено договоров",
        "Активных договоров",
        "Процент закрытых",
        "Средний чек",
        "Средний баланс",
        "Сумма задолж",
        "Кол-во задолж",
        "Дней просрочки",
      ]);
    },
    requestReport(payload) {
      console.log("requestReport: ", payload);
      this.fetchReport("operations", payload.date1, payload.date2, payload.investors);
    },
    saveReport() {
      this.saveCsv(
        "report_operations.csv",
        this.report.map((item) => {
          if (item.branch === null) {
            item.branch = "Компания";
          }
          return item;
        })
      );
    },
    // Networking
    async fetchReport(name, date1, date2, investors_filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getReport(name, date1, date2, investors_filter);
        this.report = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
  // created() {
  //   // Load saved params
  //   this.date1 = localStorage.getItem("reports.date1_month");
  //   this.date2 = localStorage.getItem("reports.date2_month");
  // },
};
</script>

<style scoped>
tbody > tr.bold > td {
  font-weight: bold;
}
.table-wrapper {
  /* border: 1px solid red; */
  /* background-color: green; */
  width: calc(100vw - 19rem) !important;
  height: 100%;
  overflow: auto;
}
.table-wrapper::-webkit-scrollbar {
  display: none;
}
.table-wrapper:hover::-webkit-scrollbar {
  display: block;
}

.sticky-row {
  background-color: rgb(249, 250, 251);
  border-right: 1px solid rgba(34, 36, 38, 0.1);
  position: sticky;
  left: 0;
}
</style>
