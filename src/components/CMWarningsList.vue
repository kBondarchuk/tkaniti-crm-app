<template>
  <UITableList
    id="warnings"
    title="Напоминания"
    bordered
    hide-paging
    :columns-count="2"
    :items-count="items.length"
    :is-loading="isLoading"
    :empty-text="emptyText"
    :pagination="pagination"
    @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
  >
    <CMWarningsListItem v-for="item in items" :key="item.id" :item="item" @click="handleDetails(item)" />
    <!--  -->
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMWarningsListItem from "@/components/CMWarningsListItem.vue";

export default {
  name: "CMWarningsList",

  components: {
    CMWarningsListItem,
  },

  props: {
    carId: {
      type: Number,
      default: null,
    },
    customerId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      items: [],
      isLoading: false,
      pagination: { page: 0, per_page: 20 },
    };
  },

  computed: {
    emptyText() {
      return "Нет напоминаний";
    },
  },

  watch: {
    carId: {
      immediate: true,
      handler() {
        this.refetch();
      },
    },
    customerId: {
      immediate: true,
      handler() {
        this.refetch();
      },
    },
  },

  methods: {
    handleDetails(item) {
      console.log("details clicked: " + item.id);

      if (item.car_id) {
        if (item.car_id != this.carId) {
          this.$router.push({
            name: "cars_details",
            params: { id: item.car_id },
          });
        }
      } else if (item.customer_id) {
        this.$router.push({
          name: "customers_details",
          params: { id: item.customer_id },
        });
      }
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
      this.isLoading = true;

      var filter = { ...{ car_id: this.carId, customer_id: this.customerId }, ...this.pagination };

      try {
        // result = await apiService.getWarnings({ car_id: this.carId });
        // this.items = result;
        let { data, meta } = await apiService.getWarnings(filter);
        this.pagination.total_count = meta.total_count;
        this.pagination.total_pages = meta.total_pages;
        this.items = data;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
  // mounted() {
  //   this.refetch();
  // },
};
</script>
