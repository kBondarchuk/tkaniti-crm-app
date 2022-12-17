<template>
  <Teleport to="body">
    <!-- New Modal -->
    <UIModal
      modal_id="BrowseCustomers"
      :title="title"
      :active="active"
      size="fullscreen"
      no-padding
      scrolling-content
      :no-approve-button="!multipleSelection"
      @approve="modalApproved"
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
      <CMCustomersList
        v-if="active || keepAlive"
        :branch-id="filterBranchId"
        :header-sticked-at="0"
        :search-string="searchString"
        :selected-items="selectedItems"
        style="margin-top: 0"
        @event-details="handleCustomerSelect"
      />
    </UIModal>
    <!-- /New Modal -->
  </Teleport>
</template>

<script>
import UIModal from "@/components/UIModal.vue";
import CMCustomersList from "@/components/TKCustomersList.vue";
import UITextSearch from "@/components/UITextSearch.vue";

export default {
  name: "BrowseCustomers",
  components: {
    UIModal,
    CMCustomersList,
    UITextSearch,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    filterBranchId: {
      type: Number,
      default: null,
    },
    multipleSelection: {
      type: Boolean,
      default: false,
    },
    selectedCustomers: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["selected:multiple", "cancelled", "hide", "selected"],

  data() {
    return {
      title: "",
      selectedItems: [],
      searchString: "",
      keepAlive: false,
    };
  },
  methods: {
    // Modal
    reset() {
      this.title = "Выбор клиента";
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.$emit("selected:multiple", this.selectedItems);
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.$emit("cancelled");
      this.$emit("hide");
    },
    didShow() {
      //modal_id
      this.reset();
      this.keepAlive = true;

      this.selectedItems = this.selectedCustomers;
    },

    // Browser
    handleCustomerSelect(item) {
      console.log("row clicked: " + item.id);

      if (this.multipleSelection) {
        const index = this.selectedItems.findIndex((_item) => _item.id == item.id);
        if (index > -1) {
          this.selectedItems.splice(index, 1);
        } else {
          this.selectedItems.push(item);
        }
      } else {
        // close modal
        this.$emit("selected", item);
      }
    },
  },
};
</script>
