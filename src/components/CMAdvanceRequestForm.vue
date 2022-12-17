<template>
  <!-- New Expense Modal -->
  <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="formApproved">
    <!-- Назначение -->
    <UITextfield v-model.trim.lazy="expense.title" :disabled="isLoading" :class="validateNotes" label="Назначение" />
    <!--  -->
    <div class="two fields">
      <!-- Сумма -->
      <UIInputMoney v-model.trim.lazy="expense.amount" :disabled="isLoading" label="Сумма" />
      <!-- Кому -->
      <!-- <UIInputNumber v-model.trim.lazy="expense.recipient_user_id" :disabled="isLoading" label="Получатель" /> -->
      <!-- User -->
      <UIInputDropdown v-model="expense.recipient_user_id" :options="optionsUsers" label="Подотчетное лицо" />
      <!--  -->
    </div>
    <!-- Заментки -->
    <UITextAria v-model.trim.lazy="expense.notes" rows="5" label="Описание" />

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
import UIInputDropdown from "@/components/UIInputDropdown.vue";
import UITextAria from "@/components/UITextAria.vue";
// import { Portal } from "@linusborg/vue-simple-portal";

export default {
  name: "CMAdvanceRequestForm",

  components: {
    UIInputDropdown,
    UITextAria,
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
    carId: {
      type: Number,
      default: null,
    },
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
      expense: {
        // request_type: this.request_type,
        // expense_type_id: null,
        // expense_dt: "",
        // items: [],
        title: "",
        notes: "",
        type_id: this.type_id,
        amount: null,
        recipient_user_id: null,
      },
      categories: [],
      //
      car: undefined,
      // Modals
      modals: {
        browseCategories: false,
        browseCars: false,
      },
      // Users
      users: [],
      // investors: [],
      expenseTypes: [
        { name: "Не выбран", value: null },
        { name: "На филиал", value: 0 },
        { name: "На автомобиль", value: 1 },
      ],
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
    // filteredItems() {
    //   return this.expense.items.filter((i) => {
    //     return !i.deleted || (i.deleted && i.deleted != 1);
    //   });
    // },
    // optionsBranch() {
    //   let menu = [{ name: "Не выбран", value: null }].concat(
    //     this.branches.map((item) => {
    //       return { name: item.name, value: item.id };
    //     })
    //   );
    //   return menu;
    // },
    // optionsInvestor() {
    //   let menu = [{ name: "Не выбран", value: null }].concat(
    //     this.investors.map((item) => {
    //       return { name: item.fio_short, value: item.id };
    //     })
    //   );
    //   return menu;
    // },
    // optionsCategory() {
    //   let menu = [{ name: "Выбрать", value: null }];

    //   menu = menu.concat(
    //     this.categories
    //       .filter((item) => item.expense_type_id == this.expense.expense_type_id)
    //       .filter((item) => item.id > 0)
    //       // .map(function (item) {
    //       //   if (item.parent_id) {
    //       //     item.name = " –– " + item.name;
    //       //   }
    //       //   return item;
    //       // })
    //       .map(function (item) {
    //         return { name: item.path, value: item.id };
    //       })
    //   );

    //   return menu;
    // },
    // selectedCar() {
    //   if (!this.car) {
    //     return "";
    //   } else return this.car._car_name;
    // },
    // selectedCategory() {
    //   if (!this.category) {
    //     return "";
    //   } else return this.category.name;
    // },

    // Validation
    isFormValid() {
      return this.expense.recipient_user_id != null && this.expense.amount > 0;
    },
    // validateBranch() {
    //   return {
    //     success: this.expense.expense_branch_id !== null && this.expense.expense_branch_id >= 0,
    //     error: this.expense.expense_type_id !== null && this.expense.expense_branch_id === null,
    //     disabled: this.expense.expense_type_id != 0,
    //   };
    // },
    // validateInvestor() {
    //   return {
    //     error: this.expense.expense_type_id == 1 && this.expense.investor_id === null,
    //     disabled: true,
    //   };
    // },
    // validateType() {
    //   return {
    //     success:
    //       this.expense.expense_type_id !== null &&
    //       this.expense.expense_type_id >= 0 &&
    //       this.expense.expense_type_id <= 1 &&
    //       !(this.expense.expense_type_id == 0 && this.expense.request_type == "income"),
    //     error:
    //       this.expense.expense_type_id === null ||
    //       (this.expense.expense_type_id < 0 && this.expense.expense_type_id > 1) ||
    //       (this.expense.expense_type_id == 0 && this.expense.request_type == "income"),
    //   };
    // },
    // validateCar() {
    //   return {
    //     success: this.expense.expense_car_id > 0,
    //     error: this.expense.expense_car_id === null,
    //   };
    // },
    // validateCategory() {
    //   return {
    //     success: this.expense.expense_category_id > 0,
    //     error: !this.expense.expense_category_id || this.expense.expense_category_id < 0,
    //     disabled: this.expense.expense_type_id === null,
    //   };
    // },
    // validateDate() {
    //   return {
    //     success:
    //       this.expense.expense_dt !== null &&
    //       (this.expense.expense_dt.length == 10 || this.expense.expense_dt.length == 19),
    //     error:
    //       this.expense.expense_dt === null ||
    //       this.expense.expense_dt === "" ||
    //       (this.expense.expense_dt && this.expense.expense_dt.length != 10 && this.expense.expense_dt.length != 19),
    //   };
    // },
    // validateAmount() {
    //   return {
    //     success: this.expense.expense_amount !== "" && this.expense.expense_amount > 0,
    //     error: !this.expense.expense_amount || (this.expense.expense_amount && this.expense.expense_amount <= 0),
    //   };
    // },
    validateNotes() {
      return {
        success: this.expense.notes && this.expense.notes.length > 0,
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
      // this.expense.expense_branch_id = null;
      // this.expense.expense_car_id = null;
      // this.expense.expense_dt = "";
      // this.expense.expense_amount = "";
      this.expense.notes = "";

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
      console.log("didShow: - requestId: " + this.requestId);
      this.reset();
      // this.addNewItem();
      //

      if (this.requestId > 0) {
        // Edit mode
        // Get branches & car & category
        this.fetchBranchesThenItem(this.requestId);
      } else {
        // Create mode
        this.fetchUsers();
        // this.fetchBranches();
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

      if (this.requestId > 0) {
        // Update
        this.updateRequest();
      } else {
        // Create new
        this.createRequest();
      }
    },

    // Browsers
    // browseCategories(item) {
    //   this.modals.browseCategories = true;
    //   this.selectedItem = item;
    // },
    // categorySelected(item) {
    //   //this.category = item;
    //   //this.expense.expense_category_id = item.id;
    //   this.modals.browseCategories = false;
    //   console.log(item);
    //   this.selectedItem.expense_category_id = item.id;
    //   this.selectedItem.expense_category_path = item.path;
    // },
    // browseCars() {
    //   this.modals.browseCars = true;
    // },
    // carSelected(item) {
    //   this.car = item;
    //   this.fillCar(item);
    //   this.modals.browseCars = false;
    // },
    // fillCar(item) {
    //   this.expense.expense_car_id = item.id;
    //   this.expense.expense_branch_id = item.branch_id;
    //   this.expense.investor_id = item.investor_id;
    // },

    // Networking
    async fetchBranchesThenItem(request_id) {
      await this.fetchUsers();
      await this.fetchRequest(request_id);
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
        this.expense = result;
        // this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async createRequest() {
      this.isLoading = true;
      try {
        console.log(">>>", this.expense);

        let result = await apiService.createAdvanceRequest(this.expense);
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
        await apiService.updateAdvanceRequest(this.expense);
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
