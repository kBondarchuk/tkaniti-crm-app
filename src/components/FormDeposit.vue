<template>
  <!-- New deposit Modal -->
  <UIModal
    modal_id="modalDeposit"
    :title="title"
    :active="active"
    :is-approvable="isValid"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <UIInputMoney v-model.trim.lazy="deposit.amount" :disabled="isLoading" label="Сумма" />
      </div>
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
  <!-- /New Investor Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormDeposit",
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
    // type : ['lease', 'rent']
    type: {
      type: String,
      default: "lease",
    },
  },
  emits: ["saved", "hide"],
  data() {
    return {
      deposit: {
        amount: "",
        notes: "",
      },
      title: "Пополнение депозита",
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
      this.$emit("hide");
    },
    async save() {
      this.isLoading = true;
      try {
        let result;
        if (this.type === "rent") {
          result = await apiService.createRentDeposit(this.contractId, this.deposit.amount, this.deposit.notes);
        } else {
          result = await apiService.createDeposit(this.contractId, this.deposit.amount, this.deposit.notes);
        }

        console.log(result);
        this.$UIService.showSuccess(null, "Средства зачислены на депозит договора " + this.contractId);

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
