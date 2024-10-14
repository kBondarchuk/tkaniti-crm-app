<template>
  <!-- Orders -->
  <UITableList
    id="$options.name"
    :headers="headers"
    :items-count="orders.length"
    :is-loading="isLoading"
    bordered
    @header:sort="handleHeaderSort"
  >
    <!-- Items -->
    <TKOrdersListItem v-for="item in orders" :key="item.id" :item="item" @event-details="gotoOrderDetails(item.id)" />
    <!--  -->
  </UITableList>

  <!-- EOT -->
</template>

<script>
import { useNavigation } from "@/composables/navigation";
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

  setup() {
    const { navigateTo } = useNavigation();

    /// FUNCTIONS

    function gotoOrderDetails(orderId) {
      navigateTo.Orders.Details({ orderId: orderId });
    }

    return { gotoOrderDetails };
  },

  data() {
    return {
      //Model
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "status_id", name: "Статус", class: "" },
        { id: "payment_status_id", name: "Оплата", class: "" },
        { id: "payment_method_id", name: "МО", class: "" },
        { id: "date", name: "Дата заказа", class: "" },
        { id: "skip_check", name: "БП", class: "" },
        { id: "delivery_date", name: "Отправка", class: "" },
        { id: "goods_count", name: "Товаров", class: "right aligned" },
        { id: "total_quantity", name: "Кол-во", class: "right aligned" },
        { id: "total_price", name: "Стоимость", class: "right aligned" },
        { id: "real_customer_fio", name: "Клиент", class: "" },
        { id: "customer_fio", name: "ФИО", class: "" },
        { id: "customer_phone", name: "Номер телефона", class: "" },
        { id: "parcel_number", name: "Посылка", class: "" },
        { id: "notes", name: "Комментарий", class: "" },
        // { id: "gibdd_valid_number", name: "М", class: "" },
      ],
      orders: [],
      // UI
      isLoading: false,
      filter: {},
    };
  },

  mounted() {
    this.refetch();
  },

  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      this.refetch(item);
    },
    // Networking
    async refetch(filter) {
      this.isLoading = true;
      try {
        this.orders = await apiService.getOrdersForCustomer({ customer_id: this.customerId, filter: filter });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
