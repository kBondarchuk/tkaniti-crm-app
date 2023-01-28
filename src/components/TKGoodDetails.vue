<template>
  <!-- <LayoutTwoColumns> -->
  <!-- First column -->
  <!-- <UIStaticTable> -->
  <!--  -->
  <!-- <UITableRow name="Наименование" :value="good?.name" />
      <UITableRow name="Бренд" :value="good?.brand" />
      <UITableRow name="Артикул" :value="good?.code" />
      <UITableRow name="Описание" :value="good?.description" /> -->
  <!--  -->
  <!-- <UITableDividerRow />
      <UITableRow name="Ширина" :value="good?.width" />
      <UITableRow name="Состав" :value="good?.sostav" /> -->
  <!--  -->
  <!-- <UITableDividerRow />
      <UITableRow name="UUID" :value="good?.uuid" /> -->

  <!--  -->
  <!-- <UITableDividerRow />
      <UITableRow name="Комментарий" :value="good?.notes" /> -->
  <!--  -->
  <!-- </UIStaticTable> -->
  <LayoutTwoColumns>
    <!-- Test List -->
    <UIList class="grouped" :is-loading="isLoading">
      <!--  -->
      <UIListSection header="Описание товара">
        <UIListItem name="Наименование" :value="good?.name" />
        <UIListItem name="Бренд" :value="good?.brand"></UIListItem>
        <UIListItem name="Артикул" :value="good?.code" />
        <!-- <UIListItem name="Описание" :value="good?.description" /> -->
        <UIListItem name="Описание" :value="good?.description" />
      </UIListSection>
      <!--  -->
      <UIListSection header="Характеристики">
        <UIListItem name="Ширина" :value="good?.width" />
        <UIListItem name="Состав" :value="good?.sostav" />
      </UIListSection>
      <!--  -->
      <UIListSection>
        <UIListItem name="UUID" :value="good?.uuid" />
        <UIListItem name="Адрес формы заказа" :value="'https://store.tkaniti.ru/order/g/' + good?.uuid" />
      </UIListSection>
      <!--  -->
      <UIListSection header="Комментарий">
        <UIListItem :value="good?.notes" stacked />
      </UIListSection>
      <!--  -->
    </UIList>

    <!--  -->
    <template #second>
      <!-- <UIStaticTable two-columns>
        <UITableRow name="Цена" :value="good?.price" type="money2" align="right" />
        <UITableDividerRow />
        <UITableRow name="Исходное количество" :value="good?.quantity" align="right" />
        <UITableRow name="Продано" :value="good?.stats?.sold" align="right" />
        <UITableRow name="Текущий остаток" :value="good?.stats?.remains" align="right" />
      </UIStaticTable> -->

      <UIList class="grouped right-aligned" :is-loading="isLoading">
        <UIListSection header="Цены">
          <UIListItem name="Цена" :value="good?.price" type="money2" />
        </UIListSection>

        <UIListSection header="Остатки">
          <UIListItem name="Исходное количество" :value="good?.quantity" />
          <UIListItem name="Продано" :value="good?.stats?.sold" />
          <UIListItem name="Текущий остаток" :value="good?.stats?.remains" />
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

export default {
  name: "TKGoodDetails",

  components: {
    // UILayoutColumns,
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
