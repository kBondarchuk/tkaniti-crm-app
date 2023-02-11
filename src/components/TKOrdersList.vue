<template>
  <UITableList
    id="$options.name"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    @header:sort="handleHeaderSort"
  >
    <!-- Items -->
    <TKOrdersListItem
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
import { arrayEquals } from "@/utils/utils.js";

import TKOrdersListItem from "@/components/TKOrdersListItem.vue";

export default {
  name: "TKOrdersList",

  components: {
    TKOrdersListItem,
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
    seq: {
      type: Number,
      default: 0,
    },
  },

  emits: ["eventDetails", "eventEdit", "eventDelete"],

  data() {
    return {
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "status_id", name: "Статус", class: "" },
        { id: "payment_status_id", name: "Оплата", class: "" },
        { id: "date", name: "Дата заказа", class: "" },
        { id: "delivery_date", name: "Отправка", class: "" },
        { id: "goods_count", name: "Товаров", class: "" },
        { id: "total_quantity", name: "Кол-во", class: "" },
        { id: "total_price", name: "Стоимость", class: "right aligned" },
        { id: "real_customer_fio", name: "Клиент", class: "" },
        { id: "customer_fio", name: "ФИО", class: "" },
        { id: "customer_phone", name: "Номер телефона", class: "" },
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
    // Just reload
    seq() {
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
        let result = await apiService.getOrders(tableFilters, this.filterStatus, this.searchString);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
