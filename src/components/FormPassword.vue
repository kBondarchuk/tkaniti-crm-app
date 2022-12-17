<template>
  <!-- New Modal -->
  <UIModal
    modal_id="modalPassword"
    :title="title"
    :active="active"
    :is-approvable="isValid"
    approve-button-text="Установить"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <UITextfield v-model.trim.lazy="form.password" :disabled="isLoading">Новый пароль</UITextfield>
      <div class="ui note text-color-grey">
        <ul>
          <li>Длина пароля минимум 5 знаков.</li>
          <li>Установка пустого пароля блокирует доступ клиента в Личный кабинет.</li>
        </ul>
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
  <!-- /New Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";
import UITextfield from "@/components/UITextfield.vue";

export default {
  name: "FormPassword",
  components: {
    UIModal,
    UITextfield,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    customer_id: {
      type: Number,
      default: null,
    },
  },
  emits: ["hide", "saved"],
  data() {
    return {
      form: { password: "" },
      title: "Установка пароля входа в личный кабинет",
      isLoading: false,
      api_error: "",
    };
  },
  computed: {
    isValid() {
      return this.form.password.length > 4 || this.form.password.length == 0;
    },
  },
  methods: {
    // Modal
    reset() {
      this.form.password = "";
      this.api_error = "";
    },
    didShow() {
      this.reset();
    },
    modalApproved() {
      this.save();
    },
    modalCancel() {
      this.isLoading = false;
      this.$emit("hide");
    },
    async save() {
      this.isLoading = true;
      try {
        let result = await apiService.customerSetPassword(this.customer_id, this.form.password);

        console.log(result);
        this.$UIService.showSuccess(null, "Пароль установлен!");

        // saved
        this.$emit("saved");
        // close modal
        this.$emit("hide");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
