<template>
  <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent>
    <!--  -->
    <UITextfield
      v-model.trim.lazy="request.notes"
      :disabled="isLoading"
      :class="validateNotes"
      label="Описание заявки"
    />
    <!-- User -->
    <div class="four fields">
      <UIInputDropdown
        v-model="request.recipient_user_id"
        :options="optionsUsers"
        label="Подотчетное лицо"
        :disabled="isRecipientDisabled"
      />
    </div>
    <!-- List -->

    <!-- Header -->
    <div class="ui horizontal divider" style="margin-top: 2rem">
      <span v-if="request_type == 'expense'">РАСХОДЫ</span>
      <span v-if="request_type == 'advance_report'">РАСХОДЫ</span>
      <span v-if="request_type == 'income'">ПРОДАЖИ</span>
    </div>

    <UIButton icon="green plus" type="basic" text="Добавить расход" @click.prevent="actionNewItem" />

    <!-- Items -->
    <CMBudgetItemList
      :items="request.items"
      :total-sum="request.total_sum"
      :is-loading="isLoading"
      mode="edit"
      @remove="removeItem"
      @edit-item="actioneEditItem"
    />
    <!-- /Items -->
    <!-- error -->
    <div v-if="api_error" class="ui error message">
      <div class="header">Произошла ошибка</div>
      <p>{{ api_error }}</p>
    </div>

    <!-- submit button -->
    <!-- <button type="submit" hidden>Submit</button> -->
    <!--  -->

    <ModalEditBugetItem
      v-model:active="modals.editBudgetItem"
      :selected-item="selectedItem"
      @create="addNewBudgetItem"
      @update="updateBudgetItem"
    />

    <!------->
  </form>
</template>

<script>
import apiService from "@/services/api.service.js";
import { v4 as uuid } from "uuid";

import CMBudgetItemList from "@/components/CMBudgetItemList.vue";
import ModalEditBugetItem from "@/components/ModalEditBugetItem.vue";

export default {
  name: "CMBudgetRequestForm2",
  components: {
    CMBudgetItemList,
    ModalEditBugetItem,
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
      // expense: {
      //   request_type: this.request_type,
      //   expense_type_id: null,
      //   expense_dt: "",
      //   expense_car_id: null,
      //   expense_branch_id: null,
      //   investor_id: null,
      //   notes: "",
      //   items: [],
      // },
      request: {
        request_type: this.request_type,
        notes: "",
        items: [],
        total_sum: "0.0",
      },
      selectedItem: null,
      // Modals
      modals: {
        editBudgetItem: false,
      },
      // Users
      users: [],
    };
  },

  computed: {
    // filteredItems() {
    //   return this.request.items.filter((i) => {
    //     return !i.deleted || (i.deleted && i.deleted != 1);
    //   });
    // },
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
      return this.request.items.length;
    },
    // validateType() {
    //   return {
    //     success:
    //       this.request.expense_type_id !== null &&
    //       this.request.expense_type_id >= 0 &&
    //       this.request.expense_type_id <= 1 &&
    //       !(this.request.expense_type_id == 0 && this.request.request_type == "income"),
    //     error:
    //       this.request.expense_type_id === null ||
    //       (this.request.expense_type_id < 0 && this.request.expense_type_id > 1) ||
    //       (this.request.expense_type_id == 0 && this.request.request_type == "income"),
    //   };
    // },

    validateNotes() {
      return {
        success: this.request.notes && this.request.notes.length > 0,
        error: false,
      };
    },
    isRecipientDisabled() {
      return this.request_type != "advance_report";
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
        return "оплату";
      } else {
        return name;
      }
    },
    // Items
    recalcTotal() {
      // Total Summ
      // console.log(this.request.items);

      this.request.total_sum = this.request.items.reduce((accum, cur) => {
        return accum + parseFloat(cur.expense_amount);
      }, 0);
    },

    actionNewItem() {
      this.selectedItem = null;
      this.modals.editBudgetItem = true;
    },
    actioneEditItem(item) {
      // console.warn("actioneEditItem: ", item);
      // console.log(this.request.items[index]);
      this.selectedItem = item;
      this.modals.editBudgetItem = true;
    },

    // Items
    addNewBudgetItem(budgetItem) {
      this.modals.editBudgetItem = false;

      budgetItem.uuid = uuid();
      this.request.items.push(budgetItem);

      // console.warn("budgetItem: ", budgetItem);
      // Total Summ
      this.recalcTotal();
    },
    updateBudgetItem(budgetItem) {
      console.log("update item: ", budgetItem);
      this.modals.editBudgetItem = false;

      // Find index
      if (budgetItem.uuid) {
        var index = this.request.items.findIndex((p) => p.uuid == budgetItem.uuid);
      } else if (budgetItem.id) {
        var index = this.request.items.findIndex((p) => p.id == budgetItem.id);
      } else {
        console.error("Не найден uuid и id!");
      }
      // Replace
      this.request.items.splice(index, 1, budgetItem);

      // Total Summ
      this.recalcTotal();
    },
    removeItem(budgetItem) {
      // Find index
      if (budgetItem.uuid) {
        var index = this.request.items.findIndex((p) => p.uuid == budgetItem.uuid);
      } else if (budgetItem.id) {
        var index = this.request.items.findIndex((p) => p.id == budgetItem.id);
      } else {
        console.error("Не найден uuid и id!");
      }

      if (budgetItem.id && budgetItem.id !== null) {
        console.log(" Set delete prop");
        this.request.items[index].deleted = 1;
      } else {
        console.log(" Remove item");
        this.request.items.splice(index, 1);
      }

      // Total Summ
      this.recalcTotal();
    },
    // removeAllItem() {
    //   // this.expense.items.splice(index, 1);
    //   this.expense.items = this.expense.items.filter((i) => i.id);
    //   this.expense.items.forEach((item) => (item.deleted = 1));
    // },
    // Modal
    reset() {
      this.request.notes = "";

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
      // this.addactionNewItem();
      //
      if (this.requestId > 0) {
        // Edit mode
        this.fetchUsersThenRequest(this.requestId);
      } else {
        // Create mode
        this.fetchUsers();
        // Car Mode
        if (this.carId > 0) {
          // FIXME:
          // this.request.expense_type_id = 1; // Car
          // this.request.expense_car_id = this.carId;
          // Get branches & car
          // this.fetchBranchesThenCar(this.carId);
        }
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
        console.log(">>>formApproved ", this.request);
        this.createRequest();
      }
    },

    // Networking
    async fetchUsersThenRequest(requestId) {
      await this.fetchUsers();
      await this.fetchRequest(requestId);
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
        let result = await apiService.getBudgetRequest(request_id);
        this.request = result;
        // this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async createRequest() {
      this.isLoading = true;
      try {
        let result = await apiService.createBudgetRequest2(this.request);
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
        await apiService.updateBudgetRequest2(this.request);
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
