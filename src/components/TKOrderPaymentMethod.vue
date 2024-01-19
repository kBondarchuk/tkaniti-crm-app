<template>
  <div :class="status?.class"><i :class="status?.icon + ' icon'" :title="status?.text"></i></div>
</template>

<script setup>
// name: "TKOrderPaymentMethod",

import { computed } from "vue";

/// PROPS

const props = defineProps({
  value: {
    type: Number,
    default: null,
  },
});

/// COMPUTED

const status = computed(() => {
  return statuses.find((item) => item.id == props.value);
});

/// DATA

const statuses = [
  { id: 0, icon: "", text: "", class: "text-color-red" },
  { id: 1, icon: "credit card outline", text: "Карта", class: "text-color-blue" },
  { id: 2, icon: "money ", text: "Перевод", class: "text-color-grey" },
];
</script>
