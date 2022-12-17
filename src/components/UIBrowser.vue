<template>
  <!-- New Modal -->
  <UIModal
    modal_id="UIBrowser"
    :title="title"
    :active="active"
    no-padding
    scrolling-content
    @cancel="modalCancel"
    @did-show="didShow"
  >
    <!-- List -->
    <!-- <div class="scrolling content"> -->
    <component :is="component" :header-sticked-at="0" @event-details="handleItemSelect" />
    <!-- </div> -->
  </UIModal>
  <!-- /New Modal -->
</template>

<script>
import UIModal from "@/components/UIModal.vue";
import CMInvestorsList from "@/components/CMInvestorsList.vue";
import CMCustomersList from "@/components/TKCustomersList.vue";
import CMExpensesCategoriesList from "@/components/CMExpensesCategoriesList.vue";
// import UICarsList from "@/components/UICarsList.vue";
// // import apiService from "@/ApiService";

export default {
  name: "UIBrowser",
  components: {
    UIModal,
    CMInvestorsList,
    CMCustomersList,
    CMExpensesCategoriesList,
  },
  props: {
    title: String,
    component: String,
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["cancelled", "hide", "selected"],
  data() {
    return {
      // component: null
      // customer: {
      //   id: null,
      //   first_name: "",
      //   second_name: "",
      //   last_name: "",
      //   notes: ""
      // },
      // title: ""
    };
  },
  methods: {
    // Modal
    // reset() {
    //   this.title = "Выбор инвестора";
    // },
    // modalApproved(modal_id) {},
    modalCancel(modal_id) {
      console.log("Browser [" + this.component + "] cancelled: " + modal_id);
      this.$emit("cancelled");
      this.$emit("hide");
    },
    didShow() {
      // modal_id
      //this.reset();
    },

    // Browser
    handleItemSelect(item) {
      console.log("Browser [" + this.component + "] item index clicked: " + item.id);
      // close modal
      this.$emit("selected", item);
    },
  },
};
</script>
