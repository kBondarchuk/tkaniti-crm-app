<template>
  <UITableList
    id="customers"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    @header:sort="handleHeaderSort"
  >
    <!-- Items -->
    <TKCustomersListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :selected="selectedItems.findIndex((_item) => _item.id == item.id) > -1"
      @event-details="handleSelection(item)"
    />
    <!--  -->
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import TKCustomersListItem from "@/components/TKCustomersListItem.vue";

export default {
  name: "TKCMCustomersList",
  components: {
    TKCustomersListItem,
  },
  props: {
    headerStickedAt: {
      type: Number,
      default: null,
    },
    searchString: {
      type: String,
      default: null,
    },
    branchId: {
      type: Number,
      default: null,
    },
    selectedItems: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["eventDetails"],

  data() {
    return {
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "last_name", name: "ФИО", class: "" },
        { id: "phone", name: "Телефон", class: "" },
        { id: "email", name: "Email", class: "" },
        { id: "address_fact", name: "Адрес", class: "" },
        { id: "options", name: "Авто", class: "" },
        { id: "notes", name: "Примечание", class: "" },
      ],
      items: [],
      isLoading: false,
      filter: {},
    };
  },

  watch: {
    searchString() {
      this.refetch(this.filter);
    },
    branchId() {
      this.refetch(this.filter);
    },
  },

  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      this.refetch(item);
    },
    handleSelection(item) {
      this.$emit("eventDetails", item);
    },
    async refetch(tableFilters) {
      this.isLoading = true;
      try {
        let result = await apiService.getCustomers(tableFilters, this.branchId, this.searchString);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
