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
        <UITextfield v-model.trim.lazy="params.name" placeholder="ИП Иванов И.И." label="Наименование юр. лица" />
        <!-- <UITextfield v-model="params.inn" placeholder="" label="ИНН" /> -->
      </div>

      <h5>НАСТРОЙКИ ПЛАТЕЖНОЙ СИСТЕМЫ</h5>

      <div class="two fields">
        <!-- Acquiring -->
        <UIInputDropdown v-model="params.acq_settings_id" label="Эквайринг" :options="optionsAcq" />
        <!-- СБП -->
        <UIInputDropdown v-model="params.sbp_settings_id" label="СБП" :options="optionsSbp" />
      </div>
      <div class="two fields">
        <!-- Касса / OFD -->
        <UIInputDropdown v-model="params.ofd_settings_id" label="Онлайн касса" :options="optionsOfd" />
      </div>

      <h5>РЕКВИЗИТЫ ДЛЯ ДОГОВОРОВ</h5>

      <UITextAria v-model.trim.lazy="params.details" rows="2" placeholder="Реквизиты" label="Реквизиты" />
      <UITextAria
        v-model.trim.lazy="params.bank_details"
        rows="7"
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

import CompanyObject from "@/objects/CompanyObject";

export default {
  name: "ModalCompanyEdit",

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: () => {
        return CompanyObject;
      },
    },
  },
  emits: ["hide", "didChange"],

  data() {
    return {
      params: Object.assign({}, CompanyObject),
      acqItems: [],
      sbpItems: [],
      ofdItems: [],
      // UI
      title: "Новые реквизиты",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    currentCompany() {
      return this.selectedItem || CompanyObject;
    },
    optionsAcq() {
      let menu = [{ name: "Нет", value: null }].concat(
        this.acqItems.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    optionsSbp() {
      let menu = [{ name: "Нет", value: null }].concat(
        this.sbpItems.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    optionsOfd() {
      let menu = [{ name: "Нет", value: null }].concat(
        this.ofdItems.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
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
      this.getOptions();
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
    async getPaymentsSettings(filter) {
      this.isLoading = true;

      filter["settings_type"] = "ofd";

      try {
        let result = await apiService.getPaymentsSettings(filter);
        // console.log(result);
        return result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async getOptions() {
      this.isLoading = true;
      this.ofdItems = await apiService.getPaymentsSettings({ settings_type: "ofd", enabled: 1 });
      this.acqItems = await apiService.getPaymentsSettings({ settings_type: "acq", enabled: 1 });
      this.sbpItems = await apiService.getPaymentsSettings({ settings_type: "sbp", enabled: 1 });
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
