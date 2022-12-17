<template>
  <UITableList :headers="headers" :items-count="items.length" :loading="isLoading" bordered no-sort not-selectable>
    <tr v-for="item in items" :key="item.id">
      <!-- <td>{{item.id}}</td> -->
      <td>{{ $filters.date(item.datetime) }}</td>
      <td v-if="item.new_customer_status == 0">Создание</td>
      <td v-else-if="item.new_customer_status == 2">Изменение пароля</td>
      <td v-else>Изменение</td>
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
import UITableList from "@/components/UITableList.vue";

export default {
  name: "CMCustomerHistoryList",
  components: {
    UITableList,
  },
  props: {
    customer_id: {
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
      return [{ name: "Дата, время" }, { name: "Событие" }, { name: "Новый филиал" }, { name: "Сотрудник" }];
    },
  },
  mounted() {
    this.refetch();
  },
  methods: {
    async refetch() {
      this.isLoading = true;
      try {
        let result = await apiService.getCustomerHistory(this.customer_id);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
