<template>
  <UIButton icon="filter" type="labeled basic" style="min-width: 10em">
    <span v-if="show">Скрыть</span>
    <span v-else>Показать</span>
  </UIButton>
</template>

<script setup>
/// SETUP

/// PROPS

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

/// FUNCTIONS
</script>
