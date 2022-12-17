<template>
  <UITableList
    id="CMTransactionsList"
    :headers="headers"
    :items-count="list.length"
    :is-loading="isLoading"
    :pagination="pagination"
    bordered
    not-selectable
    no-sort
    @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
  >
    <CMTransactionsListItem
      v-for="item in list"
      :key="item.id"
      :item="item"
      :show-branch="showBranch"
      :show-basis="showBasis"
      :customer-account="customer_id > 0"
      @event-details="$emit('eventDetails', item)"
    ></CMTransactionsListItem>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";
import CMTransactionsListItem from "@/components/CMTransactionsListItem.vue";

export default {
  name: "CMTransactionsList",
  components: {
    CMTransactionsListItem,
    UITableList,
  },
  props: {
    contract_id: {
      type: Number,
    },
    car_id: {
      type: Number,
    },
    customer_id: {
      type: Number,
    },
    // lease || rent
    contract_type: {
      type: String,
      default: "lease",
    },
    showBranch: {
      type: Boolean,
      default: false,
    },
    showBasis: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["eventDetails"],
  data() {
    return {
      list: [],
      isLoading: false,
      pagination: {
        page: 0,
        per_page: 30,
      },
    };
  },
  computed: {
    headers() {
      var headers = [
        { name: "No." },
        { name: "Дата" },
        { name: "Тип" },
        { name: "Статья расхода", id: "category_name" },
        { name: "Филиал", id: "branch" },
        { name: "Автор" },
        { name: "Сумма +", class: "right aligned" },
        { name: "Сумма -", class: "right aligned" },
        { name: "Основание", id: "basis" },
        { name: "Примечание" },
      ];

      // show branch
      if (!this.showBranch) {
        headers = headers.filter((item) => {
          return item.id != "branch";
        });
      }
      // show basis
      if (!this.showBasis) {
        headers = headers.filter((item) => {
          return item.id != "basis" && item.id != "category_name";
        });
      }

      return headers;
    },
  },
  mounted() {
    this.refetch();
  },
  methods: {
    eventDetails(item) {
      console.log("Details clicked id: " + item.id);
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

    // Network
    async refetch() {
      this.isLoading = true;
      try {
        let data, meta;
        if (this.contract_id && this.contract_type == "lease") {
          ({ data, meta } = await apiService.getTransactionsForContract(this.contract_id, this.pagination));
        } else if (this.contract_id && this.contract_type == "rent") {
          ({ data, meta } = await apiService.getTransactionsForRentContract(this.contract_id, this.pagination));
        } else if (this.car_id) {
          ({ data, meta } = await apiService.getTransactionsForCar(this.car_id, this.pagination));
        } else if (this.customer_id) {
          ({ data, meta } = await apiService.getTransactionsForCustomer(this.customer_id, this.pagination));
        }

        // Items
        this.list = data;
        // Meta
        console.log(meta);
        this.pagination.total_count = meta.total_count;
        this.pagination.total_pages = meta.total_pages;
        //
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
