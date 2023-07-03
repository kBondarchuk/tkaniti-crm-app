<template>
  <LayoutTwoColumns>
    <!-- Test List -->
    <UIList class="grouped" :is-loading="isLoading">
      <!--  -->
      <UIListSection header="Описание товара">
        <UIListItem name="Наименование" :value="good?.name" />
        <UIListItem name="Бренд" :value="good?.brand"></UIListItem>
        <UIListItem name="Категория" :value="good?.category_name" />
        <UIListItem name="Артикул" :value="good?.code" />
        <UIListItem name="Описание" :value="good?.description" />
      </UIListSection>
      <!--  -->
      <!-- <UIListSection header="Характеристики">
        <UIListItem name="Ширина" :value="good?.width" />
        <UIListItem name="Состав" :value="good?.sostav" />
      </UIListSection> -->
      <!--  -->
      <UIListSection v-if="good && good?.specs && Object.keys(good?.specs).length > 0" header="Характеристики (new)">
        <UIListItem
          v-for="key in Object.keys(good?.specs)"
          :key="key"
          :name="good?.specs_meta?.[key] ?? key"
          :value="good?.specs[key]"
        />
      </UIListSection>

      <!--  -->
      <UIListSection>
        <UIListItem name="UUID" :value="good?.uuid" />
        <UIListItem name="Адрес формы заказа" :value="'https://store.tkaniti.ru/order/g/' + good?.uuid">
          <UIClipButton :value="'https://store.tkaniti.ru/order/g/' + good?.uuid" />
        </UIListItem>
      </UIListSection>
      <!--  -->
      <UIListSection header="Комментарий">
        <UIListItem :value="good?.notes" stacked />
      </UIListSection>
      <!--  -->
    </UIList>

    <!--  -->
    <template #second>
      <UIList class="grouped right-aligned" :is-loading="isLoading">
        <UIListSection header="Цены">
          <UIListItem name="Цена" :value="good?.price" type="money2" />
        </UIListSection>

        <UIListSection header="Остатки">
          <UIListItem name="Исходное количество" :value="good?.quantity" />
          <UIListItem name="Продано" :value="good?.stats?.sold" />
          <UIListItem name="Текущий остаток" :value="good?.stats?.remains" />
          <UIListItem name="Входящий остаток" :value="good?.stats?.remains_predicted" />
          <UIListItem name="Единицы измерения" :value="good?.measure_name" />
        </UIListSection>
      </UIList>
    </template>
  </LayoutTwoColumns>
  <!-- </LayoutTwoColumns> -->
  <!-- EOT -->
</template>

<script>
/*
let _form_data = [
  { name: "Бренд", value: good?.brand },
  { name: "Наименование", value: good?.name },
  { name: "Артикул", value: good?.code },
  { name: "Описание", value: good?.description },
  { name: "Ширина", value: good?.width },
  { name: "Состав", value: good?.sostav },
];
*/

// import UILayoutColumns from "@/components/UILayoutColumns.vue";
import UIClipButton from "@/components/UIClipButton.vue";

export default {
  name: "TKGoodDetails",

  components: {
    // UILayoutColumns,
    UIClipButton,
  },

  props: {
    good: {
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
      // car: {},
    };
  },
};
</script>
