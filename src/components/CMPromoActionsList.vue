<template>
  <div class="ui comments">
    <div class="add" :class="{ active: 0 == selectedId }" @click="handleCreate">
      <i class="plus icon"></i>Новая акция
    </div>
    <CMPromoActionsListItem
      v-for="item in reports"
      :key="item.id"
      :item="item"
      :class="{ active: item.id == selectedId }"
      @event-details="handleDetails(item)"
    />
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

import CMPromoActionsListItem from "@/components/CMPromoActionsListItem.vue";

export default {
  name: "CMPromoActionsList",
  components: {
    CMPromoActionsListItem,
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
      reports: [],
      isLoading: false,
      filter: { sort_order: "desc", sort_by: "id" },
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
      handler() {
        //newValue, oldValue
        this.fetchList(this.reportsStatus, this.filter);

        // this.$emit("eventDetails", {});
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
    async fetchList(status, tableFilters) {
      var status_arr = new Array();
      if (!status && status !== 0) {
        status_arr.push(0, 1, 2);
      } else {
        status_arr.push(status);
      }

      this.isLoading = true;

      try {
        let result = await apiService.getPromoActions(status_arr, tableFilters);
        this.reports = result;
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
.ui.comments {
  /* overflow: auto; */
  /* background-color: burlywood; */
  /* height: 100%; */
  max-height: 100vh;
}

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
