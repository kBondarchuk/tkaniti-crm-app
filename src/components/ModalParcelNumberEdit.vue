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
          <UITextfield v-model.trim="params.parcel_number" :disabled="isLoading" label="Номер посылки" />
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
  name: "ModalParcelNumberEdit",

  components: {},

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
      params: {
        parcel_number: "",
      },
      title: "Номер посылки",
      isLoading: false,
      api_error: "",
    };
  },
  computed: {
    isValid() {
      return true; //this.params.parcel_number.length > 3;
    },
  },
  methods: {
    // Modal

    reset() {
      this.params.parcel_number = "";
      this.api_error = "";
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      this.getParcelNumber(this.orderId);
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.save(this.orderId, this.params.parcel_number);
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
    async getParcelNumber(order_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getOrderParcelNumber(order_id);
        console.log(result);
        this.params.parcel_number = result.parcel_number;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async save(order_id, parcelNumber) {
      this.isLoading = true;

      if (parcelNumber?.length == 0) {
        parcelNumber = null;
      }

      try {
        let result = await apiService.setOrderParcelNumber(order_id, parcelNumber);

        console.log(result);
        // this.$UIService.showSuccess(null, "Возврат проведён");

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
