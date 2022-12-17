<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm
      show-save
      date-mode="single"
      date-type="month"
      date1-title="Отчётный месяц"
      @report-request="requestReport"
      @report-save="saveReport"
    />
    <!--  -->
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
      <table
        v-if="items.length"
        class="ui very compact small collapsing celled selectable table"
        :class="{ loading: isLoading }"
        style="white-space: nowrap"
      >
        <thead>
          <tr>
            <!-- <th class="right aligned">Сумма</th> -->
            <th style="border-right: 1px solid #cccccc; position: sticky; left: 0">Клиент / Автомобиль</th>
            <th>Договор</th>
            <!-- <th>Автомобиль</th> -->
            <th class="center aligned">План</th>
            <th class="center aligned">Всего</th>
            <th class="center aligned">1</th>
            <th class="center aligned">2</th>
            <th class="center aligned">3</th>
            <th class="center aligned">4</th>
            <th class="center aligned">5</th>
            <th class="center aligned">6</th>
            <th class="center aligned">7</th>
            <th class="center aligned">8</th>
            <th class="center aligned">9</th>
            <th class="center aligned">10</th>
            <th class="center aligned">11</th>
            <th class="center aligned">12</th>
            <th class="center aligned">13</th>
            <th class="center aligned">14</th>
            <th class="center aligned">15</th>
            <th class="center aligned">16</th>
            <th class="center aligned">17</th>
            <th class="center aligned">18</th>
            <th class="center aligned">19</th>
            <th class="center aligned">20</th>
            <th class="center aligned">21</th>
            <th class="center aligned">22</th>
            <th class="center aligned">23</th>
            <th class="center aligned">24</th>
            <th class="center aligned">25</th>
            <th class="center aligned">26</th>
            <th class="center aligned">27</th>
            <th class="center aligned">28</th>
            <th class="center aligned">29</th>
            <th class="center aligned">30</th>
            <th class="center aligned">31</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in items" :key="'ad' + index">
            <template v-if="items[index - 1]">
              <tr v-if="items[index - 1].customer_id != item.customer_id">
                <th colspan="1" style="background-color: rgb(246, 246, 246); position: sticky; left: 0">
                  {{ item.customer }}
                </th>
                <th colspan="34" style="background-color: rgba(212, 212, 213, 0.2)"></th>
              </tr>
            </template>
            <template v-else>
              <tr>
                <th colspan="1" style="background-color: rgb(246, 246, 246); position: sticky; left: 0">
                  {{ item.customer }}
                </th>
                <th colspan="34" style="background-color: rgb(246, 246, 246)"></th>
              </tr>
            </template>
            <tr>
              <td style="background: white; border-right: 1px solid #e3e3e3; position: sticky; left: 0">
                {{ item.car }}
              </td>
              <td class="center aligned">{{ item.contract_id }}</td>
              <td @click.stop="loadPlan(item.contract_id, index)">
                <span class="nobr">{{ $filters.money(item.plan) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.total) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D1) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D2) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D3) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D4) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D5) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D6) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D7) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D8) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D9) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D10) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D11) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D12) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D13) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D14) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D15) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D16) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D17) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D18) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D19) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D20) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D21) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D22) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D23) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D24) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D25) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D26) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D27) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D28) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D29) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D30) }}</span>
              </td>
              <td>
                <span class="nobr">{{ $filters.money(item.D31) }}</span>
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
import CMReportForm from "@/components/CMReportForm.vue";
import { exportCsv } from "@/utils/utils.js";

export default {
  name: "CMReportDepositGraph",
  components: {
    CMReportForm,
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
    // eslint-disable-next-line no-unused-vars
    loadPlan(contract_id, index) {
      // this.fetchPayplan(contract_id, index);
    },
    saveCsv(filename, data) {
      // prettier-ignore
      exportCsv(filename, data, [
          "Год",
          "Месяц",
          "Договор",
          "customer_id",
          "car_id",
          "Клиент",
          "Автомобиль",
          "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31",
          "Всего"
        ])
    },
    requestReport(payload) {
      console.log("requestReport: ", payload);
      if (payload.date1) {
        this.fetchReport("deposit_graph", payload.date1, payload.date2, payload.investors);
      }
    },
    saveReport() {
      this.saveCsv("report_income.csv", this.report);
    },
    // Network
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

    async fetchPayplan(contract_id, index) {
      this.isLoading = true;

      try {
        let result = await apiService.getContractsPayplan(
          contract_id,
          this.date1,
          "2020-01-01" // dump
        );
        this.report[index].plan = result[result.length - 1].amount;
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
