<template>
  <!-- New Modal -->
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
          <UIInputDropdownString
            v-model="params.payment_method"
            :options="optionsPaymentMethod"
            label="Способ оплаты"
          />

          <UIInputMoney v-model.trim.lazy="params.amount" :disabled="true" label="Сумма" />
        </div>
        <!--  -->
        <!-- <UITextfield v-model.trim.lazy="deposit.notes" :disabled="isLoading" label="Комментарий" /> -->
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

export default {
  name: "ModalOrderMakeInvoice",

  components: {},

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      default: null,
    },
  },

  emits: ["update:active", "created", "hide"],

  data() {
    return {
      params: {
        amount: "",
        payment_method: "acq",
        subject_type: "order",
        subject_id: null,
        send_cart: true,
      },
      // UI
      title: "Создание счёта для онлайн-оплаты",
      isLoading: false,
      api_error: "",
      //
      optionsPaymentMethod: [
        { name: "Не выбрано", value: "null" },
        { name: "Эквайринг", value: "acq" },
      ],
    };
  },
  computed: {
    isValid() {
      return this.params.amount > 0;
    },
  },
  methods: {
    // Modal

    reset() {
      this.params.amount = this.order.total_price;
      this.params.subject_id = this.order.id;
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

    // Networking
    async save() {
      this.isLoading = true;
      try {
        let result = await apiService.makeInvoice(this.params);

        console.log(result);
        this.$UIService.showSuccess(null, "Создан счет для заказа " + this.order?.id);

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
