<template>
  <LayoutPage no-paddings flex>
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-if="showSideMenu" v-model="menuSelectedId" :items="menu" />
    </template>

    <WPanelContainer vertical>
      <WPanel size="22em" no-padding scrollable>
        <!-- List -->
        <CMPromoActionsList
          :reports-status="menuSelectedId"
          :selected-id="selectedActionId"
          @event-details="handleDetails"
          @event-create="handleCreate"
        />
      </WPanel>
      <!-- <WPanel size="22em" scrollable> -->
      <!-- -->
      <CMPromoActionDetails :key="updateKey" :action-id="selectedActionId" @select-action="selectAction" />
      <!-- <CMPromoActionResults :results="results" v-if="results" /> -->

      <!-- <CMPromoActionsList @event-details="handleDetails" :reports-status="menuSelectedId" :key="updateKey" /> -->
      <!-- </WPanel> -->

      <!-- <CMPhotoReportDetails
        :report-id="selectedReport.id"
        :photo-album-uuid="selectedReport.photo_album_uuid"
        @updated="handelReportUpdated"
      /> -->
    </WPanelContainer>
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";
import CMPromoActionsList from "@/components/CMPromoActionsList.vue";
import CMPromoActionDetails from "@/components/CMPromoActionDetails.vue";
// import CMPromoActionResults from "@/components/CMPromoActionResults.vue";
import WPanel from "@/components/WPanel.vue";
import WPanelContainer from "@/components/WPanelContainer.vue";

export default {
  name: "PromoView",
  components: {
    LayoutPage,
    LayoutSideMenu,
    WPanel,
    WPanelContainer,
    CMPromoActionsList,
    CMPromoActionDetails,
  },
  mixins: [viewMixin],
  data() {
    return {
      view: { title: "ЮМ.бонус", subTitle: "Акции" },
      // Side menu
      showSideMenu: true,
      menu: [
        { id: null, name: "Все", icon: "list" },
        { id: 0, name: "Черновики", icon: "" },
        { id: 1, name: "Активные", icon: "" },
        { id: 2, name: "Завершенные", icon: "" },
      ],
      menuSelectedId: null,
      // data
      selectedAction: {},
      // results: null,
      selectedActionId: 0,
      // Keys
      updateKey: 0,
    };
  },
  methods: {
    selectAction(id) {
      console.log("selectAction: ", id);
      this.selectedActionId = id;
    },
    handleCreate() {
      console.log("create new action");
      this.selectedActionId = 0;
      this.updateKey++;
    },
    handleDetails(item) {
      console.log("row clicked: " + item.id);
      this.selectedAction = item;
      this.selectedActionId = item.id;
      this.updateKey++;
    },
    // handleReportUpdated() {
    //   this.updateKey++;
    // },
    // handleResults(results) {
    //   console.log(results);
    //   this.results = results;
    // },
  },
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
