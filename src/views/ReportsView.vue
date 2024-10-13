<template>
  <LayoutPage>
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" />
    </template>
    <!-- Reports -->
    <component :is="currentReport" />
    <!--  -->
  </LayoutPage>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useView } from "@/composables/view";

import LayoutPage from "@/layouts/LayoutPage.vue";
import LayoutSideMenu from "@/layouts/LayoutSideMenu.vue";
import TKReportDaily from "@/components/TKReportDaily.vue";
import TKReportMonthly from "@/components/TKReportMonthly.vue";
import TKReportQuantityMonthly from "@/components/TKReportQuantityMonthly.vue";
import TKReportQuantityDaily from "@/components/TKReportQuantityDaily.vue";
import TKReportPicking from "@/components/TKReportPicking.vue";
import TKReportPacking from "@/components/TKReportPacking.vue";
import AccessRightsEnum from "@/enums/AccessRights";

export default {
  name: "ReportsView",

  components: {
    LayoutPage,
    LayoutSideMenu,
    TKReportDaily,
    TKReportMonthly,
    TKReportQuantityMonthly,
    TKReportQuantityDaily,
    TKReportPicking,
    TKReportPacking,
  },

  setup() {
    const { view, checkAuthRole } = useView("ReportsView");

    view.title = "Отчёты";
    view.subTitle = "";

    /// DATA

    const menuSelectedId = ref(0);

    /// COMPUTED

    // const checkAuthNewCustomer = computed(() => {
    //   return checkAuthRole(AccessRightsEnum.CustomersEdit);
    // });

    return { view, menuSelectedId, checkAuthRole };
  },

  data() {
    return {
      menu: [],
      // Reports
      reports: [
        {
          id: 1,
          component: "TKReportDaily",
          name: "По дням",
          icon: "table",
          access: AccessRightsEnum.Reports.Finances,
        },
        {
          id: 2,
          component: "TKReportMonthly",
          name: "По месяцам",
          icon: "table",
          access: AccessRightsEnum.Reports.Finances,
        },
        {
          id: 3,
          component: "TKReportQuantityMonthly",
          name: "Кол-во по месяцам",
          icon: "table",
          access: AccessRightsEnum.Reports.Finances,
        },
        {
          id: 4,
          component: "TKReportQuantityDaily",
          name: "Кол-во по дням",
          icon: "table",
          access: AccessRightsEnum.Reports.Finances,
        },
        {
          id: 5,
          component: "TKReportPicking",
          name: "Товар к сборке",
          icon: "table",
          access: AccessRightsEnum.Reports.Logistics,
        },
        {
          id: 6,
          component: "TKReportPacking",
          name: "Задание на упаковку",
          icon: "table",
          access: AccessRightsEnum.Reports.Logistics,
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
      // console.log(">>>", this.reports);

      return this.reports.find((obj) => {
        return obj.id == self.menuSelectedId;
      }).component;
      // [this.menuSelectedId - 1].component;
    },
  },

  mounted() {
    // Build menu
    const menu = this.reports.filter((report) => {
      return this.checkAuthRole(report.access);
    });

    this.menu = menu;

    this.menuSelectedId = this.menu[0]?.id;
  },
};
</script>
