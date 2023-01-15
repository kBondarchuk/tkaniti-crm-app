<template>
  <!-- New deposit Modal -->
  <UIModal
    modal_id="modalBonus"
    :title="title"
    :active="active"
    :is-approvable="isValid"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <UIInputMoney v-model.trim.lazy="deposit.amount" :disabled="isLoading">Сумма</UIInputMoney>
      </div>
      <UITextfield v-model.trim.lazy="deposit.notes" :disabled="isLoading">Комментарий</UITextfield>
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
  name: "FormBonus",
  components: {},
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
      deposit: {
        amount: "",
        notes: "",
      },
      title: "Начисление клиентской премии",
      isLoading: false,
      api_error: "",
    };
  },
  computed: {
    isValid() {
      return this.deposit.amount > 0;
    },
  },
  methods: {
    // Modal

    reset() {
      this.deposit.amount = "";
      this.deposit.notes = "";
      this.api_error = "";
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      // this.fetch();
    },
    modalApproved() {
      // modal_id
      // console.log("approved: " + modal_id);
      this.save();
    },
    modalCancel() {
      // modal_id
      // console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    async save() {
      this.isLoading = true;
      try {
        await apiService.customerAddBonus(this.customer_id, this.deposit.amount, this.deposit.notes);

        // console.log(result);
        this.$UIService.showSuccess(null, "Премия " + this.deposit.amount + " начислена клиенту " + this.customer_id);

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
