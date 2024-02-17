<template>
  <LayoutPage>
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="viewSideMenuSelectedId" :items="menu" />
    </template>
    <!-- Reports -->
    <component :is="currentReport" />
    <!--  -->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import LayoutPage from "@/layouts/LayoutPage.vue";
import LayoutSideMenu from "@/layouts/LayoutSideMenu.vue";
import TKReportDaily from "@/components/TKReportDaily.vue";
import TKReportMonthly from "@/components/TKReportMonthly.vue";
import TKReportQuantityMonthly from "@/components/TKReportQuantityMonthly.vue";
import TKReportQuantityDaily from "@/components/TKReportQuantityDaily.vue";

export default {
  name: "ReportsView",

  components: {
    LayoutPage,
    LayoutSideMenu,
    TKReportDaily,
    TKReportMonthly,
    TKReportQuantityMonthly,
    TKReportQuantityDaily,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Отчёты", subTitle: "" },
      menu: [],
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
        {
          id: 3,
          component: "TKReportQuantityMonthly",
          name: "Кол-во по месяцам",
          icon: "table",
          access: "user",
        },
        {
          id: 4,
          component: "TKReportQuantityDaily",
          name: "Кол-во по дням",
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
      if (!this.viewSideMenuSelectedId) return null;

      let self = this;
      // console.log(">>>", this.reports);

      return this.reports.find((obj) => {
        // console.log("++", self.viewSideMenuSelectedId);

        return obj.id == self.viewSideMenuSelectedId;
      }).component;
      // [this.viewSideMenuSelectedId - 1].component;
    },
    userRights() {
      return this.$store.getters["auth/getAuthRights"];
    },
  },

  mounted() {
    // Build menu
    const menu = this.reports.filter((report) => {
      const rights = this.userRights.filter((value) => report.access.split(",").includes(value));
      return rights.length > 0;
    });

    console.log(menu);
    this.menu = menu;

    this.viewSideMenuSelectedId = this.menu[0]?.id;
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
    // Networking
  },
};
</script>
