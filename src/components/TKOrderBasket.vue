<template>
  <!-- Goods (Basket) -->
  <table class="ui very compact small unstackable table" :class="{ loading: isLoading }">
    <!--  -->
    <thead>
      <tr>
        <th>Наименование</th>
        <th class="">Количество</th>
        <th class="right aligned">Цена</th>
        <th class="right aligned">Стоимость</th>
      </tr>
    </thead>
    <!--  -->
    <tbody>
      <!--  -->
      <tr v-for="item in order.basket" :key="item.id">
        <td><TKLinkGood :id="item.good_id" path-name="goods_details" />{{ item.good_name }}</td>
        <td>{{ item.good_quantity }}</td>
        <td class="right aligned">{{ $filters.money(item.good_price) }}</td>
        <td class="right aligned">{{ $filters.money(item.good_total_price) }}</td>
      </tr>
      <!--  -->
    </tbody>
    <!--  -->
    <tfoot>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th class="right aligned text-bold">{{ $filters.money(order.total_price) }}</th>
      </tr>
    </tfoot>
  </table>

  <!-- EOT -->
</template>

<script>
import TKLinkGood from "@/components/TKLink.vue";

export default {
  name: "TKOrderBasket",

  components: {
    TKLinkGood,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      // UI
      isLoading: false,
    };
  },
};
</script>
