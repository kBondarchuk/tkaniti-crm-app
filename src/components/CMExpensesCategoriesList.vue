<template>
  <UITableList
    id="CMExpensesCategories"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    no-sort
  >
    <!--  -->
    <CMExpensesCategoriesItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @event-details="$emit('eventDetails', item)"
      @event-edit="$emit('eventEdit', item.id)"
      @event-delete="$emit('eventDelete', item.id)"
    />
    <!--  -->
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import UITableList from "@/components/UITableList.vue";
import CMExpensesCategoriesItem from "@/components/CMExpensesCategoriesItem.vue";

export default {
  name: "CMExpensesCategoriesList",
  components: {
    CMExpensesCategoriesItem,
    UITableList,
  },
  props: {
    headerStickedAt: {
      type: Number,
      default: null,
    },
    filterType: {
      type: Number,
      default: null,
    },
  },
  emits: ["eventDetails", "eventEdit", "eventDelete"],
  data() {
    // { id: "id", name: "No.", class: "" },
    return {
      headers: [{ id: "name", name: "Название", class: "" }],
      items: [],
      isLoading: false,
    };
  },
  watch: {
    filterType: {
      immediate: true,
      handler(newValue) {
        // console.log(newValue, oldValue, arrayEquals(newValue, oldValue));
        this.refetch(newValue);
      },
    },
  },
  methods: {
    // handleDelete(expense_id) {
    //   console.log("delete clicked: " + expense_id);
    // },
    // Networking
    async refetch(filterType) {
      this.isLoading = true;
      try {
        let result = await apiService.getExpensesCategories(filterType);
        this.items = result;
        // console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
