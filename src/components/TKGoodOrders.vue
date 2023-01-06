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
    <!--  -->
    <tr v-for="item in orders" :key="item.id" @click="go('order_details', item.order_id)">
      <td>{{ item.order_id }}</td>
      <td><TKOrderStatus :value="item.order_status_id" /></td>
      <td>{{ $filters.date(item.order_date) }}</td>
      <td>{{ item.customer_fio }}</td>
      <td class="right aligned">{{ $filters.money(item.good_quantity) }}</td>
      <td class="right aligned">{{ $filters.money(item.good_price) }}</td>
      <td class="right aligned">{{ $filters.money(item.good_total_price) }}</td>
    </tr>
    <!--  -->
  </UITableList>

  <!-- EOT -->
</template>

<script>
import apiService from "@/services/api.service.js";
import TKOrderStatus from "@/components/TKOrderStatus.vue";

export default {
  name: "TKGoodOrders",

  components: {
    TKOrderStatus,
  },

  props: {
    goodId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      //Model
      headers: [
        { id: "order_id", name: "ID", class: "" },
        { id: "order_status_id", name: "Статус", class: "" },
        { id: "order_date", name: "Дата", class: "" },
        { id: "customer_fio", name: "Покупатель", class: "" },
        { id: "good_price", name: "Количество", class: "right aligned" },
        { id: "good_quantity", name: "Цена", class: "right aligned" },
        { id: "good_total_price", name: "Стоимость", class: "right aligned" },
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
        this.orders = await apiService.getOrdersForGood({ good_id: this.goodId });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
