<template>
  <div>
    <UIButton
      text="Новая статья"
      icon="plus"
      type="right labeled"
      @click="
        selectedCategory = null;
        modals.category = true;
      "
    />

    <UITableList
      id="CMPrefsExpensesCategories"
      :headers="headers"
      :items-count="categories.length"
      :is-loading="isLoading"
      bordered
      @header:sort="handleHeaderSort"
    >
      <!-- Items -->
      <CMPrefsExpensesCategoriesListItem
        v-for="item in categories"
        :key="item.id + '-branch-' + item.customer_id"
        :item="item"
        @event-details="handleDetails"
        @event-edit="$emit('eventEdit', item.id)"
        @event-delete="$emit('eventDelete', item.id)"
      />
    </UITableList>

    <!-- New Expense Modal -->
    <ModalExpenseCategoryEdit
      :active="modals.category"
      :selected-item="selectedCategory"
      @hide="modals.category = false"
      @did-change="branchCreated"
    />
    <!------->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

import UITableList from "@/components/UITableList.vue";
import CMPrefsExpensesCategoriesListItem from "@/components/CMPrefsExpensesCategoriesListItem.vue";
import ModalExpenseCategoryEdit from "@/components/ModalExpenseCategoryEdit.vue";

export default {
  name: "CMPrefsExpensesCategories",

  components: {
    UITableList,
    CMPrefsExpensesCategoriesListItem,
    ModalExpenseCategoryEdit,
  },

  emits: ["eventEdit", "eventDelete"],

  data() {
    return {
      headers: [
        { id: "id", name: "ID", class: "" },
        { id: "parent_id", name: "Родит.", class: "" },
        { id: "expense_type_id", name: "Тип", class: "" },
        { id: "selectable", name: "Выбор", class: "" },
        { id: "name", name: "Название", class: "" },
        { id: "path", name: "Путь", class: "" },
      ],
      filter: {},
      categories: [],
      isLoading: false,
      // Modals
      modals: {
        category: false,
      },
      selectedCategory: null,
    };
  },

  computed: {
    items() {
      return this.report;
    },
  },

  methods: {
    handleHeaderSort(filter) {
      this.filter = filter;
      this.refetch(filter);
    },
    handleDelete() {
      // expense_id
      // console.log("delete clicked: " + expense_id);
    },
    handleDetails(item) {
      this.selectedCategory = item;
      if (item != null) {
        this.modals.category = true;
      }
    },
    // Modal
    branchCreated() {
      console.log("branch changed!");
      this.refetch(this.filter);
    },
    // Network
    async refetch(filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getExpensesCategories(filter);
        // console.log(result);
        this.categories = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
