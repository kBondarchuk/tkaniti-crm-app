<template>
  <!-- Grid -->
  <!-- First column -->
  <TKGoodDetails :good="good" :is-loading="good == null" />
  <!--  -->
</template>

<script>
import TKGoodDetails from "@/components/TKGoodDetails.vue";

export default {
  name: "GoodsDetailsTabGeneral",

  components: {
    TKGoodDetails,
  },

  props: {
    good: {
      type: Object,
      default: null,
    },
  },
};
</script>
