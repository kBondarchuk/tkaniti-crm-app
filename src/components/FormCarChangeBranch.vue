<template>
  <!-- New params Modal -->
  <UIModal
    modal_id="ModalCarChangeBranch"
    :title="title"
    :active="active"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <!-- Branch -->
        <UIInputDropdown v-model="branch_id" :options="optionsBranch">Филиал</UIInputDropdown>
      </div>
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden>Submit</button>
    </form>
  </UIModal>
  <!-- /New Investor Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormCarChangeBranch",
  components: {},
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    carId: {
      type: Number,
      default: null,
    },
    currentBranch: {
      type: Number,
      default: null,
    },
  },
  emits: ["hide", "saved"],
  data() {
    return {
      params: {
        price: "",
        date: "",
      },
      title: "Изменение филиала",
      isLoading: false,
      api_error: "",
      // Branches
      branches: [],
      branch_id: null,
    };
  },
  computed: {
    optionsBranch() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.branches.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
  },
  methods: {
    // Modal

    reset() {
      this.params.price = "";
      this.params.date = "";
      this.api_error = "";
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      // this.branch_id = this.currentBranch;
      this.fetchBranchesThenItem();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.save();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    // Networking
    async fetchBranchesThenItem() {
      await this.fetchBranches();
      this.branch_id = this.currentBranch;
    },
    async fetchBranches() {
      this.isLoading = true;
      try {
        let result = await apiService.getBranches();
        this.branches = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async save() {
      this.isLoading = true;
      try {
        let result = await apiService.changeBranchForCar(this.carId, this.branch_id);

        console.log(result);
        this.$UIService.showSuccess(null, `Филиал автомобиля ${this.carId} изменён.`);

        // saved
        this.$emit("saved");
        // close modal
        this.$emit("hide");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
