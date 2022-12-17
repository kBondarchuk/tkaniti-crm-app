<template>
  <WPanel size="26em" no-padding scrollable style="max-height: 90vh">
    <div class="ui comments">
      <div class="add" :class="{ active: 0 == selectedId }" @click="handleCreate">
        <i class="plus icon"></i>Новое уведомление
      </div>
      <CMNotificationsListItem
        v-for="item in messages"
        :key="item.id"
        :item="item"
        :class="{ active: item.id == selectedId }"
        @event-details="handleDetails(item)"
      ></CMNotificationsListItem>
    </div>
  </WPanel>
</template>

<script>
import apiService from "@/services/api.service.js";

import WPanel from "@/components/WPanel.vue";
import CMNotificationsListItem from "@/components/CMNotificationsListItem.vue";

export default {
  name: "CMNotificationsList",
  components: {
    WPanel,
    CMNotificationsListItem,
  },
  props: {
    reportsStatus: {
      type: Number,
      default: null,
    },
    selectedId: {
      type: Number,
      default: null,
    },
  },
  emits: ["eventDetails", "eventCreate"],
  data() {
    return {
      messages: [],
      isLoading: false,
      filter: { sort_order: "asc", sort_by: "status" },
      // selectedId: 0,
    };
  },

  watch: {
    reportsStatus: {
      immediate: true,
      handler() {
        //newValue, oldValue
        this.fetchList(this.reportsStatus, this.filter);

        this.$emit("eventDetails", {});
      },
    },
    selectedId: {
      immediate: false,
      //newValue, oldValue
      handler() {
        // console.log("!!!", newValue);

        // if (newValue > 0) {
        this.fetchList(this.reportsStatus, this.filter);
        // this.$emit("eventDetails", newValue);
        // }
      },
    },
  },

  methods: {
    handleCreate() {
      // this.selectedId = 0;
      this.$emit("eventCreate");
    },
    handleDetails(item) {
      // this.selectedId = item.id;
      this.$emit("eventDetails", item);
    },
    handleHeaderSort(item) {
      this.filter = item;
      // this.refetch(this.reportsStatus, item);
    },
    // Networking
    async fetchList(tableFilters) {
      this.isLoading = true;

      try {
        let result = await apiService.getNotifications(tableFilters);
        this.messages = result;
      } catch (error) {
        // this.selectedId = 0;
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
/* .ui.comments {
  max-height: 100vh;
} */

.ui.comments .add {
  text-align: center;
  height: 4em;
  line-height: 4em;
  font-weight: bold;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
}
.ui.comments .add.active {
  background: rgba(0, 0, 0, 0.07);
}

.ui.comments .add:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
