<template>
  <!-- Goods (Basket) -->
  <table class="ui very compact small unstackable table" :class="{ loading: isLoading }">
    <!--  -->
    <thead>
      <tr>
        <th>Наименование</th>
        <th class="">Количество</th>
        <th class="">Цена</th>
        <th class="right aligned">Стоимость</th>
      </tr>
    </thead>
    <!--  -->
    <tbody>
      <!--  -->
      <tr v-for="(item, index) in basket" :key="item.id">
        <td>{{ item.good_name }}</td>
        <td><UIInputMoney v-model="basket[index].good_quantity" /></td>
        <td><UIInputMoney v-model="basket[index].good_price" /></td>
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

  <!-- Buttons -->
  <UIButton text="Сохранить" @click.prevent="save" />
  <UIButton text="Отменить" @click.prevent="undo" />

  <!-- e-o-t -->
</template>

<script>
import { toRaw } from "vue";

export default {
  name: "TKOrderBasketEdit",

  components: {},

  props: {
    order: {
      type: Object,
      default: null,
    },
  },

  emits: ["basket"],

  data() {
    return {
      // Model
      basket: [],
      // UI
      isLoading: false,
    };
  },

  watch: {
    order() {
      console.warn("Order changed!");

      this.copyBasket();
    },
  },

  methods: {
    copyBasket() {
      this.basket = structuredClone(toRaw(this.order.basket));
    },

    save() {
      //
      this.$emit("basket", this.basket);
      console.warn(this.basket);
    },
    undo() {
      this.copyBasket();
    },
  },

  // EOF
};
</script>
