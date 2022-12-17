<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm
      :date-mode="dateMode"
      :date1-title="date1Title"
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
    <table v-if="report.length" class="ui very compact small collapsing celled table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>Номер</th>
          <th>Дата начала</th>
          <th>Дата окончания</th>
          <th>Автомобиль</th>
          <th>Клиент</th>
          <th v-if="showInvestors">Инвестор</th>
          <th>Филиал</th>
          <th class="right aligned">Стоимость автомобиля</th>
          <th class="right aligned">Выкупная стоимость</th>
          <th class="right aligned">Остаток к выплате</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in report" :key="index" :item="item">
          <td>{{ item.id }}</td>
          <td>{{ $filters.date(item.date_opened) }}</td>
          <td>{{ $filters.date(item.contract_end_date) }}</td>
          <td>{{ item.car }}</td>
          <td>{{ item.fio }}</td>
          <td v-if="showInvestors">{{ item.investor }}</td>
          <td>{{ item.branch }}</td>
          <td class="right aligned">{{ $filters.money(item.car_price) }}</td>
          <td class="right aligned">{{ $filters.money(item.contract_total_payout) }}</td>
          <td class="right aligned">{{ $filters.money(item.ostatok) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import { exportCsv } from "@/utils/utils.js";
import CMReportForm from "@/components/CMReportForm.vue";

export default {
  name: "CMGenericReport",

  components: {
    CMReportForm,
  },

  props: {
    showInvestors: {
      type: Boolean,
      default: false,
    },
    dateMode: {
      type: String,
    },
    date1Title: {
      type: String,
    },
  },

  data() {
    return {
      report: [],
      isLoading: false,
    };
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
        "Дата начала",
        "Дата окончания",
        "Автомобиль",
        "Клиент",
        "Город",
        "Cтоимость авто",
        "Выкупная стоимость",
        "Остаток к выплате",
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
