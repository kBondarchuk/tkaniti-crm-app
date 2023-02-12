<template>
  <!-- Grid -->
  <!-- <LayoutTwoColumns> -->
  <!-- First column -->
  <TKCustomerOrders v-if="customer?.id" :customer-id="customer?.id" />
  <!-- </LayoutTwoColumns> -->
  <!--  -->
</template>

<script>
import TKCustomerOrders from "@/components/TKCustomerOrders.vue";

export default {
  name: "TKCustomersDetailsTabOrders",

  components: {
    TKCustomerOrders,
  },

  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
};
</script>
