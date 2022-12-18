<template>
  <Teleport to="body">
    <!-- New Modal -->
    <UIModal
      :modal_id="$options.name"
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
        <TKGoodsList :filter-status="filterStatus" @event-details="handleItemSelect" />
      </div>
    </UIModal>
    <!-- /New Modal -->
  </Teleport>
</template>

<script>
// import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";
import TKGoodsList from "@/components/TKGoodsList.vue";

export default {
  name: "BrowseGoods",

  components: {
    UIModal,
    TKGoodsList,
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
    filterStatus: {
      type: Array,
      default: null,
    },
  },

  emits: ["cancelled", "hide", "selected"],

  data() {
    return {
      title: "",
    };
  },

  methods: {
    // Modal
    reset() {
      this.title = "Выбор товара";
    },
    modalCancel(modal_id) {
      console.log("[BrowseGoods]: cancelled: " + modal_id);
      this.$emit("cancelled");
      this.$emit("hide");
    },
    didShow() {
      // modal_id
      this.reset();
    },

    // Browser
    handleItemSelect(item) {
      console.log("[BrowseGoods]: row clicked: " + item.id);
      // close modal
      this.$emit("selected", item);
    },
  },
  //
};
</script>
