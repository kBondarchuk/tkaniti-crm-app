<template>
  <!-- Grid -->
  <!-- Grid -->
  <LayoutTwoColumns>
    <!-- First column -->
    <TKCustomerDetails :customer="customer" :is-loading="customer == null" />
    <!-- second column -->
  </LayoutTwoColumns>
  <!--  -->
</template>

<script>
import TKCustomerDetails from "@/components/TKCustomerDetails.vue";

export default {
  name: "TKCustomersDetailsTabGeneral",

  components: {
    TKCustomerDetails,
  },

  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
};
</script>
