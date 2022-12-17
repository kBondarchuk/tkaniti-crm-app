<template>
  <!-- Grid -->
  <!-- First column -->
  <TKGoodDetails :good="good" />
  <!--  -->
</template>

<script>
import TKGoodDetails from "@/components/TKGoodDetails.vue";

export default {
  name: "TKGoodsDetailsTabGeneral",

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
