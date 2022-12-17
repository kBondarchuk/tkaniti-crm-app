<template>
  <UITableList
    id="CMAccountsGraph"
    :headers="headers"
    :items-count="list.length"
    :is-loading="isLoading"
    bordered
    not-selectable
    no-sort
  >
    <!-- @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
    @header:sort="handleHeaderSort"
    :pagination="pagination" -->
    <CMAccountsGraphItem
      v-for="item in list"
      :key="item.day"
      :item="item"
      @event-details="$emit('eventDetails', item)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";
import CMAccountsGraphItem from "@/components/CMAccountsGraphItem.vue";

export default {
  name: "CMAccountsGraph",

  components: {
    CMAccountsGraphItem,
    UITableList,
  },

  props: {
    contractId: {
      type: Number,
      default: null,
    },
  },

  emits: ["eventDetails"],

  data() {
    return {
      list: [],
      isLoading: false,
      // pagination: {
      //   page: 0,
      //   per_page: 30,
      // },
      // sort: { sort_by: "dt", sort_order: "desc" },
    };
  },

  computed: {
    headers() {
      var headers = [
        { name: "Дата", id: "day" },
        { name: "Начисление долга", id: "debt_plus" },
        { name: "Погашение долга", id: "debt_minus" },
        { name: "Баланс долга", id: "debt_balance" },
        { name: "Начисление пени", id: "penalty_plus" },
        { name: "Погашение пени", id: "penalty_minus" },
        { name: "Баланс пени", id: "penalty_balance" },
        { name: "Пополнение депозита", class: "right aligned", id: "deposit_plus" },
        { name: "Списание с депозита", class: "right aligned", id: "deposit_minus" },
        { name: "Баланс депозита", class: "right aligned", id: "deposit_balance" },
      ];

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
    // handleHeaderSort(item) {
    //   console.log(item, " SORTING DISABLED");

    //   // this.sort = item;
    //   // this.refetch();
    // },
    // handlePagingUp() {
    //   this.pagination.page++;
    //   console.log(this.pagination);
    //   this.refetch();
    // },
    // handlePagingDown() {
    //   this.pagination.page--;
    //   console.log(this.pagination);
    //   this.refetch();
    // },
    // handlePagingFirst() {
    //   this.pagination.page = 0;
    //   this.refetch();
    // },
    // handlePagingLast() {
    //   this.pagination.page = this.pagination.total_pages - 1;
    //   this.refetch();
    // },

    // Network
    async refetch() {
      this.isLoading = true;
      try {
        // Items
        this.list = await apiService.getContractsAccountsGraph(this.contractId);
        //
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
