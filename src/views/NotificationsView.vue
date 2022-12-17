<template>
  <LayoutPage no-paddings flex>
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-if="showSideMenu" v-model="menuSelectedId" :items="menu" />
    </template>

    <WPanelContainer vertical>
      <!-- List -->
      <CMNotificationsList
        :reports-status="menuSelectedId"
        :selected-id="selectedMessageId"
        @event-details="handleDetails"
        @event-create="handleCreate"
      />
      <!-- Details -->
      <CMNotificationsDetails :message-id="selectedMessageId" @created-message="createdMessage" />
      <!--  -->
    </WPanelContainer>
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

// import WPanel from "@/components/WPanel.vue";
import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";
import WPanelContainer from "@/components/WPanelContainer.vue";
import CMNotificationsList from "@/components/CMNotificationsList.vue";
import CMNotificationsDetails from "@/components/CMNotificationsDetails.vue";

export default {
  name: "NotificationsView",
  components: {
    LayoutPage,
    LayoutSideMenu,
    // WPanel,
    WPanelContainer,
    CMNotificationsList,
    CMNotificationsDetails,
  },
  mixins: [viewMixin],
  data() {
    return {
      view: { title: "Уведомления", subTitle: "" },
      // Side menu
      showSideMenu: true,
      menu: [{ id: null, name: "Все", icon: "list" }],
      menuSelectedId: null,
      // data
      selectedMessage: {},
      // results: null,
      selectedMessageId: 0,
      // Keys
      // updateKey: 0,
    };
  },
  methods: {
    // selectAction(id) {
    //   console.log("selectAction: ", id);
    //   this.selectedMessageId = id;
    // },
    handleCreate() {
      // console.log("create new action");
      this.selectedMessageId = 0;
      // this.updateKey++;
    },
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.selectedMessage = item;
      this.selectedMessageId = item.id;
      // this.updateKey++;
    },
    createdMessage(id) {
      this.selectedMessageId = id;
    },
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
