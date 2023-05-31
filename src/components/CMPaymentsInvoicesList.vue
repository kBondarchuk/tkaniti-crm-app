<template>
  <UITableList
    id="invoices"
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
    <CMPaymentsInvoicesListItem
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
import CMPaymentsInvoicesListItem from "@/components/CMPaymentsInvoicesListItem.vue";

export default {
  name: "CMPaymentsInvoicesList",

  components: {
    CMPaymentsInvoicesListItem,
  },

  props: {
    filter: {
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
        { id: "created_ts", name: "Дата/Время", class: "" },
        { id: "payment_method", name: "Способ", class: "" },
        { id: "company_id", name: "Юр. лицо", class: "" },
        { id: "contract_type", name: "Тип договора", class: "" },
        { id: "contract_id", name: "Номер договора", class: "" },
        { id: "invoice_number", name: "Номер счёта", class: "" },
        {
          id: "deposit_amount",
          name: "Сумма",
          class: "right aligned",
        },
        { id: "status", name: "Статус оплаты", class: "" },
        { id: "cleared", name: "Зачислено", class: "" },
        { id: "status_code", name: "Чек", class: "" },
      ],
      isLoading: false,
      sort: { sort_by: "created_dt", sort_order: "desc" },
      pagination: { page: 0, per_page: 30 },
    };
  },

  mounted() {
    // this.refetch(this.filter);
  },

  methods: {
    handleHeaderSort(item) {
      this.sort = item;
      this.refetch();
    },
    handlePagingUp() {
      this.pagination.page++;
      console.log(this.pagination);
      this.refetch();
    },
    handlePagingDown() {
      this.pagination.page--;
      console.log(this.pagination);
      this.refetch();
    },
    handlePagingFirst() {
      this.pagination.page = 0;
      this.refetch();
    },
    handlePagingLast() {
      this.pagination.page = this.pagination.total_pages - 1;
      this.refetch();
    },

    // Networking
    async refetch() {
      this.isLoading = true;

      var filter = { ...this.filter, ...this.sort, ...this.pagination };
      // console.warn("refetch", filter);

      try {
        let { data, meta } = await apiService.getPaymentsInvoices(filter);
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
