<template>
  <Teleport to="body">
    <!-- New Modal -->
    <UIModal
      :modal_id="$options.name"
      :title="title"
      :active="active"
      :approve-by-enter="false"
      approve-button-text="Сохранить"
      scrolling-content
      @cancel="modalCancel"
      @delete="modalDelete"
      @approve="modalApproved"
      @did-show="didShow"
    >
      <form class="ui error warning form" :name="$options.name" :class="{ loading: isLoading }" @submit.prevent>
        <div class="two fields">
          <!-- Дата -->
          <UIInputDate
            v-model.trim.lazy="params.expense_dt"
            :disabled="isLoading"
            :class="validateDate"
            label="Дата учёта"
          />
          <!-- Тип -->
          <UIInputDropdown
            v-model.number="params.expense_type_id"
            :options="expenseTypes"
            :class="validateType"
            label="Тип учёта"
            @input="typeChanged"
          />
        </div>

        <!-- Select Car -->
        <!-- <UITransition mode="out-in" appear :duration="150"> -->
        <!-- <UIInputSelect
          v-if="params.expense_type_id == 1"
          placeholder="Автомобиль не выбран"
          :value="selectedCar"
          :class="validateCar"
          label="Автомобиль"
          @button-did-click="modals.browseCars = true"
        /> -->
        <CUISelectCar
          :hide="params.expense_type_id != 1"
          :car-id="params.car_id"
          :class="validateCar"
          :filter-status="[1, 2, 3, 4, 5, 6]"
          @selected="carSelected"
        />

        <!-- </UITransition> -->

        <div class="two fields">
          <!-- Branch -->
          <UIInputDropdown v-model="params.branch_id" :options="optionsBranch" :class="validateBranch" label="Филиал" />
          <!-- Investor -->
          <UIInputDropdown
            v-model="params.investor_id"
            :options="optionsInvestor"
            :class="validateInvestor"
            label="Инвестор"
          />
        </div>

        <!-- Статья -->
        <UIInputSelect
          label="Статья"
          placeholder="не выбран"
          :value="params.expense_category_path"
          :class="{ disabled: params.expense_type_id == null }"
          @button-did-click="browseCategories"
        />
        <!-- error -->
        <div v-if="oldItems" class="ui warning small message">
          <div class="header">Затраты по данной статье уже внесены в заявках</div>
          <p>
            <template v-for="item in oldItems" :key="item.id">
              {{ $filters.date(item.created_dt, 0) }} : {{ $filters.money(item.expense_amount) }} ₽ : {{ item.user }} :
              {{ item.request_notes }} ({{ item.request_id }})<br />
            </template>
          </p>
        </div>

        <!-- Комментарий -->
        <UITextfield
          v-model.trim.lazy="params.expense_notes"
          label="Описание расхода"
          :class="{ disabled: params.expense_type_id == null }"
        />
        <div class="two fields">
          <!-- Сумма -->
          <UIInputMoney
            v-model="params.expense_amount"
            :positive-only="false"
            :disabled="isLoading"
            style="flex: 1"
            :class="{ disabled: params.expense_type_id == null }"
            label="Сумма расхода"
          />

          <!-- Номер документа -->
          <UITextfield
            v-model.trim.lazy="params.document"
            label="Номер документа"
            :class="{ disabled: params.expense_type_id == null }"
          />
        </div>

        <br />

        <!-- error -->
        <div v-if="api_error" class="ui error message">
          <div class="header">Произошла ошибка</div>
          <p>{{ api_error }}</p>
        </div>
      </form>

      <!-- New Cars Browser -->
      <!-- <BrowseCars
        :active="modals.browseCars"
        :filter-status="[1, 2, 3, 4, 5, 6]"
        @hide="modals.browseCars = false"
        @selected="carSelected"
      /> -->
      <!-- Categories -->
      <BrowseExpenseCategories
        :active="modals.browseCategories"
        :filter-type="params.expense_type_id"
        @hide="modals.browseCategories = false"
        @selected="categorySelected"
      />
    </UIModal>
    <!-- /New Investor Modal -->
  </Teleport>
</template>

<script>
import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";
// import BrowseCars from "@/components/BrowseCars.vue";
import BrowseExpenseCategories from "@/components/BrowseExpenseCategories.vue";
import CUISelectCar from "@/components/CUISelectCar.vue";

const _budgetItemObject = {
  id: null,
  // name: "",
  // details: "",
  // bank_details: "",
  expense_dt: null,
  expense_type_id: 0,
  expense_amount: "",
  branch_id: null,
  investor_id: null,
  car_id: null,
  notes: "",
  document: "",
  expense_category_path: "",
  expense_notes: "",
};

export default {
  name: "ModalEditBugetItem",

  components: {
    UIModal,
    // UIInputDropdown,
    // UIInputSelect,
    // BrowseCars,
    BrowseExpenseCategories,
    CUISelectCar,
  },

  // model: {
  //   prop: "active",
  //   event: "hide",
  // },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    // branchId: {
    //   type: Number,
    //   default: null,
    // },
    selectedItem: {
      type: Object,
      default: null,
    },
  },

  emits: ["update:active", "update", "create"],

  data() {
    return {
      params: Object.assign({}, _budgetItemObject),
      // Branches
      branches: [],
      investors: [],
      expenseTypes: [
        { name: "Не выбран", value: null },
        { name: "На филиал", value: 0 },
        { name: "На автомобиль", value: 1 },
      ],
      car: null,
      // Modals
      modals: {
        browseCategories: false,
        // browseCars: false,
      },
      // View
      title: "Новая запись",
      isLoading: false,
      api_error: "",
      oldItems: null,
    };
  },

  computed: {
    // currentCompany() {
    //   return this.selectedItem || _budgetItemObject;
    // },
    // selectedCar() {
    //   if (!this.car) {
    //     return "";
    //   } else return this.car._car_name;
    // },
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
    // Validation
    isFormValid() {
      return (
        // Branch
        (this.validateType.success && this.params.expense_type_id == 0 && this.validateBranch.success) ||
        // Car
        (this.validateDate.success &&
          this.params.expense_type_id == 1 &&
          this.validateCar.success &&
          this.params.branch_id != null &&
          this.params.investor_id != null)
      );
    },
    validateBranch() {
      return {
        success: this.params.branch_id !== null && this.params.branch_id >= 0,
        error: this.params.expense_type_id !== null && this.params.branch_id === null,
        disabled: this.params.expense_type_id != 0,
      };
    },
    validateInvestor() {
      return {
        error: this.params.expense_type_id == 1 && this.params.investor_id === null,
        disabled: true,
      };
    },
    validateType() {
      return {
        success:
          this.params.expense_type_id !== null &&
          this.params.expense_type_id >= 0 &&
          this.params.expense_type_id <= 1 &&
          !(this.params.expense_type_id == 0 && this.params.request_type == "income"),
        error:
          this.params.expense_type_id === null ||
          (this.params.expense_type_id < 0 && this.params.expense_type_id > 1) ||
          (this.params.expense_type_id == 0 && this.params.request_type == "income"),
      };
    },
    validateCar() {
      return {
        success: this.params.car_id > 0,
        error: this.params.car_id === null,
      };
    },
    // validateCategory() {
    //   return {
    //     success: this.params.expense_category_id > 0,
    //     error: !this.params.expense_category_id || this.params.expense_category_id < 0,
    //     disabled: this.params.expense_type_id === null,
    //   };
    // },
    validateDate() {
      return {
        success:
          this.params.expense_dt !== null &&
          (this.params.expense_dt.length == 10 || this.params.expense_dt.length == 19),
        error:
          this.params.expense_dt === null ||
          this.params.expense_dt === "" ||
          (this.params.expense_dt && this.params.expense_dt.length != 10 && this.params.expense_dt.length != 19),
      };
    },
    // validateAmount() {
    //   return {
    //     success: this.params.expense_amount !== "" && this.params.expense_amount > 0,
    //     error: !this.params.expense_amount || (this.params.expense_amount && this.params.expense_amount <= 0),
    //   };
    // },
    validateNotes() {
      return {
        success: this.params.notes && this.params.notes.length > 0,
        error: false,
      };
    },
  },

  watch: {
    "params.branch_id": {
      handler(newValue) {
        console.log(">>>> new branch id: " + this.params.branch_id);
        if (newValue === null) {
          this.params.branch = null;
        } else {
          this.params.branch = this.branches.find((item) => item.id == this.params.branch_id).short_name;
        }
      },
    },
    "params.investor_id": {
      handler(newValue) {
        console.log(">>>> new investor id: " + this.params.investor_id);
        if (newValue === null) {
          this.params.investor = null;
        } else {
          this.params.investor = this.investors.find((item) => item.id == this.params.investor_id).fio_short;
        }
      },
    },
  },

  mounted() {
    this.fetchBranches();
    this.fetchInvestors();
  },

  methods: {
    // Modal
    reset() {
      // console.log(this.selectedItem);
      if (this.selectedItem) {
        this.params = Object.assign({}, this.selectedItem);
        this.title = "Изменение";
      } else {
        this.params = Object.assign({}, _budgetItemObject);
        this.title = "Создание";
      }
      this.api_error = "";
      this.oldItems = null;
    },
    didShow() {
      console.log("didShow: ");
      this.reset();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      if (this.selectedItem) {
        console.log("Update..");
        // this.update();
        this.$emit("update", this.params);
      } else {
        console.log("add..");
        // this.save();
        this.$emit("create", this.params);
      }
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("update:active");
    },
    modalDelete(modal_id) {
      console.log("delete: " + modal_id);
      // this.$emit("hide");
      var confirmed = confirm("Вы действительно хотите удалить реквизиты?");
      if (confirmed) {
        this.delete();
      }
    },
    typeChanged() {
      // newTypeId
      this.params.expense_category_id = null;
      this.params.expense_category_path = null;
      this.params.branch_id = null;
      this.params.car_id = null;
      this.params.investor_id = null;
      this.params.car = null;
      // this.car = undefined;
      this.oldItems = null;
    },

    carSelected(item) {
      console.log("++++", item);

      // this.car = item;
      this.fillCar(item);
      // this.modals.browseCars = false;

      // check old items
      this.checkOldItems();
    },
    fillCar(item) {
      this.params.car_id = item.id;
      this.params.branch_id = item.branch_id;
      this.params.investor_id = item.investor_id;
      this.params.car = item._car_name;
    },
    // Browsers
    browseCategories() {
      this.modals.browseCategories = true;
      // this.selectedItem = this.params;
    },
    categorySelected(item) {
      //this.category = item;
      //this.expense.expense_category_id = item.id;
      this.modals.browseCategories = false;
      console.log(item);
      this.params.expense_category_id = item.id;
      this.params.expense_category_path = item.path;

      // check old items
      this.checkOldItems();
    },
    async checkOldItems() {
      if (this.params.car_id && this.params.expense_category_id !== null) {
        let oldItems = await this.fetchOldItems();
        // console.warn(oldItems);

        // Filter self item
        oldItems = oldItems.filter((item) => item.id != this.params.id);

        if (oldItems?.length > 0) {
          this.oldItems = oldItems;
        } else {
          this.oldItems = null;
        }
      }
    },

    // Networking
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
    async fetchOldItems() {
      this.isLoading = true;

      // if (!this.filter.request_type) {
      //   this.filter.request_type = this.filterType;
      // }

      var filter = { car_id: this.params.car_id, expense_category_id: this.params.expense_category_id };
      // console.warn(filter);

      try {
        var { data, meta } = await apiService.getBudgetRequestsItems(null, filter);
        // this.pagination.total_count = meta.total_count;
        // this.pagination.total_pages = meta.total_pages;
        // this.oldItems = data;

        // if (meta.total_pages < this.pagination.page) {
        //   this.handlePagingFirst();
        // }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }

      return data;
    },
    async save() {
      // this.isLoading = true;
      // try {
      //   await apiService.createCompany(this.params);
      //   // console.log(result);
      //   this.$UIService.showSuccess(null, "Новые реквизиты добавлены");
      //   // saved
      //   this.$emit("didChange");
      //   // close modal
      //   this.$emit("hide");
      // } catch (error) {
      //   // console.log("!!!! " + error);
      //   this.$UIService.showNetworkError(error);
      // }
      // this.isLoading = false;
      this.$emit("create", this.params);
    },
    async update() {
      // this.isLoading = true;
      // try {
      //   await apiService.updateCompany(this.params);
      //   // console.log(result);
      //   this.$UIService.showSuccess(null, "Реквизиты изменены");
      //   // saved
      //   this.$emit("didChange");
      //   // close modal
      //   this.$emit("hide");
      // } catch (error) {
      //   // console.log("!!!! " + error);
      //   this.$UIService.showNetworkError(error);
      // }
      // this.isLoading = false;
    },
    async delete() {
      // this.isLoading = true;
      // try {
      //   // let result = await apiService.deleteDTP(this.params.id);
      //   // console.log(result);
      //   this.$UIService.showInfo(null, "Юр. лицо " + this.params.id + " удалён.");
      //   // saved
      //   this.$emit("didChange");
      //   // close modal
      //   this.$emit("hide");
      // } catch (error) {
      //   // console.log("!!!! " + error);
      //   this.$UIService.showNetworkError(error);
      // }
      // this.isLoading = false;
    },
  },
};
</script>
