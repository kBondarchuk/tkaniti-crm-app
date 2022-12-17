<template>
  <!-- New Modal -->
  <UIModal
    :modal_id="$options.name"
    :title="title"
    :active="active"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :name="$options.name" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <!--  -->
      <div class="grouped fields">
        <label>ДЕЙСТВИЕ</label>
        <div class="field">
          <div class="ui radio checkbox">
            <input id="radio1" v-model="actionType" type="radio" name="example2" value="withdraw" />
            <label for="radio1">Выплатить</label>
          </div>
        </div>
        <div class="field">
          <div class="ui radio checkbox">
            <input id="radio2" v-model="actionType" type="radio" name="example2" value="reinvest" />
            <label for="radio2">Реинвестировать</label>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="two fields">
        <UIInputMoney v-model.lazy="payload.amount" :disabled="isLoading" name="first_name" label="Сумма" />
      </div>
      <!--  -->
      <UITextfield v-model.lazy="payload.notes" :disabled="isLoading" name="notes" label="Комментарий" />
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

let _payloadObject = {
  amount: "",
  notes: "",
};

export default {
  name: "ModalHandleInterest",

  components: {
    UIModal,
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
      payload: Object.assign({}, _payloadObject),
      actionType: "",
      // View
      title: "Выплатить или реинвестировать проценты",
      isLoading: false,
      api_error: "",
    };
  },

  methods: {
    // Modal
    // setTitle(text) {
    //   this.title = "Выплата процентов инвестору " + text;
    // },
    reset() {
      this.payload = Object.assign({}, _payloadObject);
      // this.setTitle("");
      this.actionType = "";
      this.api_error = "";
    },
    didShow() {
      // console.log("didShow: " + modal_id);
      this.reset();
    },
    modalApproved() {
      // console.log("approved: " + modal_id);

      if (this.actionType == "reinvest") {
        this.postReinvest();
      } else if (this.actionType == "withdraw") {
        this.postWithdraw();
      } else {
        this.api_error = "Не выбрана операция!";
      }
    },
    modalCancel() {
      // console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("update:active");
    },
    doneModal() {
      // show success
      if (this.actionType == "reinvest") {
        this.$UIService.showSuccess("Проценты реинвестированы!");
      } else if (this.actionType == "withdraw") {
        this.$UIService.showSuccess("Проценты выплачены!");
      }

      // new created
      this.$emit("created");
      // close modal
      this.$emit("update:active");
    },

    // Networking
    async postWithdraw() {
      this.isLoading = true;
      try {
        await apiService.investorWithdrawInterest(this.investorId, this.payload);
        this.doneModal();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async postReinvest() {
      this.isLoading = true;
      try {
        await apiService.investorReinvestInterest(this.investorId, this.payload);
        this.doneModal();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
