<template>
  <UITableList
    id="dtps"
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
    <CMDTPListItem v-for="item in items" :key="item.id" :item="item" @event-details="$emit('eventDetails', item)" />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";
import CMDTPListItem from "@/components/CMDTPListItem.vue";

export default {
  name: "CMDTPList",

  components: {
    CMDTPListItem,
    UITableList,
  },

  props: {
    car_id: {
      type: Number,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    headerStickedAt: {
      type: Number,
      default: null,
    },
  },
  emits: ["eventDetails"],

  data() {
    return {
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "date", name: "Дата", class: "" },
        { id: "car_id", name: "Автомобиль", class: "" },
        { id: "driver", name: "Водитель", class: "" },
        { id: "culprit", name: "Виновник", class: "" },
        { id: "culprit_phone", name: "Тел. виновника", class: "" },
        { id: "inspection_date", name: "Дата осмотра", class: "" },
        { id: "payout_date", name: "Срок выплат", class: "" },
        { id: "payout_amount", name: "Сумма", class: "right aligned" },
        { id: "description", name: "Описание повреждений", class: "" },
        {
          id: "days_till_payout",
          name: "Дней до выплаты",
          class: "right aligned",
        },
      ],
      sort: { sort_by: "id", sort_order: "desc" },
      pagination: { page: 0, per_page: 30, total_count: null },
      items: [],
      isLoading: false,
    };
  },
  mounted() {
    // this.refetch();
  },

  methods: {
    handleHeaderSort(item) {
      this.sort = item;
      this.refetch();
    },
    // handleHeaderSort(filter) {
    //   this.refetch(filter);
    // },
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

    // Network
    async refetch() {
      this.isLoading = true;

      var filter = { ...this.sort, ...this.pagination };

      try {
        let { data, meta } = await apiService.getDTPs(this.car_id, filter);
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
