<template>
  <!-- New params Modal -->
  <!-- :deleteButton="params.id > 0" -->
  <UIModal
    modal_id="ModalExpenseCategoryEdit"
    :title="title"
    :active="active"
    :approve-by-enter="false"
    approve-button-text="Сохранить"
    scrolling-content
    @cancel="modalCancel"
    @delete="modalDelete"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent>
      <!--  -->
      <UITextfield v-model.trim.lazy="params.name" label="Название" />
      <!--  -->
      <div class="two fields">
        <!-- Тип расхода -->
        <UIInputDropdown
          v-model="params.expense_type_id"
          label="Тип расхода"
          :options="[
            { name: 'Филиал', value: 0 },
            { name: 'Автомобиль', value: 1 },
          ]"
        />
        <!-- Родительская статья -->
        <UIInputNumber v-model="params.parent_id" label="ID родительской статьи" />
        <!--  -->
      </div>
      <!--  -->
      <UICheckbox id="selectable" v-model="params.selectable" label="Выбираемая статья" />
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

const _itemObject = {
  id: null,
  name: "",
  expense_type_id: 0,
  parent_id: null,
  selectable: false,
};

export default {
  name: "ModalExpenseCategoryEdit",

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    // branchId: {
    //   type: Number,
    //   default: null,
    // },
    selectedItem: {
      type: Object,
      default: null,
    },
  },

  emits: ["didChange", "hide"],

  data() {
    return {
      params: Object.assign({}, _itemObject),
      title: "Новая статья",
      isLoading: false,
      api_error: "",
    };
  },

  methods: {
    // Modal
    reset() {
      // this.params.id = this.selectedItem.id;
      // this.params.name = this.selectedItem.name;
      // this.params.expense_type_id = this.selectedItem.expense_type_id;
      // this.params.parent_id = this.selectedItem.parent_id;
      // this.params.selectable = this.selectedItem.selectable;

      if (this.selectedItem) {
        this.params = Object.assign({}, this.selectedItem);
        this.title = "Редактирование статьи расхода";
      } else {
        this.params = Object.assign({}, _itemObject);
        this.title = "Новая статья расхода";
      }

      this.api_error = "";
    },
    didShow() {
      // modal_id
      console.warn("selectedItem: " + JSON.stringify(this.selectedItem));
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
      var confirmed = confirm("Вы действительно хотите удалить статью?");
      if (confirmed) {
        this.delete();
      }
    },

    // Networking
    async save() {
      this.isLoading = true;

      try {
        await apiService.createCategory(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Новая статья создана.");

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
        await apiService.updateCategory(this.params);

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
        await apiService.deleteCategory(this.params.id);

        // console.log(result);
        this.$UIService.showInfo(null, "Статья " + this.params.id + " удалена.");

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
