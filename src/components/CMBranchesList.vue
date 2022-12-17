<template>
  <UITableList
    id="branches"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    @header:sort="handleHeaderSort"
  >
    <CMBranchesListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @event-details="$emit('eventDetails', item)"
      @event-edit="$emit('eventEdit', item.id)"
      @event-delete="$emit('eventDelete', item.id)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import UITableList from "@/components/UITableList.vue";
import CMBranchesListItem from "@/components/CMBranchesListItem.vue";

export default {
  name: "CMBranchesList",

  components: {
    UITableList,
    CMBranchesListItem,
  },

  props: {
    headerStickedAt: {
      type: Number,
      default: null,
    },
  },
  emits: ["eventDetails", "eventEdit", "eventDelete"],

  data() {
    return {
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "name", name: "Название", class: "" },
        { id: "kassa_balance", name: "Касса", class: "right aligned" },
        { id: "description", name: "Примечание", class: "" },
      ],
      items: [],
      isLoading: false,
      filter: {},
    };
  },

  mounted() {
    // this.$store.dispatch("investors/fetchAll");
  },

  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      this.refetch(item);
    },
    // Network
    async refetch(tableFilters) {
      this.isLoading = true;
      try {
        let result = await apiService.getBranchesExt(tableFilters);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
