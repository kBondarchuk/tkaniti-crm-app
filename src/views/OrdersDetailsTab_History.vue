<template>
  <!-- Grid -->
  <LayoutTwoColumns>
    <!-- First column -->
    <TKOrderHistoryList v-if="order.id" :order-id="order.id" />
  </LayoutTwoColumns>
  <!--  -->
</template>

<script>
import TKOrderHistoryList from "@/components/TKOrderHistoryList.vue";

export default {
  name: "TKOrderDetailsTabHistory",

  components: {
    TKOrderHistoryList,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
  },
};
</script>
