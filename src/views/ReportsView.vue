<template>
  <LayoutPage>
    <!-- Right Title -->
    <template #title>
      <div>
        <h2 class="text-color-grey" style="font-weight: 100">{{ branchesCombined }}</h2>
      </div>
    </template>
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" />
    </template>
    <!-- Reports -->
    <component :is="currentReport" :show-investors="showInvestors" />
    <!--  -->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";
import CMReportSummary from "@/components/CMReportSummary.vue";
import CMReportTransactions from "@/components/CMReportTransactions.vue";
import CMReportTransactionsList from "@/components/CMReportTransactionsList.vue";
import CMReportAcquiringLeaseContracts from "@/components/CMReportAcquiringLeaseContracts.vue";
import CMReportDepositGraph from "@/components/CMReportDepositGraph.vue";
import CMReportToPay from "@/components/CMReportToPay.vue";
import CMReportChargesPayments from "@/components/CMReportChargesPayments.vue";
import CMReportMonthly from "@/components/CMReportMonthly.vue";
import CMReportTransactionsRef from "@/components/CMReportTransactionsRef.vue";
import CMReportReferrers from "@/components/CMReportReferrers.vue";
import CMReportCars from "@/components/CMReportCars.vue";
import CMReportBranches from "@/components/CMReportBranches.vue";
import CMReportOperations from "@/components/CMReportOperations.vue";
import CMReportExpenses from "@/components/CMReportExpenses.vue";
import CMReportLeasingContracts from "@/components/CMReportLeasingContracts.vue";
import CMReportAdvances from "@/components/CMReportAdvances.vue";
import CMReportManualDeposits from "@/components/CMReportManualDeposits.vue";

export default {
  name: "ReportsView",

  components: {
    LayoutPage,
    LayoutSideMenu,
    CMReportSummary,
    CMReportTransactions,
    CMReportTransactionsList,
    CMReportAcquiringLeaseContracts,
    CMReportDepositGraph,
    CMReportToPay,
    CMReportChargesPayments,
    CMReportMonthly,
    CMReportTransactionsRef,
    CMReportReferrers,
    CMReportCars,
    CMReportBranches,
    CMReportOperations,
    CMReportExpenses,
    CMReportLeasingContracts,
    CMReportAdvances,
    CMReportManualDeposits,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Отчёты", subTitle: "" },
      menu: [],
      menuSelectedId: null,
      showInvestors: false,
      // Branches
      branches: [],
      // Reports
      reports: [
        // {
        //   id: 1,
        //   component: "CMReportSummary",
        //   name: "Сводка",
        //   icon: "",
        //   access: "reports.corp",
        // },
        // {
        //   id: 2,
        //   component: "CMReportTransactions",
        //   name: "Фин. операции",
        //   icon: "",
        //   access: "corp_director",
        // },
        {
          id: 3,
          component: "CMReportTransactionsList",
          name: "Пополнения с карт",
          icon: "table",
          access: "reports",
        },
        {
          id: 14,
          component: "CMReportAcquiringLeaseContracts",
          name: "Пополн. с карт на дог.",
          icon: "table",
          access: "reports",
        },
        // {
        //   id: 4,
        //   component: "CMReportDepositGraph",
        //   name: "График пополнений",
        //   icon: "",
        //   access: "reports.corp",
        // },
        {
          id: 5,
          component: "CMReportToPay",
          name: "Остаток к выплате",
          icon: "table",
          access: "reports",
        },
        // {
        //   id: 6,
        //   component: "CMReportChargesPayments",
        //   name: "Начисления/Оплаты",
        //   icon: "file outline",
        //   access: "reports",
        // },
        {
          id: 7,
          component: "CMReportMonthly",
          name: "Помесячный",
          icon: "table",
          access: "reports",
        },
        // {
        //   id: 8,
        //   component: "CMReportTransactionsRef",
        //   name: "Фин. операции (реф)",
        //   icon: "warning",
        //   access: "admin",
        // },
        {
          id: 9,
          component: "CMReportReferrers",
          name: "Приведенные клиенты",
          icon: "table",
          access: "reports",
        },
        {
          id: 10,
          component: "CMReportCars",
          name: "Все автомобили",
          icon: "table",
          access: "reports",
        },
        // {
        //   id: 11,
        //   component: "CMReportBranches",
        //   name: "По филиалам",
        //   icon: "",
        //   access: "reports.corp",
        // },
        // {
        //   id: 12,
        //   component: "CMReportOperations",
        //   name: "Операционный",
        //   icon: "",
        //   access: "reports.corp",
        // },
        // {
        //   id: 13,
        //   component: "CMReportExpenses",
        //   name: "Затраты по категориям",
        //   icon: "file outline",
        //   access: "reports",
        // },
        {
          id: 15,
          component: "CMReportLeasingContracts",
          name: "Договоры выкупа",
          icon: "table",
          access: "reports",
        },
        {
          id: 16,
          component: "CMReportAdvances",
          name: "Подотчетные ДС",
          icon: "table",
          access: "reports",
        },
        {
          id: 17,
          component: "CMReportManualDeposits",
          name: "Внесения депозитов",
          icon: "table",
          access: "reports",
        },
      ],
    };
  },

  computed: {
    currentReport() {
      if (!this.menuSelectedId) return null;

      let self = this;
      console.log(">>>", this.reports);

      return this.reports.find((obj) => {
        console.log("++", self.menuSelectedId);

        return obj.id == self.menuSelectedId;
      }).component;
      // [this.menuSelectedId - 1].component;
    },
    userRights() {
      return this.$store.getters["auth/getAuthRights"];
    },
    branchesCombined() {
      return this.branches.map((item) => item.short_name).join(", ");
    },
  },

  mounted() {
    // Fetch alowed branches
    this.fetchBranches();

    // Build menu
    const menu = this.reports.filter((report) => {
      const rights = this.userRights.filter((value) => report.access.split(",").includes(value));
      return rights.length > 0;
    });

    // console.log(menu);
    this.menu = menu;

    this.menuSelectedId = this.menu[0].id;

    //

    if (this.checkAuthRole("reports.corp")) {
      this.showInvestors = true;
    }
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
    // Networking
    async fetchBranches() {
      this.isLoading = true;
      try {
        let result = await apiService.getBranches();
        this.branches = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
