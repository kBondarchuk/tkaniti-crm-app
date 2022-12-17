<template>
  <LayoutPage no-paddings flex>
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-if="showSideMenu" v-model="menuSelectedId" :items="menu" />
    </template>
    <!--  -->
    <CMPhotoReports :key="updateKey" :car-id="null" :menu-selected-id="menuSelectedId" />
    <!--  -->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";
import CMPhotoReports from "@/components/CMPhotoReports.vue";

export default {
  name: "PhotoReportsView",

  components: {
    LayoutPage,
    LayoutSideMenu,
    CMPhotoReports,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Фото-отчёты", subTitle: "Проверка фото-отчётов" },
      // Side menu
      showSideMenu: true,
      menu: [
        { id: 1, name: "К проверке", icon: "question circle" },
        { id: 2, name: "На исправлении", icon: "exclamation circle" },
        { id: 3, name: "Принятые", icon: "check circle", label: "" },
        { id: 4, name: "Просроченные", icon: "ban", label: "" },
      ],
      menuSelectedId: 1,
      // data
      // selectedReport: {},
      // Keys
      updateKey: 0,
    };
  },
  // methods: {
  //   handleDetails(item) {
  //     console.log("row clicked: " + item.id);
  //     this.selectedReport = item;
  //   },
  //   handelReportUpdated() {
  //     this.updateKey++;
  //   },
  // },
};
</script>

<style scoped>
.ui.grid {
  margin-top: 0;
  margin-bottom: 0;
  height: 100%;
}
.ui.grid > .column.list {
  padding-right: 0;
  border-right: 1px solid rgba(34, 36, 38, 0.15);
  padding-top: 0;
  padding-bottom: 0;
}
.ui.grid > .second.column {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
