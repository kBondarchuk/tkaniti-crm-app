<template>
  <UITableList
    id="car_fines"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    :bordered="bordered"
    :pagination="pagination"
    @header:sort="handleHeaderSort"
    @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
  >
    <CMCarFinesItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :hide-car-column="hideCarColumn"
      @event-details="$emit('eventDetails', item)"
      @filter-car="
        (newValue) => {
          $emit('filterCar', newValue);
        }
      "
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";
import CMCarFinesItem from "@/components/CMCarFinesItem.vue";
import { arrayEquals } from "@/utils/utils.js";

export default {
  name: "CMCarFinesList",

  components: {
    CMCarFinesItem,
    UITableList,
  },

  props: {
    carId: {
      type: Number,
      default: null,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    headerStickedAt: {
      type: Number,
      default: null,
    },
    filterStatus: {
      type: Array,
      default: null,
    },
    filterPayedStatus: {
      type: Array,
      default: null,
    },
    filterTermsStatus: {
      type: Array,
      default: null,
    },
    searchString: {
      type: String,
      default: null,
    },
    hideCarColumn: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["filterCar", "eventDetails"],

  data() {
    return {
      sort: { sort_by: "id", sort_order: "desc" },
      pagination: { page: 0, per_page: 30, total_count: null },
      items: [],
      // filter: {},
      isLoading: false,
    };
  },

  computed: {
    headers() {
      var headers = [
        { id: "id", name: "No.", class: "" },
        { id: "car", name: "Автомобиль", class: "" },
        { id: "decree_number", name: "Постановление", class: "" },
        { id: "decree_date", name: "Дата", class: "" },
        { id: "amount", name: "Сумма", class: "right aligned" },
        { id: "payed", name: "Оплата", class: "" },
        { id: "charged", name: "Начисление", class: "" },
        { id: "offense_datetime", name: "Дата наруш.", class: "" },
        { id: "contract_id", name: "Договор", class: "" },
        // { id: "user_id", name: "Добавил", class: "" },
        // { id: "gibdd_updated_ts", name: "Обновлено", class: "" },
        { id: "created_dt", name: "Добавлен", class: "" },
      ];

      // Remove car column
      if (this.hideCarColumn) {
        headers = headers.filter((item) => {
          return item.id != "car";
        });
      }

      return headers;
    },
  },

  watch: {
    carId: {
      immediate: false,
      handler() {
        this.pagination.page = 0;
        // console.log("carId", this.carId);

        this.refetch();
      },
    },
    filterStatus(newValue, oldValue) {
      console.log("filterStatus", newValue, oldValue, arrayEquals(newValue, oldValue));
      if (!arrayEquals(newValue, oldValue)) {
        this.pagination.page = 0;
        this.refetch();
      }
    },
    filterPayedStatus(newValue, oldValue) {
      console.log("filterPayedStatus", newValue, oldValue, arrayEquals(newValue, oldValue));
      if (!arrayEquals(newValue, oldValue)) {
        this.pagination.page = 0;
        this.refetch();
      }
    },
    filterTermsStatus(newValue, oldValue) {
      console.log("filterTermsStatus", newValue, oldValue, arrayEquals(newValue, oldValue));
      if (!arrayEquals(newValue, oldValue)) {
        this.pagination.page = 0;
        this.refetch();
      }
    },
    searchString() {
      // console.log("searchString", this.searchString);
      this.refetch();
    },
  },

  // created() {
  // console.warn("created > ", this.filterTermsStatus, this.filterPayedStatus, this.carId, this.filterStatus);
  // },

  methods: {
    handleHeaderSort(item) {
      this.sort = item;
      this.refetch();
    },
    handlePagingUp() {
      this.pagination.page++;
      this.refetch();
    },
    handlePagingDown() {
      this.pagination.page--;
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
      console.warn("refetch", this.filterTermsStatus, this.filterPayedStatus, this.carId, this.filterStatus);
      this.isLoading = true;

      // if (!this.carId) return;

      var filter = { ...this.sort, ...this.pagination };
      var statuses = {
        charge_arr: this.filterStatus,
        payed_arr: this.filterPayedStatus,
        terms_arr: this.filterTermsStatus,
      };

      try {
        let { data, meta } = await apiService.getCarFines(this.carId, statuses, filter, this.searchString);
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
