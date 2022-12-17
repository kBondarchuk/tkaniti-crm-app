<template>
  <WPanelContainer vertical>
    <WPanel size="22em" no-padding scrollable style="max-height: 90vh">
      <!-- List -->
      <CMPhotoReportsList
        :key="updateKey"
        :car-id="carId"
        :reports-status="menuSelectedId"
        @event-details="handleDetails"
      />
    </WPanel>
    <!-- Details -->
    <CMPhotoReportDetails
      :report-id="selectedReport.id"
      :photo-album-uuid="selectedReport.photo_album_uuid"
      @updated="handelReportUpdated"
    />
    <!--  -->
  </WPanelContainer>
</template>

<script>
import CMPhotoReportsList from "@/components/CMPhotoReportsList.vue";
import CMPhotoReportDetails from "@/components/CMPhotoReportDetails.vue";
import WPanel from "@/components/WPanel.vue";
import WPanelContainer from "@/components/WPanelContainer.vue";

export default {
  name: "CMPhotoReports",

  components: {
    WPanel,
    WPanelContainer,
    CMPhotoReportsList,
    CMPhotoReportDetails,
  },

  props: {
    carId: {
      type: Number,
      default: null,
    },
    menuSelectedId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      // data
      selectedReport: {},
      // Keys
      updateKey: 0,
    };
  },

  methods: {
    handleDetails(item) {
      console.log("row clicked: " + item.id);
      this.selectedReport = item;
    },
    handelReportUpdated() {
      this.updateKey++;
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
