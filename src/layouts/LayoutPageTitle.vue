<template>
  <div id="header" class>
    <h2 class="ui header" style="display: inline-block; margin-bottom: 0; margin-top: 0; flex: 1">
      {{ uiStore.title }}
      <div v-if="uiStore.subTitle || $slots.subtitle" class="sub header">
        <slot name="subtitle"></slot> {{ uiStore.subTitle }}
      </div>
    </h2>
    <div><slot></slot></div>
  </div>
</template>

<script setup>
// name: "LayoutPageTitle",
import { useUiStore } from "@/stores/uiStore";

/// SETUP

const uiStore = useUiStore();
</script>

<style scoped>
#header {
  padding: 1rem 1.5rem 1rem 1.5rem;
  margin-top: 0rem;
  border-bottom: 1px solid rgb(222, 222, 223);
  /* background-color: cornsilk2; */
  display: flex;
  align-items: center;
}
</style>
