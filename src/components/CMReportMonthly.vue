<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm
      show-save
      :show-investors="showInvestors"
      date-type="month"
      @report-request="requestReport"
      @report-save="saveReport"
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
    <div class="table-wrapper">
      <table v-if="items.length" class="ui very compact small collapsing celled table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <!-- <th rowspan="2">Год</th> -->
            <th rowspan="2" style="border-right: 1px solid #cccccc; position: sticky; left: 0">Год, Месяц</th>
            <th class="right aligned" rowspan="2">Пополнение договоров выкупа</th>
            <th class="right aligned" rowspan="2">Пополнение копилок</th>
            <th class="right aligned" rowspan="2">Возвраты</th>
            <th class="center aligned" colspan="11">Оплачено</th>
            <th class="right aligned" rowspan="2">Процент пени</th>
            <th class="right aligned" rowspan="2">Общие затраты</th>
            <th class="right aligned" rowspan="2">Риски</th>
            <th class="right aligned" rowspan="2">Сумм. разн. цен</th>
            <th class="right aligned" rowspan="2">Новых договоров</th>
            <th class="right aligned" rowspan="2">Закрыто договоров</th>
            <th class="right aligned" rowspan="2">Обменено договоров</th>
            <th class="right aligned" rowspan="2">Выплачено договоров</th>
            <th class="right aligned" rowspan="2">Активных договоров</th>
            <th class="right aligned" rowspan="2">Процент закрытых</th>
          </tr>
          <tr>
            <th class="right aligned" style="border-left: 1px solid rgba(34, 36, 38, 0.1)">Всего</th>
            <!-- <th class="right aligned" style="border-left: 1px solid rgba(34, 36, 38, 0.1)">Коррекция</th> -->
            <th class="right aligned">Первоначальные взносы</th>
            <th class="right aligned">Досрочные погашения</th>
            <th class="right aligned">Регулярные платежи</th>
            <th class="right aligned">Регулярные ОД</th>
            <th class="right aligned">Регулярные Аренда</th>
            <th class="right aligned">Валовая прибыль</th>
            <th class="right aligned">Чистая прибыль</th>
            <th class="right aligned">Пеня</th>
            <th class="right aligned">Проценты по штрафам</th>
            <th class="right aligned">Аренда</th>
          </tr>
        </thead>
        <tbody style="white-space: nowrap">
          <tr v-for="(item, index) in items" :key="index" :item="item">
            <!-- <td>{{ item.year }}</td> -->
            <td
              style="background-color: rgb(246, 246, 246); border-right: 1px solid #cccccc; position: sticky; left: 0"
            >
              {{ item.year }} {{ mapMonth(item.month) }}
            </td>
            <td class="right aligned">{{ $filters.money(item.deposit) }}</td>
            <td class="right aligned">{{ $filters.money(item.deposit_accum) }}</td>
            <td class="right aligned">{{ $filters.money(item.refund) }}</td>
            <td class="right aligned">{{ $filters.money(item.pay_total) }}</td>
            <!-- <td class="right aligned">{{$filters.money(item.correction_payment )}}</td> -->
            <td class="right aligned">{{ $filters.money(item.pay_debt_down) }}</td>
            <td class="right aligned">{{ $filters.money(item.pay_debt_fwd) }}</td>
            <td class="right aligned">{{ $filters.money(item.pay_regular) }}</td>
            <td class="right aligned">{{ $filters.money(item.pay_debt) }}</td>
            <td class="right aligned">{{ $filters.money(item.pay_interest) }}</td>
            <td class="right aligned">{{ $filters.money(item.payment_interest_percent) }}</td>
            <td class="right aligned">{{ $filters.money(item.payment_interest_minus_expenses_percent) }}</td>
            <td class="right aligned">{{ $filters.money(item.pay_penalty) }}</td>
            <td class="right aligned">{{ $filters.money(item.pay_car_fines) }}</td>
            <td class="right aligned">{{ $filters.money(item.pay_rent_debt) }}</td>
            <td class="right aligned">
              <span v-if="item.penalty_percent">{{ $filters.money(item.penalty_percent) }}%</span>
            </td>
            <td class="right aligned">{{ $filters.money(item.expenses_general) }}</td>
            <td class="right aligned">{{ $filters.money(item.expense_risk) }}</td>
            <td class="right aligned">{{ $filters.money(item.car_price_delta) }}</td>
            <td class="right aligned">{{ item.leasing_contracts_count }}</td>
            <td class="right aligned">{{ item.leasing_contracts_aborted }}</td>
            <td class="right aligned">{{ item.leasing_contracts_tradein }}</td>
            <td class="right aligned">{{ item.leasing_contracts_payedout }}</td>
            <td class="right aligned">{{ item.leasing_contracts_active }}</td>
            <td class="right aligned">
              <span v-if="item.leasing_contracts_aborted_percent">{{ item.leasing_contracts_aborted_percent }}%</span>
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
  name: "CMReportMonthly",
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
      // eslint-disable-next-line prettier/prettier
      monthes: ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
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
    // mapType(type) {
    //   switch (type) {
    //     case "payment":
    //       type = "Оплата";
    //       break;
    //     case "charge":
    //       type = "Начисление";
    //       break;

    //     default:
    //       break;
    //   }
    //   return type;
    // },
    mapMonth(num) {
      return this.monthes[num];
    },
    saveCsv(filename, data) {
      exportCsv(filename, data, [
        "Дата",
        "Год",
        "Месяц",
        "Депозит в копилку",
        "Депозит на договор",
        "Возврат",
        // "Коррекция оплат",
        "Оплачено всего",
        "Оплачено первоначальных платежей",
        "Оплачено досрочно",
        "Оплачено регулярно",
        "Оплачено регулярно ОД",
        "Оплачено регулярно Аренда",
        "Валовая прибыль",
        "Чистая прибыль",
        "Оплачено пени",
        "Процент пени",
        "Общие затраты",
        // "Риски",
        "Новых договоров",
        "Закрыто договоров",
        "Обменено договоров",
        "Выплачено договоров",
        "Активных договоров",
        "Процент закрытых",
      ]);
    },
    requestReport(payload) {
      console.log("requestReport: ", payload);
      this.fetchReport("monthly", payload.date1, payload.date2, payload.investors, payload.branches);
    },
    saveReport() {
      this.saveCsv("report_monthly.csv", this.report);
    },
    // Networking
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
  // created() {
  //   // Load saved params
  //   this.date1 = localStorage.getItem("reports.date1_month");
  //   this.date2 = localStorage.getItem("reports.date2_month");
  // },
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
