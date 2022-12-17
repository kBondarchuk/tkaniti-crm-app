<template>
  <UITableList :headers="headers" :items-count="items.length" :loading="isLoading" bordered no-sort not-selectable>
    <tr v-for="item in items" :key="item.id">
      <td>{{ $filters.date(item.dt, false) }}</td>
      <td>{{ $filters.number(item.odometr) }} км.</td>
      <td>
        {{ item.user }}
      </td>
      <td class="right aligned">
        <UIButton type="basic small" @click="$emit('edit', item)">Изменить</UIButton>
      </td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";

export default {
  name: "CMCarDataHistoryList",
  components: {
    UITableList,
  },
  props: {
    car_id: {
      type: Number,
    },
  },

  emits: ["edit"],

  data() {
    return {
      items: [],
      isLoading: false,
    };
  },
  computed: {
    headers() {
      return [{ name: "Дата" }, { name: "Пробег" }, { name: "Сотрудник" }, { name: "" }];
    },
  },
  mounted() {
    this.refetch();
  },
  methods: {
    async refetch() {
      this.isLoading = true;
      try {
        let result = await apiService.getCarDataHistory(this.car_id);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
