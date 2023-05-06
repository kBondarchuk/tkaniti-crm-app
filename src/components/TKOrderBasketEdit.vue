<template>
  <!-- Goods (Basket) -->
  <table class="ui very compact small unstackable table" :class="{ loading: isLoading }">
    <!--  -->
    <thead>
      <tr>
        <th class="center aligned" colspan="6">КОРЗИНА ТОВАРОВ</th>
      </tr>
      <tr v-if="order?.basket.length != 0">
        <th></th>
        <th>Наименование товара</th>
        <th class="right aligned">Остатки</th>
        <th class="">Цена</th>
        <th class="">Количество</th>
        <th class="right aligned">Стоимость</th>
      </tr>
    </thead>
    <!--  -->
    <tbody>
      <!-- Empty Basket -->
      <tr v-if="basket.length == 0">
        <td
          :colspan="columnsCount"
          class="center aligned text-color-grey"
          style="padding: 2rem; text-transform: uppercase"
        >
          <span>Нет товара в корзине</span>
        </td>
      </tr>
      <!--  -->
      <tr v-for="(item, index) in basket" :key="item.id">
        <td><i class="trash alternate red icon" title="Удалить товар" @click.stop="deleteItem(item)"></i></td>
        <td :class="{ deleted: item.delete == 1 }">{{ item.good_name }} ({{ item.good_id }})</td>
        <!-- Remains -->
        <td class="right aligned">{{ basket[index].remains }}</td>
        <!-- Price -->
        <td>
          <UIInputMoney v-model="basket[index].good_price" />
        </td>
        <!-- Quantity -->
        <td>
          <UIInputMoney v-model="basket[index].good_quantity" :decimal-scale="basket[index].good_system_fraction" />
        </td>
        <!-- Price -->
        <td class="right aligned">{{ $filters.money(item.good_total_price) }}</td>
      </tr>
      <!--  -->
    </tbody>
    <!--  -->
    <tfoot>
      <tr>
        <th colspan="5">
          <!-- Buttons -->
          <!-- <UIButton text="Сохранить" @click.prevent="save" />
          <UIButton text="Отменить" @click.prevent="undo" /> -->
          <UIButton text="Добавить товар" icon="cart plus" type="labeled" @click.prevent="add" />
        </th>
        <th class="right aligned text-bold">{{ $filters.money(order.total_price) }}</th>
      </tr>
    </tfoot>
  </table>

  <!-- Good Select Browser -->
  <BrowseGoods
    :active="modals.browseGoods"
    :filter-status="[2]"
    @hide="modals.browseGoods = false"
    @selected="goodSelected"
  />
  <!-- e-o-t -->
</template>

<script>
import { toRaw } from "vue";
import { arrayEquals } from "@/utils/utils.js";

import BrowseGoods from "@/components/BrowseGoods.vue";

export default {
  name: "TKOrderBasketEdit",

  components: {
    BrowseGoods,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
    modelValue: {
      type: Array,
      default: null,
    },
  },

  emits: ["update:modelValue", "basket"],

  data() {
    return {
      // Model
      basket: [],
      // UI
      isLoading: false,
      columnsCount: 7,
      modals: {
        browseGoods: false,
      },
    };
  },

  watch: {
    modelValue: {
      handler(newVal, oldVal) {
        console.warn("Order changed!");
        // console.warn(toRaw(newVal), toRaw(this.basket));
        // console.warn("arrayEquals: ", arrayEquals(toRaw(newVal), toRaw(this.basket)));
        if (!arrayEquals(toRaw(newVal), toRaw(this.basket))) {
          this.copyBasket();
        }
      },
      immediate: true,
    },
    basket: {
      handler(val, oldVal) {
        console.warn("watch basket!");
        this.$emit("update:modelValue", this.basket);
      },
      deep: true,
    },
  },

  methods: {
    copyBasket() {
      this.basket = structuredClone(toRaw(this.modelValue));
    },
    deleteItem(item) {
      console.warn("[delete]: ", item.id);
      if (item.delete) {
        item.delete = 0;
      } else {
        item.delete = 1;
      }
    },

    add() {
      this.modals.browseGoods = !this.modals.browseGoods;
    },
    save() {
      //
      this.$emit("basket", this.basket);
      console.warn(this.basket);
    },
    undo() {
      this.copyBasket();
    },
    goodSelected(good) {
      console.warn(good);

      const newGood = {
        // good_uuid: good.uuid,
        good_id: good.id,
        good_name: good.name,
        good_quantity: good.remains,
        good_price: good.price,
      };
      this.basket.push(newGood);

      this.modals.browseGoods = false;
    },
  },

  // EOF
};
</script>

<style scoped>
.deleted {
  text-decoration: line-through;
}

.icon:hover {
  cursor: pointer;
}
</style>
