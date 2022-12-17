<template>
  <UITableList
    id="advance_request_list"
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
    <CMAdvanceRequestsListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @event-details="$emit('eventDetails', item)"
      @event-edit="$emit('eventEdit', item.id)"
      @event-delete="$emit('eventDelete', item.id)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import UITableList from "@/components/UITableList.vue";
import CMAdvanceRequestsListItem from "@/components/CMAdvanceRequestsListItem.vue";

export default {
  name: "CMAdvanceRequestsList",

  components: {
    CMAdvanceRequestsListItem,
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
      type: Number,
      default: null,
    },
  },

  emits: ["eventDetails", "eventDelete", "eventEdit"],

  data() {
    return {
      items: [],
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "type_name", name: "Документ", class: "" },
        { id: "status", name: "Статус", class: "" },
        { id: "created_dt", name: "Создана", class: "" },
        { id: "apply_dt", name: "Исполнена", class: "" },
        // { id: "updated_dt", name: "Обновлена", class: "" },
        // { id: "request_type", name: "Тип", class: "" },
        // { id: "expense_type_id", name: "Объект", class: "" },
        // { id: "expense_category", name: "Категория", class: "" },
        // { id: "expense_car_id", name: "Автомобиль", class: "" },
        // { id: "branch_id", name: "Филиал", class: "" },
        { id: "amount", name: "Cумма", class: "right aligned" },
        { id: "user_recipient", name: "Получатель", class: "" },
        { id: "user", name: "Создал", class: "" },
        { id: "title", name: "Назначение", class: "" },
      ],
      sort: { sort_by: "created_dt", sort_order: "desc" },
      pagination: { page: 0, per_page: 30, total_count: null },
      filter: { type_id: 0 },
      isLoading: false,
    };
  },
  watch: {
    filterStatus(newStatus) {
      this.pagination.page = 0;
      this.refetch(newStatus);
    },
    filterType(newType) {
      this.filter.type_id = newType;
      this.refetch(this.filterStatus);
    },
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

      var filter = { ...this.sort, ...this.pagination, ...this.filter };

      try {
        let { data, meta } = await apiService.getAdvanceRequests(status, filter);
        this.pagination.total_count = meta.total_count;
        this.pagination.total_pages = meta.total_pages;
        this.items = data;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
