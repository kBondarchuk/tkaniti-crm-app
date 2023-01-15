<template>
  <UITableList :headers="headers" :items-count="items.length" :loading="isLoading" bordered no-sort not-selectable>
    <tr v-for="item in items" :key="item.id">
      <!-- <td>{{item.id}}</td> -->
      <td>{{ $filters.date(item.datetime) }}</td>
      <td>
        <CMCarStatusBadge v-if="item.new_car_status != null" :value="item.new_car_status" />
      </td>
      <td>
        {{ item.branch }}
      </td>
      <td>
        {{ item.user }}
      </td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMCarStatusBadge from "@/components/CMCarStatusBadge.vue";

export default {
  name: "CMCarHistoryList",
  components: {
    CMCarStatusBadge,
  },
  props: {
    car_id: {
      type: Number,
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
      return [{ name: "Дата, время" }, { name: "Новый статус" }, { name: "Новый филиал" }, { name: "Сотрудник" }];
    },
  },
  mounted() {
    this.refetch();
  },
  methods: {
    async refetch() {
      this.isLoading = true;
      try {
        let result = await apiService.getCarHistory(this.car_id);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
