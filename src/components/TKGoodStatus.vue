<template>
  <UIStatusBadge :value="value" :statuses="statuses" />
</template>

<script setup>
// name: "TKGoodStatus"

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
  { id: 0, icon: "", name: "Новый", class: "background-color-red text-color-white" },
  { id: 1, icon: "", name: "На складе", class: "background-color-blue text-color-white" },
  { id: 2, icon: "", name: "В продаже", class: "background-color-green text-color-white" },
  { id: 3, icon: "", name: "Продано", class: "" },
  { id: 4, icon: "", name: "Стоп", class: "background-color-black text-color-white" },
];
</script>
