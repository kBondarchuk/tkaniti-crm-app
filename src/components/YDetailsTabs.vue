<template>
  <div class="ui top tabular menu" style="padding-top: 1em; padding-left: 1.5em">
    <router-link v-for="tab in tabs" :key="tab.id" v-slot="{ navigate, isActive }" :to="tab.id" custom replace>
      <div
        role="link"
        class="item"
        :class="{ active: isActive, disabled: tab.disabled }"
        @click="navigate"
        @keypress.enter="navigate"
      >
        {{ tab.name }} <span v-if="tab.label" class="text-color-grey">&nbsp;{{ tab.label }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
// name: "YDetailsTabs",

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.item:not(.active) {
  cursor: pointer;
}
.item:not(.active):hover {
  text-decoration: underline;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-color: var(--color-lightgrey) !important;
  text-decoration-thickness: 2px !important;
  text-underline-offset: 4px;
}
.item.active {
  cursor: default;
}
</style>
