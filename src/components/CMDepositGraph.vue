<template>
  <UITableList
    id="CMDepositGraph"
    :headers="headers"
    :items-count="list.length"
    :is-loading="isLoading"
    bordered
    not-selectable
    no-sort
    class="collapsing"
  >
    <!-- @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
    @header:sort="handleHeaderSort"
    :pagination="pagination" -->
    <CMDepositGraphItem
      v-for="item in list"
      :key="item.day"
      :item="item"
      @event-details="$emit('eventDetails', item)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMDepositGraphItem from "@/components/CMDepositGraphItem.vue";

export default {
  name: "CMDepositGraph",

  components: {
    CMDepositGraphItem,
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
        { name: "Пополнение с карты", class: "right aligned", id: "acquiring" },
        { name: "Пополнение наличными", class: "right aligned", id: "cash" },
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
        this.list = await apiService.getContractsDepositsGraph(this.contractId);
        //
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
