<template>
  <UITableList :headers="headers" :items-count="items.length" :loading="isLoading" bordered no-sort not-selectable>
    <tr v-for="item in items" :key="item.id">
      <!-- <td>{{item.id}}</td> -->
      <td>{{ $filters.date(item.datetime) }}</td>
      <td>
        <TKGoodStatus v-if="item.new_status_id != null" :value="item.new_status_id" />
      </td>
      <td>
        {{ item.user }}
      </td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import TKGoodStatus from "#/TKGoodStatus.vue";
import Alerts from "@/utils/alerts";

export default {
  name: "TKGoodHistoryList",

  components: {
    TKGoodStatus,
  },

  props: {
    goodId: {
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
        this.items = await apiService.getGoodHistory(this.goodId);
      } catch (error) {
        Alerts.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
