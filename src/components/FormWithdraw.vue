<template>
  <!-- New Investment Modal -->
  <UIModal
    modal_id="modalWithdraw"
    :title="title"
    :active="active"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" name="form_investment" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <!--  -->
        <UIInputDate v-model.lazy="investment.date" label="Дата" :disabled="isLoading" name="last_name" />
        <!--  -->
        <UIInputMoney v-model.lazy="investment.amount" label="Сумма" :disabled="isLoading" name="first_name" />
        <!--  -->
      </div>
      <!--  -->
      <UITextfield v-model.lazy="investment.notes" label="Комментарий" :disabled="isLoading" name="second_name" />
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
  name: "FormWithdraw",

  components: {
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    investorId: {
      type: Number,
      default: null,
    },
  },

  emits: ["update:active", "created"],

  data() {
    return {
      investment: {
        id: null,
        investor_id: null,
        date: "",
        amount: "",
        notes: "",
      },
      title: "",
      isLoading: false,
      api_error: "",
    };
  },

  methods: {
    // Modal
    setTitle(text) {
      this.title = "Выплата инвестору " + text;
    },
    reset() {
      this.setTitle("");
      this.set({
        id: null,
        investor_id: this.investorId,
        date: "",
        amount: "",
        notes: "",
      });
      this.api_error = "";
    },
    didShow(modal_id) {
      console.log("didShow: " + modal_id);
      this.reset();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.fetchWithdraw();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("update:active");
    },
    // Item
    set(item) {
      this.investment.id = item.id;
      this.investment.investor_id = item.investor_id;
      this.investment.date = item.date;
      this.investment.amount = item.amount;
      this.investment.notes = item.notes;
    },
    closeModal() {
      // new created
      this.$emit("created");
      // close modal
      this.$emit("update:active");
    },

    // Networking
    async fetchWithdraw() {
      this.isLoading = true;
      try {
        let result = await apiService.investorWithdraw(
          this.investment.investor_id,
          this.investment.date,
          this.investment.amount,
          this.investment.notes
        );
        console.log(result);
        this.closeModal();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
