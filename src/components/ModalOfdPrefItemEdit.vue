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

      <h5>ПАРАМЕТРЫ ЧЕКА</h5>

      <!-- Receipt -->
      <UITextfield v-model="params.payload.item_label" label="Наименование услуги в чеке" />
      <div class="two fields">
        <!-- Налогообложение -->
        <!-- <UITextfield v-model="params.payload.taxation_system" label="Система налогообложения" /> -->
        <UIInputDropdownString
          v-model="params.payload.taxation_system"
          label="Система налогообложения"
          :options="optionsTaxSystem"
        />
        <!-- НДС -->
        <UIInputDropdownString v-model="params.payload.vat" label="Вид вычисляемого НДС" :options="optionsVat" />
      </div>

      <div class="two fields">
        <UIInputDropdown
          v-model="params.payload.payment_method"
          label="Способ расчета"
          :options="optionsPaymentMethod"
        />
        <UIInputDropdown
          v-model="params.payload.payment_type"
          label="Признак предмета расчета"
          :options="optionsPaymentType"
        />
      </div>

      <div class="two fields">
        <UITextfield v-model="params.payload.inn" label="ИНН" />
      </div>

      <h5>НАСТРОЙКИ API</h5>

      <!-- API: -->
      <div class="two fields">
        <UITextfield v-model="params.payload.api_login" label="Login" />
        <UITextfield v-model="params.payload.api_password" label="пароль" />
      </div>
      <UITextfield v-model="params.payload.api_url" label="URL" />
      <UITextfield v-model="params.payload.api_callback_url" label="Callback URL" />

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
import PaymentsSettingsObject from "@/objects/PaymentsSettingsOfdObject";

// api_login: "fermatest1"
// api_password: "Hjsf3321klsadfAA"
// description: "ИП Каратаева Л.М."
// enabled: 1
// id: 1
// item_label: "Оплата выкупа автомобиля"
// name: "larisak"
// payment_method: 4
// payment_type: 0
// taxation_system: "Common"
// vat: "VatNo"

export default {
  name: "ModalOfdPrefItemEdit",

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: () => {
        return PaymentsSettingsObject;
      },
    },
  },

  emits: ["hide", "didChange"],

  data() {
    return {
      params: Object.assign({}, PaymentsSettingsObject),
      title: "Новые настройки ОФД",
      isLoading: false,
      api_error: "",
      //
      optionsTaxSystem: [
        { name: "Не указан", value: null },
        { name: "ОСН", value: "Common" },
        { name: "УСН (Доход)", value: "SimpleIn" },
        { name: "УСН (Доход-Расход)", value: "SimpleInOut" },
        { name: "ЕНВД", value: "Unified" },
        { name: "Единый сельскохозяйственный налог", value: "UnifiedAgricultural" },
        { name: "Патентная система", value: "Patent" },
      ],
      optionsVat: [
        { name: "Не указан", value: null },
        { name: "Без НДС", value: "VatNo" },
        { name: "НДС 20%", value: "Vat10" },
        { name: "НДС 18%", value: "Vat18" },
        { name: "НДС 20%", value: "Vat20" },
        { name: "НДС 0%", value: "Vat0" },
        { name: "Вычисленный НДС 10% от 110% суммы", value: "CalculatedVat10110" },
        { name: "Вычисленный НДС 18% от 118% суммы", value: "CalculatedVat18118" },
        { name: "Вычисленный НДС 20% от 120% суммы", value: "CalculatedVat20120" },
      ],
      optionsPaymentMethod: [
        { name: "Не указан", value: null },
        { name: "Предоплата 100%", value: 1 },
        { name: "Предоплата", value: 2 },
        { name: "Аванс", value: 3 },
        { name: "Полный расчет", value: 4 },
        { name: "Частичный расчет", value: 5 },
        { name: "Передача кредита", value: 6 },
        { name: "Оплата кредита", value: 7 },
      ],
      optionsPaymentType: [
        { name: "Не указан", value: null },
        { name: "Товар", value: 1 },
        { name: "Подакцизный товар", value: 2 },
        { name: "Работа", value: 3 },
        { name: "Услуга", value: 4 },
        { name: "Ставка азартной игры", value: 5 },
        { name: "Выигрыш азартной игры", value: 6 },
        { name: "Лотерейный билет", value: 7 },
        { name: "Выигрыш лотереи", value: 8 },
        { name: "Предоставление РИД", value: 9 },
        { name: "Платеж", value: 10 },
        { name: "Агентское вознаграждение", value: 11 },
        { name: "Составной предмет расчета", value: 12 },
        { name: "Иной предмет расчета", value: 13 },
        { name: "Имущественное право", value: 14 },
        { name: "Внереализационный доход", value: 15 },
        { name: "Страховые взносы", value: 16 },
        { name: "Торговый сбор", value: 17 },
        { name: "Курортный сбор", value: 18 },
        { name: "Залог", value: 19 },
      ],
    };
  },

  computed: {
    currentItem() {
      return this.selectedItem || PaymentsSettingsObject;
    },
  },

  methods: {
    // Modal
    reset() {
      this.params = this.currentItem;
      this.api_error = "";
      if (this.currentItem.id) {
        this.title = "Редактирование настроек ОФД";
      } else {
        this.title = "Новые настройки ОФД";
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
      var confirmed = confirm("Вы действительно хотите удалить?");
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
