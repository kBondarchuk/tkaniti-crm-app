<template>
  <!-- New params Modal -->
  <UIModal
    modal_id="modalBranchEdit"
    :title="title"
    :active="active"
    :approve-by-enter="false"
    :delete-button="params.id > 0"
    approve-button-text="Сохранить"
    scrolling-content
    @cancel="modalCancel"
    @delete="modalDelete"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent>
      <UITextfield v-model.trim.lazy="params.name">Название</UITextfield>
      <UITextfield v-model.trim.lazy="params.short_name">Сокращенное название</UITextfield>
      <UITextfield v-model.trim.lazy="params.description">Описание</UITextfield>
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
    </form>
  </UIModal>
  <!-- /New Investor Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormBranchEdit",
  components: {},
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    branchId: {
      type: Number,
      default: null,
    },
    selectedItem: {
      type: Object,
      default: () => {
        return {
          name: "",
          short_name: "",
          description: "",
        };
      },
    },
  },
  emits: ["hide", "didChange"],
  data() {
    return {
      params: {
        id: this.branchId,
        name: "",
        short_name: "",
        description: "",
      },
      title: "Новый филиал",
      isLoading: false,
      api_error: "",
    };
  },
  methods: {
    // Modal
    reset() {
      this.params.id = this.selectedItem.id;
      this.params.name = this.selectedItem.name;
      this.params.short_name = this.selectedItem.short_name;
      this.params.description = this.selectedItem.description;
      this.api_error = "";
      if (this.selectedItem.id || this.selectedItem.id === 0) {
        this.title = "Редактирование филиала";
      } else {
        this.title = "Новый филиал";
      }
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      // this.fetch();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      if (this.params.id || this.params.id === 0) {
        console.log("Updating..");
        this.update();
      } else {
        console.log("Saving..");
        this.save();
      }
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    modalDelete(modal_id) {
      console.log("delete: " + modal_id);
      // this.$emit("hide");
      var confirmed = confirm("Вы действительно хотите удалить филиал?");
      if (confirmed) {
        this.delete();
      }
    },
    async save() {
      this.isLoading = true;

      try {
        await apiService.createBranch(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Новый филиал создан.");

        // saved
        this.$emit("didChange");
        // close modal
        this.$emit("hide");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async update() {
      this.isLoading = true;

      try {
        await apiService.updateBranch(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Филиал изменен.");

        // saved
        this.$emit("didChange");
        // close modal
        this.$emit("hide");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async delete() {
      this.isLoading = true;

      try {
        // let result = await apiService.deleteDTP(this.params.id);

        // console.log(result);
        this.$UIService.showInfo(null, "Филиал " + this.params.id + " удалён.");

        // saved
        this.$emit("didChange");
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
