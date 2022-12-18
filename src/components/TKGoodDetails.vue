<template>
  <LayoutTwoColumns>
    <!-- First column -->
    <UIStaticTable>
      <!-- <UITableDividerRow /> -->
      <!--  -->
      <UITableRow name="Наименование" :value="good.name" />
      <UITableRow name="Бренд" :value="good.brand" />
      <UITableRow name="Артикул" :value="good.code" />
      <UITableRow name="Описание" :value="good.description" />
      <UITableRow name="Ширина" :value="good.width" />
      <UITableRow name="Состав" :value="good.sostav" />
      <!--  -->
      <UITableDividerRow />
      <UITableRow name="UUID" :value="good.uuid" />

      <!--  -->
      <UITableDividerRow />
      <UITableRow name="Комментарий" :value="good.notes" />
      <!--  -->
    </UIStaticTable>

    <!--  -->
    <template #second>
      <UIStaticTable two-columns>
        <!--  -->
        <!-- <UITableDividerRow /> -->
        <UITableRow name="Цена" :value="good.price" type="money2" align="right" />
        <UITableDividerRow />
        <UITableRow name="Исходное количество" :value="good.quantity" align="right" />
        <UITableRow name="Продано" :value="good.stats?.sold" align="right" />
        <UITableRow name="Текущий остаток" :value="good.stats?.remains" align="right" />
      </UIStaticTable>
    </template>
  </LayoutTwoColumns>
  <!-- EOT -->
</template>

<script>
/*
let _form_data = [
  { name: "Бренд", value: good.brand },
  { name: "Наименование", value: good.name },
  { name: "Артикул", value: good.code },
  { name: "Описание", value: good.description },
  { name: "Ширина", value: good.width },
  { name: "Состав", value: good.sostav },
];
*/

export default {
  name: "TKGoodDetails",

  components: {},

  props: {
    good: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      // car: {},
      isLoading: false,
    };
  },
};
</script>
