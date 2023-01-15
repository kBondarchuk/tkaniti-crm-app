<template>
  <!-- New Expense Modal -->
  <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="formApproved">
    <!-- Назначение -->
    <UITextfield v-model.trim.lazy="report.title" :disabled="isLoading" :class="validateNotes" label="Описание" />
    <!--  -->
    <div class="two fields">
      <!-- Сумма -->
      <UIInputMoney v-model.trim.lazy="report.amount" :disabled="isLoading" label="Сумма" />
      <!-- Кому -->
      <!-- <UIInputNumber v-model.trim.lazy="report.recipient_user_id" :disabled="isLoading" label="Подотчетное лицо" /> -->
      <!-- Отчет за заявку -->
      <!-- <UIInputNumber v-model.trim.lazy="report.reported_id" :disabled="isLoading" label="Заявка на выдачу" /> -->
      <!-- User -->
      <UIInputDropdown v-model="report.recipient_user_id" :options="optionsUsers" label="Подотчетное лицо" />
      <!--  -->
    </div>
    <!-- Заметки -->
    <UITextAria v-model.trim.lazy="report.notes" rows="5" label="Описание" />

    <!-- error -->
    <div v-if="api_error" class="ui error message">
      <div class="header">Произошла ошибка</div>
      <p>{{ api_error }}</p>
    </div>
    <!-- submit button -->
    <button type="submit" hidden>Submit</button>
  </form>
  <!-- </div> -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMAdvanceReportForm",

  components: {},

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    reportId: {
      type: Number,
      default: null,
    },
    // reported_request: {
    //   type: Object,
    //   default: null,
    // },
    isApprovable: {
      type: Boolean,
      default: false,
    },
    type_id: {
      type: Number,
      default: null,
    },
  },

  emits: ["update:approvable", "saved"],

  data() {
    return {
      // View
      isLoading: false,
      api_error: "",
      // Data
      report: {
        type_id: this.type_id,
        reported_id: null,
        amount: null,
        recipient_user_id: null,
        title: "",
        notes: "",
      },
      // Users
      users: [],
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
    // Validation
    isFormValid() {
      return this.report.recipient_user_id != null && this.report.amount > 0;
    },
    // validateAmount() {
    //   return {
    //     success: this.expense.expense_amount !== "" && this.expense.expense_amount > 0,
    //     error: !this.expense.expense_amount || (this.expense.expense_amount && this.expense.expense_amount <= 0),
    //   };
    // },
    validateNotes() {
      return {
        success: this.report.notes && this.report.notes.length > 0,
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
    mapType(name) {
      if (name == "income") {
        return "продажу";
      } else if (name == "expense") {
        return "расход";
      } else {
        return name;
      }
    },

    // Modal
    reset() {
      // console.log("+++", this.reported_request);

      this.report.type_id = this.type_id;
      this.report.reported_id = null;
      this.report.amount = null;
      this.report.recipient_user_id = null;
      this.report.notes = "";

      // if (this.requestId > 0) {
      //   // Edit mode
      //   this.title = this.titles.edit;
      //   this.approveButtonString = this.approveButtonStrings.edit;
      // } else {
      //   // Create mode
      //   this.title = this.titles.create;
      //   this.approveButtonString = this.approveButtonStrings.create;
      // }
      this.api_error = "";
    },
    didShow() {
      console.log("didShow: - reportId: " + this.reportId);
      this.reset();
      // this.addNewItem();
      //
      if (this.reportId > 0) {
        // Edit mode
        // Get branches & car & category
        this.fetchBranchesThenItem(this.reportId);
      } else {
        // Create mode
        this.fetchUsers();
        // this.fetchInvestors();
        // Car Mode
        // if (this.carId > 0) {
        //   this.expense.expense_type_id = 1; // Car
        //   this.expense.expense_car_id = this.carId;
        //   // Get branches & car
        //   this.fetchBranchesThenCar(this.carId);
        // }
      }
    },

    formApproved() {
      console.log("approved: ");
      // validate
      // if (this.expense.expense_branch_id == null && this.expense.expense_car_id == null) {
      //   return;
      // }

      if (this.reportId > 0) {
        // Update
        this.updateRequest();
      } else {
        // Create new
        this.createRequest();
      }
    },

    // Networking
    async fetchBranchesThenItem(report_id) {
      await this.fetchUsers();
      await this.fetchRequest(report_id);
      // Get car
      // if (this.expense.expense_car_id) await this.fetchCar(this.expense.expense_car_id);
      // Get category
      // if (this.expense.expense_category_id) {
      //   this.category = { name: this.expense.expense_category };
      // }
    },
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
    async fetchRequest(request_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getAdvanceRequest(request_id);
        this.report = result;
        // this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async createRequest() {
      this.isLoading = true;
      try {
        console.log(">>>", this.report);

        let result = await apiService.createAdvanceRequest(this.report);
        // console.log(result);
        this.$UIService.showSuccess(`Заявка создана ${result.id}!`);

        // saved
        this.$emit("saved", result.id);
        // close modal
        // this.$emit("hide");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async updateRequest() {
      this.isLoading = true;
      try {
        await apiService.updateAdvanceRequest(this.report);
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
  },
};
</script>
