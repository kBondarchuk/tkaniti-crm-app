<template>
  <!-- New Modal -->
  <UIModal
    modal_id="BrowseInvestors"
    :title="title"
    :active="active"
    :class="size"
    size="middle"
    no-padding
    @cancel="modalCancel"
    @did-show="didShow"
  >
    <!-- List -->
    <div class="scrolling content">
      <CMInvestorsList @event-details="handleItemSelect" />
    </div>
  </UIModal>
  <!-- /New Modal -->
</template>

<script>
// import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";
import CMInvestorsList from "@/components/CMInvestorsList.vue";

export default {
  name: "BrowseInvestors",
  components: {
    UIModal,
    CMInvestorsList,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "middle",
    },
  },

  emits: ["cancelled", "hide", "selected"],

  data() {
    return {
      customer: {
        id: null,
        first_name: "",
        second_name: "",
        last_name: "",
        notes: "",
      },
      title: "",
    };
  },
  methods: {
    // Modal
    reset() {
      this.title = "Выбор инвестора";
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.$emit("cancelled");
      this.$emit("hide");
    },
    didShow() {
      // modal_id
      this.reset();
    },

    // Browser
    handleItemSelect(item) {
      console.log("row clicked: " + item.id);
      // close modal
      this.$emit("selected", item);
    },
  },
};
</script>
