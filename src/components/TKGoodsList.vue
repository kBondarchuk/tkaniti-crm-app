<template>
  <UITableList
    id="TKGoodsList"
    :headers="headers[viewMode]"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    @header:sort="handleHeaderSort"
  >
    <!-- Items -->
    <component
      :is="itemComponent"
      v-for="item in items"
      :key="item.id + '-goods-'"
      :item="item"
      :base-url="apiBaseUrl"
      :token="token"
      @event-details="$emit('eventDetails', item)"
      @event-edit="$emit('eventEdit', item.id)"
      @event-delete="$emit('eventDelete', item.id)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import { arrayEquals } from "@/utils/utils.js";

import TKGoodsListItem from "@/components/TKGoodsListItem.vue";
import TKGoodsListImageItem from "@/components/TKGoodsListImageItem.vue";

export default {
  name: "TKGoodsList",
  components: {
    TKGoodsListItem,
    TKGoodsListImageItem,
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
    viewMode: {
      type: Number,
      default: 0, // 0 - text, 1 - image, 2 - grid
    },
  },

  emits: ["eventDetails", "eventEdit", "eventDelete"],

  data() {
    return {
      headers: [
        [
          { id: "id", name: "No.", class: "" },
          { id: "status_id", name: "Статус", class: "" },
          { id: "name", name: "Название", class: "" },
          { id: "brand", name: "Бренд", class: "" },
          { id: "category_name", name: "Категория", class: "" },
          { id: "code", name: "Артикул", class: "" },
          { id: "price", name: "Цена", class: "right aligned" },
          { id: "remains", name: "Остаток", class: "right aligned" },
          { id: "measure_name", name: "Ед.изм.", class: "" },
          // { id: "description", name: "Описание", class: "" },
          { id: "notes", name: "Комментарий", class: "" },
          // { id: "gibdd_valid_number", name: "М", class: "" },
        ],
        [
          { id: "id", name: "No.", class: "" },
          { id: "name", name: "Название", class: "" },
          { id: "brand", name: "Бренд", class: "" },
          { id: "status_id", name: "Статус", class: "" },
          { id: "code", name: "Артикул", class: "" },
          { id: "price", name: "Цена", class: "right aligned" },
          { id: "remains", name: "Остаток", class: "right aligned" },
          // { id: "description", name: "Описание", class: "" },
          { id: "notes", name: "Комментарий", class: "" },
          // { id: "gibdd_valid_number", name: "М", class: "" },
        ],
      ],
      itemComponents: ["TKGoodsListItem", "TKGoodsListImageItem"],
      items: [],
      isLoading: false,
      filter: {},
      apiBaseUrl: import.meta.env.VUE_APP_API_BASE,
      token: null,
    };
  },

  computed: {
    itemComponent() {
      return this.itemComponents[this.viewMode || 0];
    },
  },

  watch: {
    filterStatus(newValue, oldValue) {
      // console.log(newValue, oldValue, arrayEquals(newValue, oldValue));
      if (!arrayEquals(newValue, oldValue)) {
        this.getTokenAndRefetch();
      }
    },
    searchString() {
      this.getTokenAndRefetch();
    },
  },

  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      this.getTokenAndRefetch();
    },
    handleDelete() {
      // expense_id
      // console.log("delete clicked: " + expense_id);
    },
    async getTokenAndRefetch() {
      // await this.fetchToken();
      await this.refetch(this.filter);
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
    async fetchToken() {
      console.log("fetchToken");

      this.isLoading = true;
      try {
        this.token = await apiService.getDownloadToken();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
