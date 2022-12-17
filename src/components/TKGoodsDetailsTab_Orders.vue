<template>
  <!-- Grid -->
  <!-- <LayoutTwoColumns> -->
  <!-- First column -->
  <TKGoodOrders v-if="good.id" :good-id="good.id" />
  <!-- </LayoutTwoColumns> -->
  <!--  -->
</template>

<script>
import TKGoodOrders from "@/components/TKGoodOrders.vue";

export default {
  name: "TKGoodsDetailsTabOrders",

  components: {
    TKGoodOrders,
  },

  props: {
    good: {
      type: Object,
      default: null,
    },
  },
};
</script>
