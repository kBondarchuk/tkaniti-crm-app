<template>
  <UIStatusBadge :value="value" :statuses="statuses" />
</template>

<script setup>
// name: "TKOrderPaymentStatus"

import UIStatusBadge from "@/components/UIStatusBadge.vue";

/// PROPS

const props = defineProps({
  value: {
    type: Number,
    default: null,
  },
});

/// DATA

const statuses = [
  { id: "0", icon: "", name: "Не оплачен", class: "background-color-red text-color-white" },
  { id: "1", icon: "", name: "Оплачен", class: "background-color-green text-color-white" },
];
</script>
