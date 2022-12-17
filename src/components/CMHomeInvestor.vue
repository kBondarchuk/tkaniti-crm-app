<template>
  <LayoutPage background="dark">
    <!-- Toolbar -->
    <template #title>
      <div class="ui-tool-bar-local">
        <!--  -->
        <UISpacer />
        <!--  -->
        <UIButton
          icon="sliders horizontal"
          type="basic labeled"
          text="Реинвестирование"
          @click="modals.reinvest = true"
        />
        <!-- <UIButton icon="right chevron" type="basic labeled" text="Вывод" /> -->
      </div>
    </template>
    <!-- /Toolbar -->
    <!-- Tabs -->
    <!-- <div class="ui big buttons">
      <button class="ui button" :class="activeTab == 1" @click="activeTab = 1">Основное</button>
      <button class="ui button" :class="activeTab == 2" @click="activeTab = 2">Детально</button>
    </div> -->

    <!--  -->
    <div class="stat-main-container">
      <!-- favs panel -->
      <!--  -->
      <div class="stat-panel full">
        <h3>ИЗБРАННОЕ</h3>
        <div class="stat-panel-container">
          <CMStatisticsCell name="Сумма инвестиций" :value="accounts.investments_balance" format="money" />
          <CMStatisticsCell name="Накопленные проценты" :value="accounts.interest_balance" format="money" />
          <CMStatisticsCell name="Процентная ставка" :value="billingPlan.year_percent" format="percent" />
          <CMStatisticsCell name="Срок, дней" :value="billingPlan.current_period" icon="calendar alternate outline" />
          <CMStatisticsCell name="Реинвестировано" :value="accounts.interest_reinvest_credit" format="money" />
          <CMStatisticsCell name="Выплачено" :value="accounts.interest_withdraw_credit" format="money" />
          <CMStatisticsCell name="Дата выплаты" :value="billingPlan.date_next_closing" format="date" />
          <CMStatisticsCell name="Процент реинвестирования" :value="billingPlan.reinvest_percent" format="percent" />
        </div>
      </div>
      <!--  -->
      <div class="stat-panel full">
        <h3>ВИЗУАЛИЗАЦИЯ</h3>
        <div class="stat-panel-container">
          <!-- Brands -->
          <CMStatisticsLineGraphCell
            name="ИНВЕСТИЦИИ"
            :chartdata="investmentsData"
            :loading="stats.investments_loading"
          />
          <CMStatisticsBarGraphCell name="ДОХОД" :chartdata="interestData" :loading="stats.interest_loading" />
        </div>
      </div>

      <div v-if="investor_id" class="stat-panel full">
        <h3>ФИН ОПЕРАЦИИ</h3>
        <div class="stat-panel-container">
          <div
            class="stat-cell"
            style="padding-top: 0; padding-bottom: 0; padding-left: 0; padding-right: 0; background-color: white"
          >
            <CMOperationsList
              size=""
              striped
              :investor-id="investor_id"
              operations-type="investors"
              operations-sub-type="investments"
              :operations-subject-id="investor_id"
              :show-id="false"
              :show-author="false"
              :show-basis="false"
              :show-investor="false"
              :show-branch="false"
              :no-border="true"
              :displayed-items="15"
              style="border-radius: 20px"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalInvestorReinvestSettings v-model:active="modals.reinvest" :investor-id="investor_id" @created="fetchAll()" />
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";
import CMStatisticsCell from "@/components/CMStatisticsCell.vue";
import CMStatisticsLineGraphCell from "@/components/CMStatisticsLineGraphCell.vue";
import CMStatisticsBarGraphCell from "@/components/CMStatisticsBarGraphCell.vue";
import CMOperationsList from "@/components/CMOperationsList.vue";
import ModalInvestorReinvestSettings from "@/components/ModalInvestorReinvestSettings.vue";

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
  blue_t: "rgb(54, 162, 235, 0.2)",
  green_t: "rgb(75, 192, 192, 0.2)",
};

export default {
  name: "CMHomeInvestor",

  components: {
    CMStatisticsCell,
    CMStatisticsLineGraphCell,
    CMStatisticsBarGraphCell,
    CMOperationsList,
    ModalInvestorReinvestSettings,
  },

  mixins: [viewMixin],

  data() {
    return {
      // View
      view: {
        title: "Начальная страница",
        subTitle: "Страница инвестора",
      },
      //
      investor_id: null,
      investor: {},
      billingPlan: {},
      accounts: {},
      stats: {
        investments: [],
        interest: [],
        investments_loading: false,
        interest_loading: false,
      },
      // Tabs
      // activeTab: 1,
      // Modals
      modals: {
        reinvest: false,
      },
    };
  },

  computed: {
    investmentsData() {
      return {
        labels: [...this.stats.investments.map((item) => this.$filters["date"](item.day)), ...["Сегодня"]],
        datasets: [
          {
            // label: "Data One",
            borderColor: chartColorSet.blue,
            backgroundColor: chartColorSet.blue_t,
            borderWidth: 1,
            data: [...this.stats.investments.map((item) => item.closed_debet), ...[this.accounts.investments_balance]],
          },
        ],
      };
    },
    interestData() {
      return {
        labels: this.stats.interest.map((item) => this.$filters["date_no_year"](item.week_date)),
        // labels: [
        //   "01.11",
        //   "08.11",
        //   "15.11",
        //   "22.11",
        //   "29.11",
        //   "06.12",
        //   "13.12",
        //   "20.12",
        //   "27.12",
        //   "03.01",
        //   "10.01",
        //   "17.01",
        //   "24.01",
        // ],
        datasets: [
          {
            // label: "Data One",
            borderColor: chartColorSet.green,
            backgroundColor: chartColorSet.green,
            borderWidth: 1,
            stack: "Stack 0",
            // data: ["38356.22", "76712.44", "115068.66", "126027.58"], //this.stats.interest.map((item) => item.closed_debet),
            data: this.stats.interest.map((item) => item.amount_fact),
          },
          {
            // label: "Data One",
            borderColor: chartColorSet.grey2_t,
            backgroundColor: chartColorSet.grey2_t,
            borderWidth: 1,
            stack: "Stack 0",
            // data: [
            //   "0",
            //   "0",
            //   "0",
            //   "27397.30",
            //   "191781.10",
            //   "230137.32",
            //   "268493.54",
            //   "306849.76",
            //   "345205.98",
            //   "383562.20",
            //   "421918.42",
            //   "460274.64",
            //   "498630.86",
            // ],
            data: this.stats.interest.map((item) => item.amount_plan_and_fact),
          },
        ],
      };
    },
  },

  mounted() {
    this.fetchAll();
  },

  methods: {
    setTitle() {
      if (Object.keys(this.investor).length > 0)
        // eslint-disable-next-line prettier/prettier
        this.view.title = this.investor.last_name + " " + this.investor.first_name + " " + this.investor.second_name ;
    },
    // Network
    async fetchAll() {
      const investor_id = this.$store.getters["auth/getAuthData"].investors[0];

      if (!investor_id) return;
      this.investor_id = parseInt(investor_id);

      await this.fetchInvestor(investor_id);
      this.fetchBillingPlan(investor_id);
      this.fetchAccounts(investor_id);
      this.fetchStatsInterest(investor_id);
      this.fetchStatsInvestments(investor_id);
    },
    async fetchInvestor(investor_id) {
      this.isLoading = true;
      try {
        this.investor = await apiService.getInvestor(investor_id);
        this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchBillingPlan(investor_id) {
      this.isLoading = true;
      try {
        this.billingPlan = await apiService.getInvestorActiveBillingPlan(investor_id);
      } catch (error) {
        if (error.response.status == 404) {
          this.billingPlan = null;
        } else {
          this.$UIService.showNetworkError(error);
        }
      }
      this.isLoading = false;
    },
    async fetchAccounts(investor_id) {
      this.isLoading = true;
      try {
        this.accounts = await apiService.getInvestorAccountsInvestments(investor_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchStatsInterest(investor_id) {
      this.stats.interest_loading = true;
      try {
        this.stats.interest = await apiService.getInvestorsInterestHistory(investor_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.stats.interest_loading = false;
    },
    async fetchStatsInvestments(investor_id) {
      this.stats.investments_loading = true;
      try {
        this.stats.investments = await apiService.getInvestorsStatsHistoryInvestment(investor_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.stats.investments_loading = false;
    },
  },
};
</script>

<style scoped>
.stat-panel-container > .stat-cell {
  flex-basis: 23%;
  flex-grow: 1;
}
</style>
