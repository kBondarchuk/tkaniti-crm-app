<template>
  <div>
    <!-- Filter Form -->
    <CMReportForm @report-request="requestReport" @report-save="saveReport" />
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
          <th>Тип операции</th>
          <th>Категория</th>
          <th class="right aligned">Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" :item="item">
          <td :class="{ 'text-bold': item.category_id == null }">{{ mapType(item.type_id) }}</td>
          <td v-if="item.category_id">{{ item.category }}</td>
          <td v-else></td>
          <td class="right aligned" :class="{ 'text-bold': item.category_id == null }">
            {{ $filters.money(item.sum) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMReportForm from "@/components/CMReportForm.vue";

export default {
  name: "CMReportTransactions",
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
      if (this.report.length > 0) {
        return this.report.filter((item) => item.type_id);
      } else {
        return [];
      }
    },
  },
  methods: {
    mapType(type) {
      switch (type) {
        case "deposit":
          type = "Пополнение вручную";
          break;
        case "deposit_acq":
          type = "Пополнение с карты";
          break;
        case "expense":
          type = "Затраты";
          break;
        case "investment":
          type = "Инвестиции";
          break;
        case "payment":
          type = "Оплата (выкуп)";
          break;
        case "payment_interest":
          type = "Оплата (аренда)";
          break;
        case "payment_down":
          type = "Оплата (первоначальный взнос)";
          break;
        case "payment_fwd":
          type = "Оплата (досрочная)";
          break;
        case "payment_penalty":
          type = "Оплата (пеня)";
          break;
        case "charge_penalty":
          type = "Начисление пени";
          break;
        case "charge":
          type = "Начисление выкупа";
          break;
        case "charge_interest":
          type = "Начисление процентов";
          break;
        case "charge_fwd":
          type = "Начисление досрочной оплаты";
          break;
        case "charge_down":
          type = "Начисление первоначального взноса";
          break;
        case "reinvestment":
          type = "Реинвестиция";
          break;
        case "correction":
          type = "Коррекция";
          break;
        case "refund":
          type = "Возврат";
          break;

        default:
          break;
      }
      return type;
    },
    requestReport(payload) {
      console.log("requestReport: ", payload);
      this.fetchReport("transactions_total", payload.date1, payload.date2, payload.investors);
    },
    saveReport() {
      // this.saveCsv("report_.csv", this.report);
    },
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
};
</script>
