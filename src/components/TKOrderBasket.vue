<template>
  <!-- Goods (Basket) -->
  <table class="ui very compact small unstackable table" :class="{ loading: isLoading }">
    <!--  -->
    <thead>
      <tr>
        <th class="center aligned" :colspan="columnsCount">КОРЗИНА ТОВАРОВ</th>
      </tr>
      <tr v-if="order?.basket.length != 0">
        <th>Товар</th>
        <th></th>
        <th class="right aligned">Остатки</th>
        <th class="right aligned" colspan="2">Количество</th>
        <!-- <th class="right aligned"></th> -->
        <th class="right aligned">Цена</th>
        <th class="right aligned">Стоимость</th>
      </tr>
    </thead>
    <!--  -->
    <tbody>
      <!-- Empty Basket -->
      <tr v-if="order?.basket.length == 0">
        <td
          :colspan="columnsCount"
          class="center aligned text-color-grey"
          style="padding: 2rem; text-transform: uppercase"
        >
          Нет товара в корзине
        </td>
      </tr>
      <!--  -->
      <tr v-for="item in order?.basket" :key="item.id">
        <td><TKLink :id="item.good_id" path-name="goods_details" />{{ item.good_name }} ({{ item.good_id }})</td>
        <td><TKGoodStatus :value="item.good_status_id" /></td>
        <td class="right aligned">{{ item.remains }}</td>
        <td class="right aligned">{{ item.good_quantity }}</td>
        <td style="padding-left: 0">{{ item.good_measure }}</td>
        <UIMoneyCell :value="item.good_price" />
        <UIMoneyCell :value="item.good_total_price" />
      </tr>
      <!--  -->
    </tbody>
    <!--  -->
    <tfoot v-if="order?.basket.length != 0">
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th class="right aligned text-bold">{{ $filters.money(order?.total_quantity) }}</th>
        <th style="padding-left: 0"></th>
        <th></th>
        <th class="right aligned text-bold">{{ $filters.money(order?.total_price) }}</th>
      </tr>
    </tfoot>
  </table>

  <!-- EOT -->
</template>

<script>
import TKLink from "@/components/TKLink.vue";
import TKGoodStatus from "@/components/TKGoodStatus.vue";

export default {
  name: "TKOrderBasket",

  components: {
    TKLink,
    TKGoodStatus,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      columnsCount: 7,
    };
  },
};
</script>
