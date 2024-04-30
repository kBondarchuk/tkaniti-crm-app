<template>
  <LayoutTwoColumns>
    <!-- First column -->
    <TKCustomerDetails :customer="customer" :is-loading="customer == null" />
    <!-- second column -->
  </LayoutTwoColumns>
  <!--  -->
</template>

<script setup>
import TKCustomerDetails from "@/components/TKCustomerDetails.vue";

// name: "TKCustomersDetailsTabGeneral",

/// PROPS

const props = defineProps({
  customer: {
    type: Object,
    default: null,
  },
});
</script>
