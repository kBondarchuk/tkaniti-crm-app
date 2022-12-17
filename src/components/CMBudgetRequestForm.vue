<template>
  <!-- New Expense Modal -->
  <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="formApproved">
    <UITextfield v-model.trim.lazy="expense.notes" :disabled="isLoading" :class="validateNotes"
      >Описание заявки</UITextfield
    >
    <div class="fields">
      <!-- Дата -->
      <UIInputDate
        v-model.trim.lazy="expense.expense_dt"
        :disabled="isLoading"
        :class="validateDate"
        class="four wide field"
        >Дата учёта</UIInputDate
      >
      <!-- Тип -->
      <UIInputDropdown
        v-model.number="expense.expense_type_id"
        :options="expenseTypes"
        :class="validateType"
        class="four wide field"
        @input="typeChanged"
        >Тип учёта</UIInputDropdown
      >
      <!-- Select Car -->
      <UITransition mode="out-in" appear :duration="150">
        <UIInputSelect
          v-if="expense.expense_type_id == 1"
          placeholder="Автомобиль не выбран"
          :value="selectedCar"
          :class="validateCar"
          class="eight wide field"
          @button-did-click="browseCars"
          >Автомобиль
        </UIInputSelect>
      </UITransition>
    </div>

    <!-- Branch -->
    <div class="fields">
      <UIInputDropdown
        v-model="expense.expense_branch_id"
        :options="optionsBranch"
        :class="validateBranch"
        class="eight wide field"
        >Филиал</UIInputDropdown
      >
      <!-- v-if="expense.expense_type_id === 0" -->
      <!-- </div> -->

      <!-- Investor -->
      <!-- <div class="fields"> -->
      <UIInputDropdown
        v-model="expense.investor_id"
        :options="optionsInvestor"
        :class="validateInvestor"
        class="eight wide field"
        >Инвестор</UIInputDropdown
      >
    </div>

    <!-- Header -->
    <div class="ui horizontal divider" style="margin-top: 2rem">
      <span v-if="request_type == 'expense'">РАСХОДЫ</span>
      <span v-if="request_type == 'income'">ПРОДАЖИ</span>
    </div>

    <!-- List -->

    <div v-for="(item, index) in filteredItems" :key="item.id" class="fields">
      <!--  -->
      <!--  -->
      <UITransition mode="out-in" appear :duration="150">
        <UIInputSelect
          placeholder="не выбран"
          :value="item.expense_category_path"
          :class="{ disabled: expense.expense_type_id == null }"
          class="nine wide field"
          @button-did-click="browseCategories(item)"
          ><span v-if="index == 0">Статья</span></UIInputSelect
        >
        <!--  -->
        <!-- <UIInputDropdown
          v-model.number="item.expense_category_id"
          :options="optionsCategory"
          class="six wide field"
          :class="{ disabled: expense.expense_type_id == null }"
          ><span v-if="index == 0">Статья расхода</span></UIInputDropdown
        > -->
      </UITransition>
      <!--  -->
      <UITransition mode="out-in" appear :duration="150">
        <UITextfield
          v-model.trim.lazy="item.expense_notes"
          :class="{ disabled: expense.expense_type_id == null }"
          class="four wide field"
          ><span v-if="index == 0">Описание</span></UITextfield
        >
      </UITransition>

      <UITransition mode="out-in" appear :duration="150">
        <UITextfield
          v-model.trim.lazy="item.document"
          :class="{ disabled: expense.expense_type_id == null }"
          class="four wide field"
          ><span v-if="index == 0">Документ</span></UITextfield
        >
      </UITransition>

      <UITransition mode="out-in" appear :duration="150">
        <div class="three wide field" style="display: flex">
          <UIInputMoney
            v-model="item.expense_amount"
            :positive-only="false"
            :disabled="isLoading"
            style="flex: 1"
            :class="{ disabled: expense.expense_type_id == null }"
            ><span v-if="index == 0">Сумма</span></UIInputMoney
          >
          <div class="field">
            <label v-if="index == 0" style="visibility: hidden">w</label>
            <UIButton
              icon=" red trash alternate"
              type="basic"
              style="margin-left: 1em; margin-right: 0"
              :class="{ disabled: expense.expense_type_id == null }"
              @click.prevent="removeItem(index)"
            ></UIButton>
          </div>
        </div>
      </UITransition>
    </div>

    <!-- New -->
    <div class="field" style="margin-bottom: 0">
      <UIButton
        icon="green plus"
        type="basic"
        :class="{ disabled: expense.expense_type_id == null }"
        @click.prevent="addNewItem"
        >Добавить {{ mapType(request_type) }}</UIButton
      >
    </div>
    <!-- <h4 style="text-align: center; margin-top: 0em; color: rgba(0, 0, 0, 0.5)" v-if="items && items.length == 0">
        Нет расходов
      </h4> -->
    <!-- <div class="ui divider"></div> -->
    <!-- error -->
    <div v-if="api_error" class="ui error message">
      <div class="header">Произошла ошибка</div>
      <p>{{ api_error }}</p>
    </div>
    <!-- submit button -->
    <button type="submit" hidden>Submit</button>
    <!-- New Cars Browser -->
    <BrowseCars
      :active="modals.browseCars"
      :filter-status="[1, 2, 3, 4, 5, 6]"
      @hide="modals.browseCars = false"
      @selected="carSelected"
    />
    <!-- Categories -->
    <BrowseExpenseCategories
      title="Выбор категории затрат"
      :active="modals.browseCategories"
      :filter-type="expense.expense_type_id"
      @hide="modals.browseCategories = false"
      @selected="categorySelected"
    />
    <!-- New Category Browser -->
  </form>
  <!-- </div> -->
  <!-- /New Expense Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";
// import store from "@/store/store";

import UITextfield from "@/components/UITextfield.vue";
import UIInputMoney from "@/components/UIInputMoney.vue";
import UIInputDate from "@/components/UIInputDate.vue";
import UIInputSelect from "@/components/UIInputSelect.vue";
import UIInputDropdown from "@/components/UIInputDropdown.vue";
import UIButton from "@/components/UIButton.vue";
import BrowseExpenseCategories from "@/components/BrowseExpenseCategories.vue";
import BrowseCars from "@/components/BrowseCars.vue";
import UITransition from "@/components/UITransition.vue";

export default {
  name: "CMBudgetRequestForm",
  components: {
    UITextfield,
    UIInputMoney,
    UIInputDate,
    UIInputSelect,
    UIInputDropdown,
    UIButton,
    BrowseExpenseCategories,
    BrowseCars,
    UITransition,
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
    request_type: {
      type: String,
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
        request_type: this.request_type,
        expense_type_id: null,
        expense_dt: "",
        expense_car_id: null,
        expense_branch_id: null,
        investor_id: null,
        notes: "",
        items: [],
      },
      categories: [],
      //
      car: undefined,
      // Modals
      modals: {
        browseCategories: false,
        browseCars: false,
      },
      // Branches
      branches: [],
      investors: [],
      expenseTypes: [
        { name: "Не выбран", value: null },
        { name: "На филиал", value: 0 },
        { name: "На автомобиль", value: 1 },
      ],
    };
  },

  computed: {
    filteredItems() {
      return this.expense.items.filter((i) => {
        return !i.deleted || (i.deleted && i.deleted != 1);
      });
    },
    optionsBranch() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.branches.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    optionsInvestor() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.investors.map((item) => {
          return { name: item.fio_short, value: item.id };
        })
      );
      return menu;
    },
    optionsCategory() {
      let menu = [{ name: "Выбрать", value: null }];

      menu = menu.concat(
        this.categories
          .filter((item) => item.expense_type_id == this.expense.expense_type_id)
          .filter((item) => item.id > 0)
          // .map(function (item) {
          //   if (item.parent_id) {
          //     item.name = " –– " + item.name;
          //   }
          //   return item;
          // })
          .map(function (item) {
            return { name: item.path, value: item.id };
          })
      );

      return menu;
    },
    selectedCar() {
      if (!this.car) {
        return "";
      } else return this.car._car_name;
    },
    // selectedCategory() {
    //   if (!this.category) {
    //     return "";
    //   } else return this.category.name;
    // },

    // Validation
    isFormValid() {
      return (
        // Branch
        (this.validateType.success && this.expense.expense_type_id == 0 && this.validateBranch.success) ||
        // Car
        (this.validateDate.success &&
          this.expense.expense_type_id == 1 &&
          this.validateCar.success &&
          this.expense.expense_branch_id != null &&
          this.expense.investor_id != null)
      );
    },
    validateBranch() {
      return {
        success: this.expense.expense_branch_id !== null && this.expense.expense_branch_id >= 0,
        error: this.expense.expense_type_id !== null && this.expense.expense_branch_id === null,
        disabled: this.expense.expense_type_id != 0,
      };
    },
    validateInvestor() {
      return {
        error: this.expense.expense_type_id == 1 && this.expense.investor_id === null,
        disabled: true,
      };
    },
    validateType() {
      return {
        success:
          this.expense.expense_type_id !== null &&
          this.expense.expense_type_id >= 0 &&
          this.expense.expense_type_id <= 1 &&
          !(this.expense.expense_type_id == 0 && this.expense.request_type == "income"),
        error:
          this.expense.expense_type_id === null ||
          (this.expense.expense_type_id < 0 && this.expense.expense_type_id > 1) ||
          (this.expense.expense_type_id == 0 && this.expense.request_type == "income"),
      };
    },
    validateCar() {
      return {
        success: this.expense.expense_car_id > 0,
        error: this.expense.expense_car_id === null,
      };
    },
    // validateCategory() {
    //   return {
    //     success: this.expense.expense_category_id > 0,
    //     error: !this.expense.expense_category_id || this.expense.expense_category_id < 0,
    //     disabled: this.expense.expense_type_id === null,
    //   };
    // },
    validateDate() {
      return {
        success:
          this.expense.expense_dt !== null &&
          (this.expense.expense_dt.length == 10 || this.expense.expense_dt.length == 19),
        error:
          this.expense.expense_dt === null ||
          this.expense.expense_dt === "" ||
          (this.expense.expense_dt && this.expense.expense_dt.length != 10 && this.expense.expense_dt.length != 19),
      };
    },
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
    this.fetchExpensesCategories();
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
    addNewItem() {
      const newItem = {
        expense_category_id: null,
        expense_amount: null,
      };
      this.expense.items.push(newItem);
    },
    removeItem(index) {
      console.log(index);
      console.log(this.expense.items[index]);

      if (this.expense.items[index].id && this.expense.items[index].id !== null) {
        console.log("-a");
        this.expense.items[index].deleted = 1;
      } else {
        console.log("-b");
        this.expense.items.splice(index, 1);
      }
    },
    removeAllItem() {
      // this.expense.items.splice(index, 1);
      this.expense.items = this.expense.items.filter((i) => i.id);
      this.expense.items.forEach((item) => (item.deleted = 1));
    },
    // Modal
    reset() {
      this.expense.expense_branch_id = null;
      this.expense.expense_car_id = null;
      this.expense.expense_dt = "";
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
      console.log("didShow: - requestId: " + this.requestId, " car_id: " + this.carId);
      this.reset();
      this.addNewItem();
      //
      if (this.requestId > 0) {
        // Edit mode
        // Get branches & car & category
        this.fetchBranchesThenItem(this.requestId);
      } else {
        // Create mode
        this.fetchBranches();
        this.fetchInvestors();

        // Car Mode
        if (this.carId > 0) {
          this.expense.expense_type_id = 1; // Car
          this.expense.expense_car_id = this.carId;
          // Get branches & car
          this.fetchBranchesThenCar(this.carId);
        }
      }
    },
    typeChanged() {
      // newTypeId
      this.expense.expense_branch_id = null;
      this.expense.expense_car_id = null;
      this.expense.investor_id = null;
      this.car = undefined;
      // delete all items
      this.removeAllItem();
      this.addNewItem();
      // this.category = undefined;
    },
    formApproved() {
      console.log("approved: ");
      // validate
      if (this.expense.expense_branch_id == null && this.expense.expense_car_id == null) {
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

    // Browsers
    browseCategories(item) {
      this.modals.browseCategories = true;
      this.selectedItem = item;
    },
    categorySelected(item) {
      //this.category = item;
      //this.expense.expense_category_id = item.id;
      this.modals.browseCategories = false;
      console.log(item);
      this.selectedItem.expense_category_id = item.id;
      this.selectedItem.expense_category_path = item.path;
    },
    browseCars() {
      this.modals.browseCars = true;
    },
    carSelected(item) {
      this.car = item;
      this.fillCar(item);
      this.modals.browseCars = false;
    },
    fillCar(item) {
      this.expense.expense_car_id = item.id;
      this.expense.expense_branch_id = item.branch_id;
      this.expense.investor_id = item.investor_id;
    },

    // Networking
    async fetchBranchesThenItem(request_id) {
      await this.fetchBranches();
      await this.fetchInvestors();
      await this.fetchRequest(request_id);
      // Get car
      if (this.expense.expense_car_id) await this.fetchCar(this.expense.expense_car_id);
      // Get category
      // if (this.expense.expense_category_id) {
      //   this.category = { name: this.expense.expense_category };
      // }
    },
    async fetchBranchesThenCar(car_id) {
      // Get branches
      await this.fetchBranches();
      // Get investors
      await this.fetchInvestors();
      // Get car
      await this.fetchCar(car_id);
      // fill cars branch and investor
      this.fillCar(this.car);
    },
    async fetchRequest(request_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getBudgetRequest(request_id);
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
        let result = await apiService.createBudgetRequest(this.expense);
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
        await apiService.updateBudgetRequest(this.expense);
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
    async fetchInvestors() {
      this.isLoading = true;
      try {
        this.investors = await apiService.getInvestors();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCar(carId) {
      this.isLoading = true;
      try {
        this.car = await apiService.getCar(carId);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },

    // async fetchExpensesCategories(filterType) {
    //   this.isLoading = true;
    //   try {
    //     let result = await apiService.getExpensesCategories(filterType);
    //     this.categories = result;
    //   } catch (error) {
    //     this.$UIService.showNetworkError(error);
    //   }
    //   this.isLoading = false;
    // },

    fetchExpensesCategories(filterType) {
      this.loadCategories(filterType, this.isLoading, (result) => {
        this.categories = result;
      });
    },

    async loadCategories(filterType, loadIndicator, successCallback) {
      loadIndicator = true;
      try {
        let result = await apiService.getExpensesCategories(filterType);
        successCallback(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      loadIndicator = false;
    },
  },
};
</script>
