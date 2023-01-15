<template>
  <!-- New params Modal -->
  <UIModal
    :modal_id="$options.name"
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
    <form class="ui error form" :name="$options.name" :class="{ loading: isLoading }" @submit.prevent>
      <UITextfield v-model.trim.lazy="params.name" placeholder="ИП Иванов И.И." label="Наименование юр. лица" />
      <UITextAria v-model.trim.lazy="params.details" rows="4" placeholder="Реквизиты" label="Реквизиты" />
      <UITextAria
        v-model.trim.lazy="params.bank_details"
        rows="6"
        placeholder="Банковские реквизиты"
        label="Банковские реквизиты"
      />
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

const _companyObject = {
  id: null,
  name: "",
  details: "",
  bank_details: "",
  notes: "",
};

export default {
  name: "ModalCompanyEdit",
  components: {},
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
      title: "Новые реквизиты",
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
      this.params = this.currentCompany;
      // this.params.id = this.selectedItem.id;
      // this.params.name = this.selectedItem.name;
      // this.params.details = this.selectedItem.details;
      // this.params.bank_details = this.selectedItem.bank_details;
      this.api_error = "";
      if (this.currentCompany.id) {
        this.title = "Редактирование реквизитов";
      } else {
        this.title = "Новые реквизиты";
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
      var confirmed = confirm("Вы действительно хотите удалить реквизиты?");
      if (confirmed) {
        this.delete();
      }
    },

    // Networking
    async save() {
      this.isLoading = true;

      try {
        await apiService.createCompany(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Новые реквизиты добавлены");

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
        await apiService.updateCompany(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Реквизиты изменены");

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
      // this.isLoading = true;
      // try {
      //   // let result = await apiService.deleteDTP(this.params.id);
      //   // console.log(result);
      //   this.$UIService.showInfo(null, "Юр. лицо " + this.params.id + " удалён.");
      //   // saved
      //   this.$emit("didChange");
      //   // close modal
      //   this.$emit("hide");
      // } catch (error) {
      //   // console.log("!!!! " + error);
      //   this.$UIService.showNetworkError(error);
      // }
      // this.isLoading = false;
    },
  },
};
</script>
