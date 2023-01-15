<template>
  <LayoutPage background="dark">
    <!-- Title -->
    <template v-if="appMode != 'customers'" #title>
      <div class="ui form">
        <div class="inline fields" style="margin-bottom: 0">
          <label>ИНВЕСТОРЫ</label>

          <UIInputDropdownMultiple
            v-model="investor_selected"
            placeholder="Все инвесторы"
            :options="investorsList"
            style="padding-right: 0"
            @update:model-value="handleInvestorsChange"
          />
        </div>
      </div>
    </template>
    <!-- /Title -->
    <div class="stat-main-container">
      <!-- Statistics -->
      <!-- logo panel -->
      <div class="stat-panel logo">
        <!-- Logo -->
        <template v-if="appMode == 'customers'">
          <!-- <img src="/images/yum-auto-logo.svg" alt="Logo" /> -->
          <!-- <h1>{{ $store.state.appName }}</h1> -->
          <img src="http://static.yumservice.ru/logo.crm.svg" alt="Logo" />
        </template>
        <template v-else>
          <img src="/images/yum-auto-logo.svg" alt="Logo" />
        </template>
      </div>

      <!-- favs panel -->
      <div v-if="Object.keys(stats).length > 0" class="stat-panel">
        <h3>ИЗБРАННОЕ</h3>
        <div class="stat-panel-container">
          <CMStatisticsCell
            v-for="(item, index) in items_favorites"
            :key="index"
            :name="item.name"
            :value="stats[item.value]"
            :icon="item.icon"
            :format="item.format"
            :condition="checkCondition(stats[item.value], item.condition)"
            :class="{ loading: isLoading }"
          />
        </div>
      </div>

      <!-- Contracts panel -->
      <div v-if="Object.keys(stats).length > 0" class="stat-panel">
        <h3>ДОГОВОРЫ ВЫКУПА</h3>
        <div class="stat-panel-container">
          <CMStatisticsCell
            v-for="(item, index) in items_contracts"
            :key="index"
            :name="item.name"
            :value="stats[item.value]"
            :title="item.notes"
            :icon="item.icon"
            :format="item.format"
            :class="{ loading: isLoading }"
          />
        </div>
      </div>

      <!-- Finance panel -->
      <div v-if="Object.keys(stats).length > 0" class="stat-panel">
        <h3>ФИНАНСОВЫЕ ПОКАЗАТЕЛИ</h3>
        <div class="stat-panel-container">
          <CMStatisticsCell
            v-for="(item, index) in items"
            :key="index"
            :name="item.name"
            :value="stats[item.value]"
            :title="item.notes"
            :icon="item.icon"
            :format="item.format"
            :condition="checkCondition(stats[item.value], item.condition)"
            :class="{ loading: isLoading }"
          />
        </div>
      </div>
      <!-- cars panel -->
      <div v-if="Object.keys(stats).length > 0" class="stat-panel">
        <h3>АВТОМОБИЛИ</h3>
        <div class="stat-panel-container">
          <CMStatisticsCell
            v-for="(item, index) in items_cars"
            :key="index"
            :name="item.name"
            :value="stats[item.value]"
            :icon="item.icon"
            :format="item.format"
            :class="{ loading: isLoading }"
          />
        </div>
      </div>
      <!-- Customers panel  -->
      <div v-if="Object.keys(stats).length > 0" class="stat-panel">
        <h3>КЛИЕНТЫ</h3>
        <div class="stat-panel-container">
          <CMStatisticsCell
            v-for="(item, index) in items_customers"
            :key="index"
            :name="item.name"
            :value="stats[item.value]"
            :icon="item.icon"
            :format="item.format"
            :class="{ loading: isLoading }"
          />
        </div>
      </div>

      <!-- ----  -->

      <div v-if="Object.keys(stats).length > 0" class="stat-panel full">
        <h3>ВИЗУАЛИЗАЦИЯ</h3>
        <div class="stat-panel-container">
          <!-- Brands -->
          <CMStatisticsGraphCell name="МАРКИ" :chart-data="brandsData" />
          <!-- Genders -->
          <CMStatisticsGraphCell name="ПОЛ КЛИЕНТОВ" :chart-data="genderData" />
          <!-- Customers Types -->
          <CMStatisticsGraphCell name="КЛИЕНТЫ" :chart-data="customersData" />
          <!-- -->
        </div>
      </div>

      <!-- /main container -->
    </div>
    <!-- Loader  -->
    <div v-if="isLoading" class="ui basic segment">
      <div class="ui active loader"></div>
      <p></p>
    </div>
    <!-- /Loader  -->

    <!-- ----  -->
    <!-- <ul>
      <li v-for="(item, index) in Object.entries(stats)" :key="index">{{ item[0] }} = {{ item[1] }}</li>
    </ul>-->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import LayoutPage from "@/components/LayoutPage.vue";
import CMStatisticsCell from "@/components/CMStatisticsCell.vue";
import CMStatisticsGraphCell from "@/components/CMStatisticsGraphCell.vue";
// import CMChart from "@/components/CMChart.vue";

const chartColorSet = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
  red2: "rgb(220, 120, 132)",
  orange2: "rgb(255, 159, 64)",
  yellow2: "rgb(255, 205, 86)",
  green2: "rgb(75, 192, 192)",
  blue2: "rgb(54, 162, 235)",
  purple2: "rgb(153, 102, 255)",
  grey2: "rgb(201, 203, 207)",
};

const chartColors = [
  chartColorSet.blue,
  chartColorSet.green,
  chartColorSet.red,
  chartColorSet.yellow,
  chartColorSet.purple,
  chartColorSet.orange,
  chartColorSet.blue2,
  chartColorSet.yellow2,
  chartColorSet.green2,
  chartColorSet.red2,
  chartColorSet.purple2,
  chartColorSet.orange2,
];

const items_favorites = [
  // ---
  { name: "В обороте", value: "contracts_worked_capital", format: "money" },
  {
    name: "Выплачено",
    value: "contracts_total_payed",
    format: "money",
  },
  {
    name: "Доходность",
    value: "contracts_avg_profit",
    format: "percent",
  },
  {
    name: "Чистая прибыль",
    value: "net_profit",
    format: "percent",
    condition: { decent: 30, good: 40 },
  },
];

const items_contracts = [
  // Contracts
  {
    name: "Всего договоров",
    value: "contracts_total",
    icon: "handshake",
    notes: "В статусах 'Ожидание' и 'Активен'",
  },
  {
    name: "Всего в работе",
    value: "contracts_active",
    icon: "handshake",
    notes: "В статусе 'Активен'",
  },
  {
    name: "Всего выплаченных",
    value: "contracts_payedout",
    icon: "thumbs up",
  },
  {
    name: "Всего закрытых",
    icon: "handshake slash",
    value: "contracts_aborted",
    notes: "Досрочно закрытые",
  },
  { name: "Средний договор", value: "contracts_avg", format: "money" },
  {
    name: "Средний баланс",
    value: "balance_avg",
    format: "money",
  },
  {
    name: "Ср. процент закрытых",
    value: "closed_contracts_percent",
    format: "percent",
    notes: "По отношению к Активным договорам. За последние 6 мес. включая текущий.",
  },
  {
    name: "Ср. новых в мес.",
    value: "contracts_avg_created_per_month",
    notes: "За последние 6 мес. включая текущий.",
  },
  {
    name: "Ср. выплаченных в мес.",
    value: "contracts_avg_payedout_per_month",
    notes: "За последние 6 мес. включая текущий.",
  },
  {
    name: "Ср. закрытых в мес.",
    value: "contracts_avg_aborted_per_month",
    notes: "За последние 6 мес. включая текущий.",
  },
  {
    name: "Дней",
    value: "contracts_avg_days",
    icon: "calendar alternate outline",
    notes: "Средний срок договора в статусе 'Активен'",
  },
];

const items_cars = [
  // Cars
  { name: "Всего", value: "cars_total", icon: "car" },
  { name: "Ср. год", value: "cars_avg_year", icon: "car" },
  {
    name: "Ср. стоимость",
    value: "contracts_avg_car_price",
    format: "money",
    icon: "car",
  },
];

const items_customers = [
  // Customers
  { name: "Всего клиентов", value: "customers_total", icon: "users" },
  { name: "Ср. возраст", value: "customers_avg_age", icon: "user" },
];

const items = [
  { name: "Активы", value: "contracts_sum", format: "money" },
  {
    name: "Маржа",
    value: "contracts_avg_margin",
    format: "percent",
    condition: { decent: 60, good: 80 },
  },
  {
    name: "Месячные затраты",
    value: "expenses_general_avg",
    format: "money",
  },
  //
  {
    name: "План по платежу",
    value: "contracts_avg_payment_plan",
    format: "percent",
    condition: { decent: 90, good: 100 },
    notes: "Ср. платеж (факт) / Ср. платеж (план)",
  },
  //
  {
    name: "Ср. платеж (факт)",
    value: "contracts_avg_daily_payment",
    format: "money",
    notes: "Средний дневной платеж по активным договорам",
  },
  //
  {
    name: "Ср. платеж (план)",
    value: "contracts_avg_recommended_payment",
    format: "money",
    notes: "Средний ОД ✕ 0.002778 (по активным договорам)",
  },
  //
  {
    name: "Кол-во переплат",
    value: "balance_positive_count",
  },
  {
    name: "Кол-во задолженностей",
    value: "balance_negative_count",
  },
  {
    name: "Сумма переплат",
    value: "balance_positive_sum",
    format: "money",
  },
  {
    name: "Сумма задолженностей",
    value: "balance_negative_sum",
    format: "money",
  },
  {
    name: "Платежи сегодня (план)",
    value: "contracts_total_active_daily_payments",
    format: "money",
    notes: "Сумма дневных платежей по активным договорам",
  },
  {
    name: "Ср. платежи в день (факт)",
    value: "total_today_payments",
    format: "money",
    notes: "Средняя сумма оплат в день (ОД+Проценты) в текущем месяце",
  },
  {
    name: "Себестоимость активов",
    value: "cost_price_of_assets",
    format: "money",
    notes: "Сумма закупки автомобилей (в Гараже, в Ремонте, в Аренде), плюс остаток выплаты ОД по всем договорам.",
  },
];

export default {
  name: "StatisticsView",
  components: {
    LayoutPage,
    CMStatisticsCell,
    CMStatisticsGraphCell,
  },
  mixins: [viewMixin],
  data() {
    return {
      appMode: import.meta.env.VUE_APP_MODE,
      // Items
      items: items,
      items_favorites: items_favorites,
      items_contracts: items_contracts,
      items_cars: items_cars,
      items_customers: items_customers,
      // Data
      stats: {},
      investors: [],
      investor_selected: [],
      // View
      view: { title: "Статистика", subTitle: "" },
      isLoading: false,
    };
  },
  computed: {
    brandsData() {
      // return {
      //   labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
      //   datasets: [
      //     {
      //       backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
      //       data: [40, 20, 80, 10],
      //     },
      //   ],
      // };
      return {
        labels: Object.keys(this.stats.cars_brands),
        datasets: [
          {
            label: "Data One",
            backgroundColor: chartColors,
            data: Object.values(this.stats.cars_brands),
          },
        ],
      };
    },
    genderData() {
      return {
        labels: Object.keys(this.stats.customers_genders),
        datasets: [
          {
            label: "Data One",
            backgroundColor: chartColors,
            data: Object.values(this.stats.customers_genders),
          },
        ],
      };
    },
    customersData() {
      return {
        labels: Object.keys(this.stats.customers_types),
        datasets: [
          {
            label: "Data One",
            backgroundColor: chartColors,
            data: Object.values(this.stats.customers_types),
          },
        ],
      };
    },
    investorsList() {
      return this.investors.map((item) => {
        return { name: item.last_name, value: item.id };
      });
    },
  },
  mounted() {
    // this.fetch(this.investor_selected);
    this.fetchInvestors();
  },
  methods: {
    handleInvestorsChange() {
      // Prepare Investors
      var investors_filter = null;
      if (this.investor_selected.length == 0) {
        // All
        investors_filter = this.investors.map((item) => item.id).join(",");
      } else {
        // Selected
        investors_filter = this.investor_selected.join(",");
      }

      this.fetch(investors_filter);
    },
    // Network
    async fetchInvestors() {
      // this.isLoading = true;
      try {
        let result = await apiService.getInvestors();
        this.investors = result;

        // Fetch Report
        this.handleInvestorsChange();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      // this.isLoading = false;
    },
    async fetch(investors) {
      this.isLoading = true;
      try {
        let result = await apiService.getStatistics(investors);
        this.stats = result;
        // console.log(Object.keys(this.stats).length);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    checkCondition(value, condition) {
      if (condition == undefined) return null;
      // console.log("->", value, condition);

      if (parseFloat(value) >= condition.good) {
        return "good";
      }
      if (parseFloat(value) >= condition.decent) {
        return "decent";
      }
      if (parseFloat(value) < condition.decent) {
        return "bad";
      }
    },
  },
};
</script>
