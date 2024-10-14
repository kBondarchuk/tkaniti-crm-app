<template>
  <TKGoodOrders v-if="good?.id" :good-id="good?.id" />
</template>

<script setup>
import TKGoodOrders from "@/components/TKGoodOrders.vue";

// name: "TKGoodsDetailsTabOrders",

const props = defineProps({
  good: {
    type: Object,
    default: null,
  },
});
</script>
