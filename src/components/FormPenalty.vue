<template>
  <!-- New penalty Modal -->
  <UIModal
    modal_id="modalPenalty"
    :title="title"
    :active="active"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <UIInputDate v-model.trim.lazy="penalty.date1" :disabled="isLoading" label="Первый день" />
        <UIInputDate v-model.trim.lazy="penalty.date2" :disabled="isLoading" label="Последний день" />
      </div>
      <UITextfield v-model.trim.lazy="penalty.notes" :disabled="isLoading" label="Комментарий" />
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden>Submit</button>
    </form>
  </UIModal>
  <!-- /New penalty Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormPenalty",

  components: {},

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    contractId: {
      type: Number,
      default: null,
    },
  },
  emits: ["hide", "saved"],

  data() {
    return {
      penalty: {
        date1: "",
        date2: "",
        notes: "",
      },
      title: "Отключение пени",
      isLoading: false,
      api_error: "",
    };
  },

  methods: {
    // Modal
    reset() {
      this.penalty.date1 = null;
      this.penalty.date2 = null;
      this.penalty.notes = "";
      this.api_error = "";
    },
    didShow(modal_id) {
      console.log("didShow: " + modal_id);
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
    async save() {
      this.isLoading = true;
      // TODO: Clear dates - set to null
      try {
        let result = await apiService.setContractPenaltyOff(
          this.contractId,
          this.penalty.date1,
          this.penalty.date2,
          this.penalty.notes
        );

        console.log(result);
        this.$UIService.showSuccess("", "Установлен период отключения пени. ");

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
