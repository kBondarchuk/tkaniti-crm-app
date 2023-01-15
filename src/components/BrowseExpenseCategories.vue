<template>
  <Teleport to="body">
    <!-- New Modal -->
    <UIModal
      :modal_id="$options.name"
      :title="title"
      :active="active"
      size="tiny"
      no-padding
      scrolling-content
      @cancel="modalCancel"
      @did-show="didShow"
    >
      <!-- List -->
      <CMExpensesCategoriesList :filter-type="filterType" :header-sticked-at="0" @event-details="handleItemSelect" />
      <!--  -->
    </UIModal>
    <!-- /New Modal -->
  </Teleport>
</template>

<script>
import CMExpensesCategoriesList from "@/components/CMExpensesCategoriesList.vue";

export default {
  name: "BrowseExpenseCategories",

  components: {
    CMExpensesCategoriesList,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    filterType: {
      type: Number,
      default: null,
    },
  },

  emits: ["cancelled", "hide", "selected"],

  data() {
    return {
      title: "Выбор категории затрат",
    };
  },

  methods: {
    // Modal
    reset() {
      // this.title = "Выбор категории затрат";
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
