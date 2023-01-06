<template>
  <!-- Orders -->
  <UITableList
    id="$options.name"
    :headers="headers"
    :items-count="orders.length"
    :is-loading="isLoading"
    no-sort
    bordered
  >
    <!-- Items -->
    <TKOrdersListItem
      v-for="item in orders"
      :key="item.id"
      :item="item"
      @event-details="go('order_details', item.id)"
    />
    <!--  -->
  </UITableList>

  <!-- EOT -->
</template>

<script>
import apiService from "@/services/api.service.js";
import TKOrdersListItem from "@/components/TKOrdersListItem.vue";

export default {
  name: "TKCustomerOrders",

  components: {
    TKOrdersListItem,
  },

  props: {
    customerId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      //Model
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "status_id", name: "Статус", class: "" },
        { id: "payment_status_id", name: "Оплата", class: "" },
        { id: "date", name: "Дата заказа", class: "" },
        { id: "goods_count", name: "Товаров", class: "" },
        { id: "total_quantity", name: "Кол-во", class: "" },
        { id: "total_price", name: "Стоимость", class: "right aligned" },
        { id: "customer_fio", name: "ФИО", class: "" },
        { id: "customer_phone", name: "Номер телефона", class: "" },
        { id: "notes", name: "Комментарий", class: "" },
        // { id: "gibdd_valid_number", name: "М", class: "" },
      ],
      orders: [],
      // UI
      isLoading: false,
    };
  },

  mounted() {
    this.refetch();
  },

  methods: {
    go(pathName, id) {
      this.$router.push({
        name: pathName,
        params: { id: id },
      });
    },
    // Networking
    async refetch() {
      this.isLoading = true;
      try {
        this.orders = await apiService.getOrdersForCustomer({ customer_id: this.customerId });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
