<template>
  <a v-if="requestId > 0" title="Переход к заявке" class="ui label" @click.stop="go">
    <!-- :href="'/budget/requests/' + requestId" -->
    <i class="file alternate outline icon grow"></i><span>{{ requestId }}</span>
    <!-- style="float: left; line-height: unset" -->
  </a>
</template>

<script setup>
import { useNavigation } from "@/composables/navigation";

// name: "CMLinkBudget",

/// PROPS

const props = defineProps({
  requestId: {
    type: Number,
    default: null,
  },
  // path: {
  //   type: String,
  //   default: "budget_request_details",
  // },
});

/// SETUP

const { navigateTo } = useNavigation();

/// FUNCTIONS

function go() {
  // TODO: Navigate to tab!
  navigateTo.Budget.Details({ requestId: props.requestId });
}
</script>

<style scoped>
a.ui.label > i.icon:hover {
  color: #db2828;
  text-decoration: none;
}

.ui.label > .icon {
  margin-right: 0.5em;
}

a.ui.label {
  margin-top: -0.2em;
  margin-bottom: -0.2em;
}
</style>
