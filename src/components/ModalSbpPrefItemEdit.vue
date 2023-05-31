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
      <div class="two fields">
        <UITextfield v-model="params.name" label="Название" />
        <UITextfield v-model="params.notes" label="Описание" />
      </div>
      <UICheckbox id="enabled" v-model="params.enabled" label="Включено" />

      <h5>НАСТРОЙКИ API</h5>

      <div class="two fields">
        <UITextfield v-model="params.payload.api_login" label="API Login" />
        <UITextfield v-model="params.payload.api_password" label="API пароль" />
      </div>

      <UITextfield v-model="params.payload.api_url" label="API URL" />
      <UITextfield v-model="params.payload.api_callback_url" label="API callback URL" />

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
import PaymentsSettingsSbpObject from "@/objects/PaymentsSettingsSbpObject";

// const _sbpPrefObject = {
//   id: null,
//   name: "",
//   notes: "",
//   api_login: "",
//   api_password: "",
//   api_url: "",
//   api_callback_url: "",
// };

export default {
  name: "ModalSbpPrefItemEdit",

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: () => {
        return _sbpPrefObject;
      },
    },
  },

  emits: ["hide", "didChange"],

  data() {
    return {
      params: Object.assign({}, PaymentsSettingsSbpObject),
      title: "Новые настройки СБПs",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    currentItem() {
      return this.selectedItem || PaymentsSettingsSbpObject;
    },
  },

  methods: {
    // Modal
    reset() {
      this.params = this.currentItem;
      this.api_error = "";
      if (this.currentItem.id) {
        this.title = "Редактирование настроек СБП";
      } else {
        this.title = "Новые настройки СБП";
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
        await apiService.createPaymentsSettings(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Новые настройки добавлены");

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
        await apiService.updatePaymentsSettings(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Настройки сохранены");

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

<style scoped>
h5 {
  border-bottom: 1px solid #80808029;
  color: #a0a0a0 !important;
  font-size: 12px;
  font-weight: 400;
}
</style>
