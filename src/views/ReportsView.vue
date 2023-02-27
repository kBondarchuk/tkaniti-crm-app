<template>
  <LayoutPage>
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
import TKReportDaily from "@/components/TKReportDaily.vue";
import TKReportMonthly from "@/components/TKReportMonthly.vue";

export default {
  name: "ReportsView",

  components: {
    LayoutPage,
    LayoutSideMenu,
    TKReportDaily,
    TKReportMonthly,
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
        {
          id: 1,
          component: "TKReportDaily",
          name: "По дням",
          icon: "table",
          access: "user",
        },
        {
          id: 2,
          component: "TKReportMonthly",
          name: "По месяцам",
          icon: "table",
          access: "user",
        },
        // {
        //   id: 2,
        //   component: "CMReportTransactions",
        //   name: "Фин. операции",
        //   icon: "",
        //   access: "corp_director",
        // },
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
    // branchesCombined() {
    //   return this.branches.map((item) => item.short_name).join(", ");
    // },
  },

  mounted() {
    // Fetch alowed branches
    // this.fetchBranches();

    // Build menu
    const menu = this.reports.filter((report) => {
      const rights = this.userRights.filter((value) => report.access.split(",").includes(value));
      return rights.length > 0;
    });

    console.log(menu);
    this.menu = menu;

    this.menuSelectedId = this.menu[0]?.id;
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
    // Networking
  },
};
</script>
