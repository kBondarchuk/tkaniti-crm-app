<template>
  <UIBadge :text="status?.name" :class="status?.class" />
</template>

<script setup>
// name: "UIStatusBadge"

import { computed } from "vue";

/// PROPS

const props = defineProps({
  value: {
    type: Number,
    default: null,
  },
  statuses: {
    type: Array,
    default: () => [],
  },
});

/// COMPUTED

const status = computed(() => {
  return props.statuses.find((item) => item.id == props.value);
});
</script>
