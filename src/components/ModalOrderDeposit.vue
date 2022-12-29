<template>
  <!-- New deposit Modal -->
  <Teleport to="body">
    <UIModal
      :modal_id="$options.name"
      :title="title"
      :active="active"
      :is-approvable="isValid"
      @cancel="modalCancel"
      @approve="modalApproved"
      @did-show="didShow"
    >
      <form class="ui form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
        <!--  -->
        <div class="two fields">
          <UIInputMoney v-model.trim.lazy="deposit.amount" :disabled="isLoading" label="Сумма" />
        </div>
        <!--  -->
        <UITextfield v-model.trim.lazy="deposit.notes" :disabled="isLoading" label="Комментарий" />
        <!-- error -->
        <div v-if="api_error" class="ui error message">
          <div class="header">Произошла ошибка</div>
          <p>{{ api_error }}</p>
        </div>
        <!-- submit button -->
        <button type="submit" hidden>Submit</button>
      </form>
    </UIModal>
  </Teleport>
  <!--  -->
</template>

<script>
import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";

export default {
  name: "ModalOrderDeposit",

  components: {
    UIModal,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: Number,
      default: null,
    },
  },

  emits: ["update:active", "created", "hide"],

  data() {
    return {
      deposit: {
        amount: "",
        notes: "",
      },
      title: "Внесение оплаты",
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
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.save();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      // this.$emit("hide");
      this.$emit("update:active");
    },
    closeModal() {
      // new created
      this.$emit("created");
      // close modal
      this.$emit("update:active");
    },
    async save() {
      this.isLoading = true;
      try {
        let result = await apiService.orderPay(this.orderId, this.deposit.amount, this.deposit.notes);

        console.log(result);
        this.$UIService.showSuccess(null, "Средства зачислены на заказ " + this.orderId);

        // saved
        this.closeModal();
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
