<template>
  <div class="ui comments">
    <CMPhotoReportListItem2
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

import CMPhotoReportListItem2 from "@/components/CMPhotoReportListItem2.vue";

export default {
  name: "CMPhotoReportsList",
  components: {
    CMPhotoReportListItem2,
  },
  props: {
    reportsStatus: {
      type: Number,
      default: null,
    },
    carId: {
      type: Number,
      default: null,
    },
  },
  emits: ["eventDetails"],
  data() {
    return {
      reports: [],
      isLoading: false,
      filter: {},
      selectedId: 0,
    };
  },

  watch: {
    reportsStatus: {
      immediate: true,
      handler() {
        // newValue, oldValue
        this.refetch(this.reportsStatus, this.filter);

        this.$emit("eventDetails", {});
      },
    },
  },

  methods: {
    handleDetails(item) {
      this.selectedId = item.id;
      this.$emit("eventDetails", item);
    },
    handleHeaderSort(item) {
      this.filter = item;
      this.refetch(this.reportsStatus, item);
    },
    // Networking
    async refetch(status) {
      // tableFilters
      // Check status
      var statuses = [];
      var checks = [];
      var expired = null;
      switch (status) {
        case 0:
          console.log(">all");
          checks = [0, 1, 2, 3, 4, 5];
          statuses = [0, 1, 2, 3, 4, 5];
          break;
        case 1:
          console.log(">todo");
          checks = [0, 1, 2, 3, 4];
          expired = "0";
          break;
        case 2:
          console.log(">К исправлению");
          checks = [5];
          statuses = [0, 1, 2, 3, 4];
          expired = "0";
          break;
        case 3:
          console.log(">Утверженные");
          statuses = [5];
          break;
        case 4:
          console.log(">Просроченные");
          statuses = [0, 1, 2, 3, 4];
          expired = "1";
          break;

        default:
          break;
      }

      this.isLoading = true;

      try {
        let result = await apiService.getPhotoReports(this.carId, statuses, checks, expired);
        this.reports = result;
        if (this.reports.length > 0) {
          this.selectedId = this.reports[0].id;
          this.$emit("eventDetails", this.reports[0]);
        } else {
          this.selectedId = 0;
        }
      } catch (error) {
        this.selectedId = 0;
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
</style>
