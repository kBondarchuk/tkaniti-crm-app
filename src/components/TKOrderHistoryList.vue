<template>
  <UITableList :headers="headers" :items-count="items.length" :loading="isLoading" bordered no-sort not-selectable>
    <tr v-for="item in items" :key="item.id">
      <!-- <td>{{item.id}}</td> -->
      <td>{{ $filters.date(item.datetime) }}</td>
      <td>
        <TKOrderStatus v-if="item.new_status_id != null" :value="item.new_status_id" />
      </td>
      <td>
        {{ item.user }}
      </td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import TKOrderStatus from "@/components/TKOrderStatus.vue";

export default {
  name: "TKOrderHistoryList",

  components: {
    TKOrderStatus,
  },

  props: {
    orderId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      items: [],
      isLoading: false,
    };
  },

  computed: {
    headers() {
      return [{ name: "Дата, время" }, { name: "Новый статус" }, { name: "Сотрудник" }];
    },
  },

  mounted() {
    this.refetch();
  },

  methods: {
    async refetch() {
      this.isLoading = true;
      try {
        this.items = await apiService.getOrderHistory(this.orderId);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
