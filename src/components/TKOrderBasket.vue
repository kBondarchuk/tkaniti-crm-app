<template>
  <!-- Goods (Basket) -->
  <table class="ui very compact small unstackable table" :class="{ loading: isLoading }">
    <!--  -->
    <thead>
      <tr>
        <th class="center aligned" colspan="5">КОРЗИНА ТОВАРОВ</th>
      </tr>
      <tr>
        <th>Наименование товара</th>
        <th class="right aligned">Остатки</th>
        <th class="right aligned">Количество</th>
        <th class="right aligned">Цена</th>
        <th class="right aligned">Стоимость</th>
      </tr>
    </thead>
    <!--  -->
    <tbody>
      <!--  -->
      <tr v-for="item in order.basket" :key="item.id">
        <td><TKLink :id="item.good_id" path-name="goods_details" />{{ item.good_name }} ({{ item.good_id }})</td>
        <td class="right aligned">{{ item.remains }}</td>
        <td class="right aligned">{{ item.good_quantity }}</td>
        <UIMoneyCell :value="item.good_price" />
        <UIMoneyCell :value="item.good_total_price" />
      </tr>
      <!--  -->
    </tbody>
    <!--  -->
    <tfoot>
      <tr>
        <th></th>
        <th></th>
        <th class="right aligned text-bold">{{ $filters.money(order.total_quantity) }}</th>
        <th></th>
        <th class="right aligned text-bold">{{ $filters.money(order.total_price) }}</th>
      </tr>
    </tfoot>
  </table>

  <!-- EOT -->
</template>

<script>
import TKLink from "@/components/TKLink.vue";

export default {
  name: "TKOrderBasket",

  components: {
    TKLink,
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
