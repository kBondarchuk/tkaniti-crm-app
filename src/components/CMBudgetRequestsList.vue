<template>
  <UITableList
    id="budget_list"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    :pagination="pagination"
    @header:sort="handleHeaderSort"
    @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
  >
    <!-- Items -->
    <CMBudgetRequestsListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @event-details="$emit('eventDetails', item.id)"
      @event-edit="$emit('eventEdit', item.id)"
      @event-delete="$emit('eventDelete', item.id)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import UITableList from "@/components/UITableList.vue";
import CMBudgetRequestsListItem from "@/components/CMBudgetRequestsListItem.vue";

export default {
  name: "CMBudgetRequestsList",

  components: {
    CMBudgetRequestsListItem,
    UITableList,
  },

  props: {
    headerStickedAt: {
      type: Number,
      default: null,
    },
    filterStatus: {
      type: Number,
      default: null,
    },
    filterType: {
      type: String,
      default: null,
    },
  },

  emits: ["eventDetails", "eventEdit", "eventDelete"],

  data() {
    return {
      items: [],
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "status", name: "Статус", class: "" },
        { id: "created_dt", name: "Создана", class: "" },
        // { id: "updated_dt", name: "Обновлена", class: "" },
        { id: "request_type", name: "Тип", class: "" },
        // { id: "expense_type_id", name: "Объект", class: "" },
        // { id: "expense_category", name: "Категория", class: "" },
        // { id: "expense_car_id", name: "Автомобиль", class: "" },
        // { id: "branch_id", name: "Филиал", class: "" },
        { id: "notes", name: "Описание", class: "" },
        { id: "total_sum", name: "Cумма", class: "right aligned" },
        { id: "user", name: "Создал", class: "" },
        { id: "recipient_user", name: "Подотчётник", class: "" },
      ],
      sort: { sort_by: "created_dt", sort_order: "desc" },
      pagination: { page: 0, per_page: 30, total_count: null },
      filter: { request_type: null },
      isLoading: false,
    };
  },

  watch: {
    filterStatus(newStatus) {
      this.pagination.page = 0;
      this.refetch(newStatus);
    },
    filterType(newType) {
      this.filter.request_type = newType;
      this.pagination.page = 0;
      this.refetch(this.filterStatus);
    },
    "pagination.page"() {
      // console.log(this.pagination.page, newValue, oldValue);
      localStorage.setItem("lists.budget_list.pagination.page", JSON.stringify(this.pagination.page));
    },
  },

  created() {
    // console.log("+++ created");
    this.pagination.page = JSON.parse(localStorage.getItem("lists.budget_list.pagination.page")) || 0;
    // console.log("+++ created pagination.page: ", this.pagination.page);
  },

  methods: {
    handleHeaderSort(item) {
      this.sort = item;
      this.refetch(this.filterStatus);
    },
    handlePagingUp() {
      this.pagination.page++;
      this.refetch(this.filterStatus);
    },
    handlePagingDown() {
      this.pagination.page--;
      this.refetch(this.filterStatus);
    },
    handlePagingFirst() {
      this.pagination.page = 0;
      this.refetch(this.filterStatus);
    },
    handlePagingLast() {
      this.pagination.page = this.pagination.total_pages - 1;
      this.refetch(this.filterStatus);
    },

    // Networking
    async refetch(status) {
      this.isLoading = true;

      if (!this.filter.request_type) {
        this.filter.request_type = this.filterType;
      }

      var filter = { ...this.sort, ...this.pagination, ...this.filter };

      try {
        let { data, meta } = await apiService.getBudgetRequests(status, filter);
        this.pagination.total_count = meta.total_count;
        this.pagination.total_pages = meta.total_pages;
        this.items = data;

        if (meta.total_pages < this.pagination.page) {
          this.handlePagingFirst();
        }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
