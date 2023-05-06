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
      scrolling-content
      @cancel="modalCancel"
      @did-show="didShow"
    >
      <!-- List -->
      <TKGoodsList v-if="active || keepAlive" :filter-status="filterStatus" @event-details="handleItemSelect" />
    </UIModal>
    <!-- /New Modal -->
  </Teleport>
</template>

<script>
// import apiService from "@/services/api.service.js";

import TKGoodsList from "@/components/TKGoodsList.vue";

export default {
  name: "BrowseGoods",

  components: {
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
      keepAlive: false,
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
      this.keepAlive = true;
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
