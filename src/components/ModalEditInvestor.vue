<template>
  <!-- New Investor Modal -->
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
      <div class="three fields">
        <UITextfield v-model.trim.lazy="investor.last_name" :disabled="isLoading" name="last_name" label="Фамилия" />
        <UITextfield v-model.trim.lazy="investor.first_name" :disabled="isLoading" name="first_name" label="Имя" />
        <UITextfield
          v-model.trim.lazy="investor.second_name"
          :disabled="isLoading"
          name="second_name"
          label="Отчество"
        />
      </div>
      <!--  -->
      <UITextfield v-model.trim.lazy="investor.notes" :disabled="isLoading" name="notes" label="Заметки" />
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
import UIModal from "@/components/UIModal.vue";

const _investorObject = {
  id: null,
  first_name: "",
  second_name: "",
  last_name: "",
  notes: "",
};

export default {
  name: "ModalEditInvestor",

  components: {
    UIModal,
  },

  model: {
    prop: "active",
    event: "hide",
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    investor_id: {
      type: Number,
      default: null,
    },
  },
  emits: ["hide", "created", "cancelled"],

  data() {
    return {
      investor: Object.assign({}, _investorObject),
      title: "",
      isLoading: false,
      api_error: "",
    };
  },

  methods: {
    // Modal
    setTitle(text) {
      this.title = "Инвестор " + text;
    },
    reset() {
      this.investor = Object.assign({}, _investorObject);
      this.setTitle("(новый)");
      this.api_error = "";
    },
    modalApproved() {
      // Check New or Edit?
      if (this.investor_id == null) {
        // Create
        this.postCreateInvestor();
      } else {
        // Update
        // this.postCreateInvestor();
      }
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("cancelled");
      this.$emit("hide");
    },
    didShow() {
      this.reset();
      // this.fetch();
      if (this.investor_id) {
        this.fetchInvestor();
      }
    },

    doneModal() {
      // show success
      this.$UIService.showSuccess("Новый инвестор создан!");
      // new created
      this.$emit("created");
      // close modal
      this.$emit("hide");
    },

    // Networking
    async fetchInvestor() {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestor(this.investor_id);
        this.investor = result;
        console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async postCreateInvestor() {
      this.isLoading = true;
      try {
        let result = await apiService.createInvestor(this.investor);
        console.log(result);
        this.doneModal();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async postUpdateInvestor() {
      this.isLoading = true;
      try {
        await apiService.updateInvestor(this.investor);
        // console.log(result);
        this.doneModal();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
