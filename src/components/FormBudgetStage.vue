<template>
  <!-- New FormBudgetStage Modal -->
  <UIModal
    modal_id="FormBudgetStage"
    :title="title"
    :active="active"
    :is-approvable="isValid"
    :approve-by-enter="false"
    :approve-button-text="buttonText"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <!-- <div class="two fields">
        <UIInputMoney v-model.trim.lazy="deposit.amount" :disabled="isLoading">Сумма</UIInputMoney>
      </div> -->
      <UITextAria v-model.trim.lazy="notes" :rows="5" :disabled="isLoading">Комментарий</UITextAria>
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
  name: "FormBudgetStage",
  components: {},
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    requestId: {
      type: Number,
      default: null,
    },
    status: {
      type: Number,
      default: null,
    },
  },
  emits: ["hide", "saved"],
  data() {
    return {
      // Data
      notes: "",
      buttonText: "Отправить",
      // View
      title: "Отправить на согласование",
      isLoading: false,
      api_error: "",
      // Strings
      successText: [
        "",
        "Заявка передана на согласование",
        "Заявка отклонена",
        "Заявка принята на исправление",
        "Заявка согласована",
      ],
    };
  },
  computed: {
    isValid() {
      return true;
    },
  },
  methods: {
    // Modal
    reset() {
      switch (this.status) {
        case 1:
          this.title = "Отправить на согласование";
          this.buttonText = "Отправить";
          break;
        case 2:
          this.title = "Отклонение заявки";
          this.buttonText = "Отклонить";
          break;
        case 3:
          this.title = "Взять на исправление";
          this.buttonText = "Взять";
          break;
        case 4:
          this.title = "Утверждение заявки";
          this.buttonText = "Утвердить";
          break;

        default:
          break;
      }

      this.notes = "";
      this.api_error = "";
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      // this.fetch();
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
    async save() {
      this.isLoading = true;
      try {
        await apiService.stageBudgetRequest(this.requestId, this.status, this.notes);
        this.$UIService.showSuccess(null, this.successText[this.status]);
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
