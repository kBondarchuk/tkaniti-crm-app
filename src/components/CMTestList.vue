<template>
  <UITable
    :headers="['No.', 'Модель', 'Стоимость', 'Гос. номер', 'Пробег', 'VIN']"
    :count="items.length"
    :loading="isLoading"
  >
    <CMCarsListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @event-details="handleDetails(item)"
      @event-edit="$handleEdit(item)"
      @event-delete="handleDelete(item)"
    ></CMCarsListItem>
  </UITable>
</template>

<script>
import apiService from "@/services/api.service.js";

import UITable from "@/components/UITable.vue";
import CMCarsListItem from "@/components/TKOrdersListItem.vue";

export default {
  name: "CMTestList",
  components: {
    UITable,
    CMCarsListItem,
  },
  data() {
    return {
      items: [],
      isLoading: false,
    };
  },
  mounted() {
    this.refetch();
  },
  methods: {
    handleDelete(expense_id) {
      console.log("delete clicked: " + expense_id);
    },
    handleDetails(expense_id) {
      console.log("details clicked: " + expense_id);
    },
    async refetch() {
      this.isLoading = true;
      try {
        let result = await apiService.getCars();
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
