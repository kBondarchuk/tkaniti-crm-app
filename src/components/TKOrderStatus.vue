<template>
  <UIBadge :text="status?.name" :class="status?.class" />
</template>

<script setup>
import { computed } from "vue";

// name: "TKOrderStatus",

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
  { id: 0, icon: "", name: "Новый", class: "background-color-red text-color-white" },
  { id: 1, icon: "", name: "Проверка", class: "background-color-green text-color-white" },
  { id: 2, icon: "", name: "Оплата", class: "background-color-blue text-color-white" },
  { id: 7, icon: "", name: "Сборка", class: "background-color-teal text-color-white" },
  { id: 3, icon: "", name: "К отправке", class: "background-color-purple text-color-white" },
  { id: 4, icon: "", name: "Отправлен", class: "background-color-violet text-color-white" },
  { id: 5, icon: "", name: "Получен", class: "background-color-grey text-color-white" },
  { id: 6, icon: "", name: "Отменён", class: "" },
];
</script>
