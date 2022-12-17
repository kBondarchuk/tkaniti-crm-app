<template>
  <!-- New params Modal -->
  <UIModal
    :modal_id="$options.name"
    :title="title"
    :active="active"
    :approve-by-enter="true"
    :delete-button="selectedItem?.term > 0 && selectedItem?.term != 5000"
    approve-button-text="Сохранить"
    scrolling-content
    @cancel="modalCancel"
    @delete="modalDelete"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :name="$options.name" :class="{ loading: isLoading }" @submit.prevent>
      <!--  -->
      <div class="two fields">
        <UIInputNumber v-model="params.term" placeholder="" label="Срок в днях" :disabled="params.term == 5000" />
        <UIInputMoney v-model="params.percent" placeholder="" label="Процент" :decimal-scale="3" />
      </div>
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

import UIModal from "@/components/UIModal.vue";

const _companyObject = {
  id: null,
  term: null,
  percent: "",
};

export default {
  name: "ModalPercentTable",

  components: {
    UIModal,
  },

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
      default: () => {
        return _companyObject;
      },
    },
  },

  emits: ["hide", "didChange"],

  data() {
    return {
      params: Object.assign({}, _companyObject),
      title: "Новая запись",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    currentCompany() {
      return this.selectedItem || _companyObject;
    },
  },

  methods: {
    // Modal
    reset() {
      // this.params = this.currentCompany;
      this.params = Object.assign({}, this.currentCompany);

      // this.params.id = this.selectedItem.id;
      // this.params.name = this.selectedItem.name;
      // this.params.details = this.selectedItem.details;
      // this.params.bank_details = this.selectedItem.bank_details;
      this.api_error = "";
      if (this.currentCompany.id) {
        this.title = "Изменение процентной записи";
      } else {
        this.title = "Новая процентная запись";
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
      if (this.selectedItem?.id) {
        console.log("Updating..");
        this.update();
      } else {
        console.log("Saving..");
        this.create();
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
      var confirmed = confirm("Вы действительно хотите удалить запись?");
      if (confirmed) {
        this.delete();
      }
    },

    // Networking
    async create() {
      this.isLoading = true;

      try {
        await apiService.createLeasePercentTableItem(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Новая запись добавлена");

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
        console.warn(this.params);

        await apiService.updateLeasePercentTableItem(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Запись сохранена");

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
        let result = await apiService.deleteLeasePercentTableItem(this.params.id);
        // console.log(result);
        this.$UIService.showInfo(null, "Запись удалена");
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
