<template>
  <a v-if="id > 0" title="Переход к заказу" class="ui label" @click.stop="go">
    <!-- :href="'/budget/requests/' + id" -->
    <i class="file alternate outline icon grow"></i><span>{{ id }}</span>
    <!-- style="float: left; line-height: unset" -->
  </a>
</template>

<script setup>
// name: "TKLinkOrder",
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
  navigateTo.Orders.Details({ orderId: props.id });
}
</script>

<style scoped>
a.ui.label > i.icon:hover {
  color: #db2828;
  text-decoration: none;
}

a.ui.label {
  margin-top: -0.2em;
  margin-bottom: -0.2em;
}
</style>
