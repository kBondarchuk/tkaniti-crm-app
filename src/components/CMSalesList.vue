<template>
  <!-- @header:sort="handleSort" -->
  <UITableList
    id="CMExpensesList"
    :headers="headers"
    :items-count="list.length"
    :is-loading="isLoading"
    :bordered="!noBorder"
    not-selectable
    :pagination="pagination"
    @header:sort="handleSort"
    @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
  >
    <CMSalesListItem
      v-for="item in list"
      :key="item.id"
      :item="item"
      :show-car="showCar"
      :show-investor="showInvestor"
      :show-branch="showBranch"
      @event-details="$emit('eventDetails', item)"
    ></CMSalesListItem>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import CMSalesListItem from "@/components/CMSalesListItem.vue";

export default {
  name: "CMSalesList",
  components: {
    CMSalesListItem,
  },
  props: {
    carId: {
      type: Number,
    },
    investorId: {
      type: Number,
    },
    showInvestor: {
      type: Boolean,
      default: false,
    },
    showBranch: {
      type: Boolean,
      default: false,
    },
    showCar: {
      type: Boolean,
      default: false,
    },
    showGeneral: {
      type: Boolean,
      default: false,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["eventDetails"],
  data() {
    return {
      list: [],
      sort: { sort_by: "date", sort_order: "desc" },
      pagination: { page: 0, per_page: 25 },
      isLoading: false,
    };
  },
  computed: {
    headers() {
      // <th v-if="showInvestor">Инвестор</th>
      // <th v-if="showBranch">Филиал</th>
      // <th v-if="showCar">Автомобиль</th>
      var arr = [];
      arr.push({ id: "id", name: "No." });
      arr.push({ id: "date", name: "Дата" });
      if (this.showInvestor) arr.push({ id: "investor", name: "Инвестор" });
      if (this.showBranch) arr.push({ id: "branch", name: "Филиал" });
      // arr.push({ id: "category_name", name: "Категория" });
      if (this.showCar) arr.push({ id: "car", name: "Автомобиль" });
      arr.push({ id: "amount", name: "Сумма", class: "right aligned" });
      arr.push({ id: "user", name: "Провёл", class: "" });
      arr.push({ id: "basis_id", name: "Основание", class: "" });
      arr.push({ id: "notes", name: "Примечание" });

      // [
      //   { name: "No." },
      //   { name: "Дата" },
      //   { name: "Инвестор" },
      //   { name: "Филиал" },
      //   { name: "Категория" },
      //   { name: "Автомобиль" },
      //   { name: "Сумма", class: "right aligned" },
      //   { name: "Примечание" },
      // ];

      return arr;
    },
  },
  watch: {
    carId: {
      // immediate: true,
      handler(newValue) {
        // newValue, oldValue
        console.log("fetching expenses for: " + this.carId + " + " + this.showGeneral);
        if (isNaN(newValue)) return;
        if (this.showGeneral) return;
        this.pagination.page = 0;
        this.fetchSales(this.carId);
      },
    },
    showGeneral: {
      // immediate: true,
      handler(newValue) {
        // newValue, oldValue
        console.log("fetching expenses general: " + newValue);
        this.pagination.page = 0;
        this.fetchSales(this.carId);
      },
    },
  },
  methods: {
    eventDetails(item) {
      console.log("Details clicked id: " + item.id);
    },
    handleSort(item) {
      this.sort = item;
      // console.log(item);
      this.fetchSales(this.carId);
    },
    handlePagingUp() {
      this.pagination.page++;
      // console.log(this.pagination);
      this.fetchSales(this.carId);
    },
    handlePagingDown() {
      this.pagination.page--;
      // console.log(this.pagination);
      this.fetchSales(this.carId);
    },
    handlePagingFirst() {
      this.pagination.page = 0;
      // console.log(this.pagination);
      this.fetchSales(this.carId);
    },
    handlePagingLast() {
      this.pagination.page = this.pagination.total_pages - 1;
      this.fetchSales(this.carId);
    },

    async fetchSales(carId) {
      this.isLoading = true;

      var filter = { ...this.sort, ...this.pagination };

      try {
        let data, meta;
        if (this.investorId) {
          // ({ data, meta } = await apiService.getExpensesForInvestor(this.investorId, filter));
        } else if (this.showGeneral) {
          // ({ data, meta } = await apiService.getExpensesGeneral(filter));
        } else {
          ({ data, meta } = await apiService.getSales({ car_id: carId }, filter));
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
