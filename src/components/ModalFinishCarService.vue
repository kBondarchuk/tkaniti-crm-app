<template>
  <!-- Modal -->
  <Teleport to="body">
    <UIModal
      :modal_id="$options.name"
      :title="title"
      :active="active"
      :is-approvable="isValid"
      approve-button-text="В гараж"
      @cancel="modalCancel"
      @approve="modalApproved"
      @did-show="didShow"
    >
      <form class="ui form" :name="$options.name" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
        <!--  -->
        <div class="field">
          <UICheckbox id="check1" v-model="params.check1" label="Кузовные работы" />
        </div>
        <!--  -->
        <div class="field">
          <UICheckbox id="check2" v-model="params.check2" label="Техническая часть исправна, не требует ремонта" />
        </div>
        <!--  -->
        <div class="field">
          <UICheckbox id="check3" v-model="params.check3" label="Химчистка, мойка произведена" />
        </div>
        <!--  -->
        <div class="field">
          <UICheckbox id="check4" v-model="params.check4" label="Шины в рабочем состоянии" />
        </div>
        <!--  -->
        <div class="field">
          <UICheckbox id="check5" v-model="params.check5" label="Присутствуют все документы" />
        </div>
        <!--  -->

        <!--  -->
        <!-- <UITextfield v-model.lazy="params.notes" :disabled="isLoading" name="second_name" label="Комментарий" /> -->
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
</template>

<script>
import apiService from "@/services/api.service.js";
import UIModal from "@/components/UIModal.vue";
import UICheckbox from "@/components/UICheckbox.vue";

let _object = {
  check1: false,
  check2: false,
  check3: false,
  check4: false,
  check5: false,
  notes: "",
};

export default {
  name: "ModalFinishCarService",

  components: {
    UIModal,
    UICheckbox,
  },

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

  emits: ["update:active", "approved"],

  data() {
    return {
      params: Object.assign({}, _object),
      // UI
      title: "Завершить обслуживание",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    isValid() {
      return this.params.check1 && this.params.check2 && this.params.check3 && this.params.check4 && this.params.check5;
    },
  },

  methods: {
    reset() {
      this.params = Object.assign({}, _object);
      this.api_error = "";
    },
    didShow() {
      this.reset();
      // this.fetch();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.closeModal();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.reset();
      this.$emit("update:active");
    },
    closeModal() {
      // new created
      this.$emit("approved");
      // close modal
      this.$emit("update:active");
    },

    // Network
    // async create() {
    //   this.isLoading = true;

    //   try {
    //     // await apiService.createInvestorBillingPlan(this.investorId, this.params);

    //     // console.log(result);
    //     this.$UIService.showSuccess(null, "Создан план биллинга");

    //     // close modal
    //     this.closeModal();
    //   } catch (error) {
    //     // console.log("!!!! " + error);
    //     this.$UIService.showNetworkError(error);
    //   }
    //   this.isLoading = false;
    // },
  },
};
</script>
