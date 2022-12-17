<template>
  <!-- New Expense Modal -->
  <!-- <div> -->
  <!-- :isApprovable="isFormValid" -->
  <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="formApproved">
    <div class="fields">
      <UITextfield v-model.trim.lazy="request.last_name">Фамилия</UITextfield>
      <UITextfield v-model.trim.lazy="request.first_name">Имя</UITextfield>
      <UITextfield v-model.trim.lazy="request.second_name">Отчество</UITextfield>
    </div>
    <div class="fields">
      <UITextfield v-model.trim.lazy="request.phone">Номер телефона</UITextfield>
      <UITextfield v-model.trim.lazy="request.email">EMail</UITextfield>
    </div>
    <div class="fields">
      <!-- Branch -->
      <UIInputDropdown v-model="request.branch_id" :options="optionsBranch" :class="validateBranch"
        >Филиал</UIInputDropdown
      >
    </div>
    <div class="two fields">
      <UITextfield v-model.trim.lazy="request.notes" :class="validateNotes">Комментарий</UITextfield>
    </div>

    <!-- error -->
    <div v-if="api_error" class="ui error message">
      <div class="header">Произошла ошибка</div>
      <p>{{ api_error }}</p>
    </div>
    <!-- submit button -->
    <button type="submit" hidden>Submit</button>

    <!-- New Category Browser -->
  </form>
  <!-- </div> -->
  <!-- /New Expense Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";
// import store from "@/store/store";

import UITextfield from "@/components/UITextfield.vue";
import UIInputDropdown from "@/components/UIInputDropdown.vue";

export default {
  name: "CMRegistrationRequestForm",
  components: {
    UITextfield,
    UIInputDropdown,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    requestId: {
      type: Number,
      default: null,
    },
    isApprovable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:approvable", "saved"],
  data() {
    return {
      // View
      isLoading: false,
      api_error: "",
      // Data
      request: {
        last_name: null,
        first_name: null,
        second_name: null,
        phone: null,
        email: null,
        notes: "",
        //
        branch_id: null,
      },
      //
      // Modals
      modals: {},
      // Branches
      branches: [],
    };
  },
  computed: {
    optionsBranch() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.branches.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },

    // Validation
    isFormValid() {
      return this.validateNotes.success && this.validateBranch.success;
    },
    validateBranch() {
      return {
        success: this.request.branch_id !== null && this.request.branch_id >= 0,
        error: this.request.branch_id === null,
      };
    },
    validateNotes() {
      return {
        success: this.request.notes && this.request.notes.length > 0,
        error: false,
      };
    },
  },

  watch: {
    isFormValid(newValue) {
      this.$emit("update:approvable", newValue);
    },
  },
  mounted() {
    this.didShow();
  },

  methods: {
    // Modal
    reset() {
      this.request.last_name = null;
      this.request.first_name = null;
      this.request.second_name = null;
      this.request.phone = null;
      this.request.email = null;
      this.request.notes = "";

      this.api_error = "";
    },
    didShow(modal_id) {
      console.log("didShow: " + modal_id + " - requestId: " + this.requestId);
      this.reset();
      //
      if (this.requestId > 0) {
        // Edit mode
        // Get branches & category
        this.fetchBranchesThenItem(this.requestId);
      } else {
        // Create mode
        this.fetchBranches();
      }
    },
    formApproved() {
      console.log("approved: ");
      // validate
      if (this.request.branch_id == null) {
        return;
      }

      if (this.requestId > 0) {
        // Update
        this.updateRequest();
      } else {
        // Create new
        this.createRequest();
      }
    },

    // Networking
    async fetchBranchesThenItem(request_id) {
      await this.fetchBranches();
      await this.fetchRequest(request_id);
    },

    async fetchRequest(request_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getRegistrationRequest(request_id);
        console.log(result);
        this.request = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async createRequest() {
      this.isLoading = true;
      // try {
      //   let result = await apiService.createBudgetRequest(this.expense);
      //   // console.log(result);
      //   this.$UIService.showSuccess(`Заявка создана ${result.id}!`);

      //   // saved
      //   this.$emit("saved", result.id);
      //   // close modal
      //   // this.$emit("hide");
      // } catch (error) {
      //   this.$UIService.showNetworkError(error);
      // }
      this.isLoading = false;
    },
    async updateRequest() {
      console.log("update");

      this.isLoading = true;
      try {
        await apiService.updateRegistrationRequest(this.request);
        // console.log(result);
        this.$UIService.showSuccess("Изменения в заявке сохранены!");

        // saved
        this.$emit("saved");
        // close modal
        // this.$emit("hide");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchBranches() {
      this.isLoading = true;
      try {
        this.branches = await apiService.getBranches();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
