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
    <CMRegistrationRequestsListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @event-details="$emit('eventDetails', item)"
      @event-edit="$emit('eventEdit', item.id)"
      @event-delete="$emit('eventDelete', item.id)"
    ></CMRegistrationRequestsListItem>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import CMRegistrationRequestsListItem from "@/components/CMRegistrationRequestsListItem.vue";

export default {
  name: "CMRegistrationRequestsList",
  components: {
    CMRegistrationRequestsListItem,
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
        { id: "last_name", name: "ФИО", class: "" },
        { id: "phone", name: "Телефон", class: "" },
        { id: "email", name: "EMail", class: "" },
        { id: "branch_id", name: "Филиал", class: "" },
        { id: "user", name: "Автор", class: "" },
        { id: "notes", name: "Описание", class: "" },
      ],
      sort: { sort_by: "created_dt", sort_order: "desc" },
      pagination: { page: 0, per_page: 30, total_count: null },
      isLoading: false,
    };
  },
  watch: {
    filterStatus(newStatus) {
      this.pagination.page = 0;
      this.refetch(newStatus);
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

      var filter = { ...this.sort, ...this.pagination };

      try {
        let { data, meta } = await apiService.getRegistrationRequests(status, filter);
        console.log("meta: ", meta);
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
