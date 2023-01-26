<template>
  <!-- Grid -->
  <LayoutTwoColumns>
    <!-- First column -->
    <TKOrderDetails :order="order" />
    <!-- Second column -->
    <template #second>
      <TKOrderBasket :order="order" />
    </template>
  </LayoutTwoColumns>
  <!--  -->
</template>

<script>
import TKOrderDetails from "@/components/TKOrderDetails.vue";
import TKOrderBasket from "@/components/TKOrderBasket.vue";
// import UILayoutColumns from "@/components/UILayoutColumns.vue";

export default {
  name: "TKOrderDetailsTabGeneral",

  components: {
    TKOrderDetails,
    TKOrderBasket,
    // UILayoutColumns,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
  },
};
</script>
