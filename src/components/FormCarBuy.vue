<template>
  <!-- New params Modal -->
  <UIModal
    modal_id="modalCarBuy"
    :title="title"
    :active="active"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
    @did-hide="didHide"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <UIInputMoney v-model.trim.lazy="params.price" :disabled="isLoading">Цена покупки</UIInputMoney>
        <UIInputDate v-model.trim.lazy="params.date" :disabled="isLoading">Дата покупки</UIInputDate>
        <!--  -->
      </div>

      <div class="fields">
        <!-- <label>ДЕЙСТВИЕ</label> -->
        <div class="field">
          <div class="ui radio checkbox">
            <input id="radio1" v-model="params.requestType" type="radio" name="example2" value="expense" />
            <label for="radio1">Прямая оплата</label>
          </div>
        </div>
        <div class="field">
          <div class="ui radio checkbox">
            <input id="radio2" v-model="params.requestType" type="radio" name="example2" value="advance_report" />
            <label for="radio2">Авансовый отчёт</label>
          </div>
        </div>
      </div>
      <!-- User -->
      <div class="two fields">
        <UIInputDropdown
          v-model="params.recipient_user_id"
          :options="optionsUsers"
          label="Подотчетное лицо"
          :disabled="isRecipientDisabled"
        />
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
  name: "FormCarBuy",

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
    purchasePrice: {
      type: String,
      default: null,
    },
  },
  emits: ["saved", "hide"],

  data() {
    return {
      params: {
        price: "",
        date: "",
        requestType: "",
        recipient_user_id: null,
      },
      // Users
      users: [],
      result_id: null,
      title: "Заявка на покупку автомобиля",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    optionsUsers() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.users
          .filter((item) => {
            return item.id > 1;
          })
          .map((item) => {
            return { name: item.username, value: item.id };
          })
      );
      return menu;
    },
    isRecipientDisabled() {
      return this.params.requestType != "advance_report";
    },
  },

  methods: {
    // Modal
    reset() {
      if (this.purchasePrice) {
        this.params.price = this.purchasePrice;
      } else {
        this.params.price = "";
      }
      this.params.date = "";
      this.api_error = "";
      this.result_id = null;
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      // this.fetch();
      this.fetchUsers();
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
    // Networking
    async fetchUsers() {
      this.isLoading = true;
      try {
        let result = await apiService.getAuthUsers();
        this.users = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async save() {
      this.isLoading = true;
      try {
        let result = await apiService.buyCar(
          this.carId,
          this.params.price,
          this.params.date,
          this.params.requestType,
          this.params.recipient_user_id
        );
        this.result_id = result.id;
        // console.log(result);
        this.$UIService.showSuccess(null, `Оформлена заявка ${result.id} на покупку автомобиля ${this.carId}.`);

        // close modal
        this.$emit("hide");
        // saved
        // this.$emit("saved");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
