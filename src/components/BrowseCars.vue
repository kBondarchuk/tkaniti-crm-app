<template>
  <Teleport to="body">
    <!-- New Modal -->
    <UIModal
      modal_id="BrowseCars"
      :title="title"
      :active="active"
      size="fullscreen"
      no-padding
      scrolling-content
      no-approve-button
      @cancel="modalCancel"
      @did-show="didShow"
    >
      <!-- Поиск -->
      <div
        class="ui-tool-bar-local"
        style="padding: 0.5em; background-color: rgb(249, 250, 251); border-bottom: rgba(34, 36, 38, 0.15) 1px solid"
      >
        <UISpacer />
        <UITextSearch v-model="searchString" placeholder="Поиск..." />
        <UISpacer />
      </div>
      <!-- List -->
      <CMCarsList
        v-if="active || keepAlive"
        :filter-status="filterStatus"
        :search-string="searchString"
        :header-sticked-at="0"
        style="margin-top: 0"
        @event-details="handleItemSelect"
      />
      <!--  -->
    </UIModal>
    <!-- /New Modal -->
  </Teleport>
</template>

<script>
import UIModal from "@/components/UIModal.vue";
import CMCarsList from "@/components/CMCarsList.vue";
import UITextSearch from "@/components/UITextSearch.vue";

export default {
  name: "BrowseCars",

  components: {
    UIModal,
    CMCarsList,
    UITextSearch,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
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
      searchString: "",
      keepAlive: false,
    };
  },

  methods: {
    // Modal
    reset() {
      this.title = "Выбор автомобиля";
    },
    //modalApproved(modal_id) {},
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
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
      console.log("row clicked: " + item.id);
      // close modal
      this.$emit("selected", item);
    },
  },
};
</script>
