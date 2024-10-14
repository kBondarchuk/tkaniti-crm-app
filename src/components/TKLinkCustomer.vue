<template>
  <i class="arrow alternate circle right outline icon" title="Переход к клиенту" @click.stop="go"></i>
</template>

<script setup>
// name: "TKLinkCustomer",

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
  navigateTo.Customers.Details({ customerId: props.id });
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
