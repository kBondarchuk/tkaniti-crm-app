<template>
  <!-- Orders -->
  <table class="ui very compact small table" :class="{ loading: isLoading }">
    <!--  -->
    <thead>
      <tr>
        <th>ID</th>
        <th>Статус</th>
        <th>Дата</th>
        <th>Покупатель</th>
        <th class="right aligned">Количество</th>
        <th class="right aligned">Цена</th>
        <th class="right aligned">Стоимость</th>
      </tr>
    </thead>
    <!--  -->
    <tbody>
      <!--  -->
      <tr v-for="item in orders" :key="item.id">
        <td><TKLinkGood :id="item.order_id" path-name="order_details" />{{ item.order_id }}</td>
        <td><TKOrderStatus :value="item.order_status_id" /></td>
        <td>{{ $filters.date(item.order_date) }}</td>
        <td>{{ item.customer_fio }}</td>
        <td class="right aligned">{{ $filters.money(item.good_quantity) }}</td>
        <td class="right aligned">{{ $filters.money(item.good_price) }}</td>
        <td class="right aligned">{{ $filters.money(item.good_total_price) }}</td>
      </tr>
      <!--  -->
      <!-- <tr>
        <td></td>
        <td></td>
        <td class="right aligned"></td>
        <td class="right aligned text-bold">{{ $filters.money(item.total_price) }}</td>
      </tr> -->
      <!--  -->
    </tbody>
  </table>

  <!-- EOT -->
</template>

<script>
import apiService from "@/services/api.service.js";
import TKOrderStatus from "@/components/TKOrderStatus.vue";
import TKLinkGood from "@/components/TKLink.vue";

export default {
  name: "TKGoodOrders",

  components: {
    TKOrderStatus,
    TKLinkGood,
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
      orders: null,
      // UI
      isLoading: false,
    };
  },

  mounted() {
    this.refetch();
  },

  methods: {
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
