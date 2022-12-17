<template>
  <UITableList
    id="TKGoodsList"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    @header:sort="handleHeaderSort"
  >
    <!-- Items -->
    <TKGoodsListItem
      v-for="item in items"
      :key="item.id + '-goods-'"
      :item="item"
      @event-details="$emit('eventDetails', item)"
      @event-edit="$emit('eventEdit', item.id)"
      @event-delete="$emit('eventDelete', item.id)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import { arrayEquals } from "@/utils/utils.js";

import UITableList from "@/components/UITableList.vue";
import TKGoodsListItem from "@/components/TKGoodsListItem.vue";

export default {
  name: "TKGoodsList",
  components: {
    UITableList,
    TKGoodsListItem,
  },
  props: {
    filterStatus: {
      type: Array,
      default: null,
    },
    headerStickedAt: {
      type: Number,
      default: null,
    },
    searchString: {
      type: String,
      default: null,
    },
  },

  emits: ["eventDetails", "eventEdit", "eventDelete"],

  data() {
    return {
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "status_id", name: "Статус", class: "" },
        { id: "name", name: "Название", class: "" },
        { id: "brand", name: "Бренд", class: "" },
        { id: "code", name: "Артикул", class: "" },
        { id: "price", name: "Цена", class: "right aligned" },
        { id: "quantity", name: "Остаток", class: "right aligned" },
        { id: "description", name: "Описание", class: "" },
        { id: "notes", name: "Комментарий", class: "" },
        // { id: "gibdd_valid_number", name: "М", class: "" },
      ],
      items: [],
      isLoading: false,
      filter: {},
    };
  },
  watch: {
    filterStatus(newValue, oldValue) {
      // console.log(newValue, oldValue, arrayEquals(newValue, oldValue));
      if (!arrayEquals(newValue, oldValue)) {
        this.refetch(this.filter);
      }
    },
    searchString() {
      this.refetch(this.filter);
    },
  },
  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      this.refetch(item);
    },
    handleDelete() {
      // expense_id
      // console.log("delete clicked: " + expense_id);
    },
    async refetch(tableFilters) {
      this.isLoading = true;
      try {
        let result = await apiService.getGoods(tableFilters, this.filterStatus, this.searchString);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
