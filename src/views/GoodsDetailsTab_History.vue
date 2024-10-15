<template>
  <!-- Grid -->
  <LayoutTwoColumns>
    <!-- First column -->
    <TKGoodHistoryList v-if="good.id" :good-id="good.id" />
  </LayoutTwoColumns>
  <!--  -->
</template>

<script setup>
import TKGoodHistoryList from "@/components/TKGoodHistoryList.vue";

const props = defineProps({
  good: {
    type: Object,
    default: null,
  },
});
</script>
