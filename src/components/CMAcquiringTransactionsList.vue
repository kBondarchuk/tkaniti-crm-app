<template>
  <UITableList
    id="acquiring"
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
    <CMAcquiringTransactionsListItem
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
import CMAcquiringTransactionsListItem from "@/components/CMAcquiringTransactionsListItem.vue";

export default {
  name: "CMAcquiringTransactionsList",
  components: {
    CMAcquiringTransactionsListItem,
  },
  props: {
    filterDate: {
      type: Object,
      default: null,
    },
    headerStickedAt: {
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
        { id: "date", name: "Дата/Время", class: "" },
        { id: "contract_type", name: "Тип оплаты", class: "" },
        { id: "contract_id", name: "Договор", class: "" },
        { id: "orderNumber", name: "Номер оплаты", class: "" },
        { id: "amount", name: "Запраш. сумма", class: "right aligned" },
        {
          id: "depositedAmount",
          name: "Списанная сумма",
          class: "right aligned",
        },
        { id: "orderStatus", name: "Статус оплаты", class: "" },
        { id: "actionCode", name: "Код ошибки", class: "" },
        { id: "cleared", name: "Зачислено", class: "" },
      ],
      isLoading: false,
      sort: { sort_by: "created_dt", sort_order: "desc" },
      pagination: { page: 0, per_page: 30 },
    };
  },
  mounted() {
    this.refetch(this.filterDate);
  },
  methods: {
    handleHeaderSort(item) {
      this.sort = item;
      this.refetch(this.filterDate);
    },
    handlePagingUp() {
      this.pagination.page++;
      console.log(this.pagination);
      this.refetch(this.filterDate);
    },
    handlePagingDown() {
      this.pagination.page--;
      console.log(this.pagination);
      this.refetch(this.filterDate);
    },
    handlePagingFirst() {
      this.pagination.page = 0;
      this.refetch(this.filterDate);
    },
    handlePagingLast() {
      this.pagination.page = this.pagination.total_pages - 1;
      this.refetch(this.filterDate);
    },
    // Networking
    async refetch(filterDate) {
      this.isLoading = true;

      var filter = { ...filterDate, ...this.sort, ...this.pagination };

      try {
        let { data, meta } = await apiService.getAcquiringTransactions(filter);
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
