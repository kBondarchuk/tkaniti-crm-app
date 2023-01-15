<template>
  <!-- New params Modal -->
  <UIModal
    modal_id="modalCarSell"
    :title="title"
    :active="active"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
    @did-hide="didHide"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <UIInputMoney v-model.trim.lazy="params.price" :disabled="isLoading">Сумма</UIInputMoney>
        <UIInputDate v-model.trim.lazy="params.date" :disabled="isLoading">Дата</UIInputDate>
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
  <!-- /New Investor Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "FormCarSell",
  components: {},
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    carId: {
      type: Number,
      default: null,
    },
  },
  emits: ["saved", "hide"],
  data() {
    return {
      params: {
        price: "",
        date: "",
      },
      result_id: null,
      title: "Продажа автомобиля",
      isLoading: false,
      api_error: "",
    };
  },
  methods: {
    // Modal

    reset() {
      this.params.price = "";
      this.params.date = "";
      this.api_error = "";
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      // this.fetch();
    },
    didHide() {
      this.$emit("saved", this.result_id);
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
        let result = await apiService.sellCar(this.carId, this.params.price, this.params.date);

        this.result_id = result.id;
        // console.log(result);
        this.$UIService.showSuccess(null, "Заявка на продажу автомобиля " + this.carId + " оформлена.");

        // saved
        // this.$emit("saved");
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
