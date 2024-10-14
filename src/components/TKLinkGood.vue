<template>
  <i class="arrow alternate circle right outline icon" title="Переход к товару" @click.stop="go"></i>
</template>

<script setup>
// name: "TKLinkGood",

import { useNavigation } from "@/composables/navigation";

/// SETUP

const { navigateTo } = useNavigation();

/// PROPS

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
});

/// FUNCTIONS

function go() {
  navigateTo.Goods.Details({ goodId: props.id });
}
</script>

<style scoped>
.icon {
  font-size: 14px;
  /* background-color: aqua; */
}

.icon:hover {
  color: orangered;
  cursor: pointer;
}
</style>
