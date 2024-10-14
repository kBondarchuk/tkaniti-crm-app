<template>
  <div class="ui-layout">
    <!-- Header -->
    <LayoutPageTitle>
      <slot name="title"></slot>
      <template #subtitle><slot name="subtitle"></slot></template>
    </LayoutPageTitle>

    <!-- Toolbar -->
    <LayoutToolbar v-if="$slots.toolbar || togglePanelButton || backButton">
      <YTogglePanelButton v-if="togglePanelButton" :show="showSidePanel" @click="toggleSidePanel" />
      <YBackButton v-if="backButton != null" :to="backButton" />
      <slot name="toolbar"></slot>
    </LayoutToolbar>

    <!-- Main container -->
    <div class="ui-container">
      <!-- Side Panel column -->
      <div v-if="$slots.side && showSidePanel" class="ui-side-bar">
        <slot name="side"></slot>
      </div>

      <!-- Content column -->
      <div
        class="ui-main"
        :class="{
          'no-paddings': noPaddings,
          'no-vertical-paddings': noVerticalPaddings,
          'dark-background': background == 'dark',
          flex: flex,
        }"
      >
        <slot :show-side-panel="showSidePanel"></slot>
      </div>
      <!--  -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

/// PROPS

const props = defineProps({
  noPaddings: {
    type: Boolean,
    default: false,
  },
  noVerticalPaddings: {
    type: Boolean,
    default: false,
  },
  background: {
    type: String,
    default: null,
  },
  flex: {
    type: Boolean,
    default: false,
  },
  togglePanelButton: {
    type: Boolean,
    default: false,
  },
  backButton: {
    type: String,
    default: null,
  },
  viewId: {
    type: String,
    default: null,
  },
});

// setup(props) {
if (!props.viewId) {
  console.warn("[LayoutPage] No viewId defined!");
}

/// DATA

const showSidePanel = props.viewId ? useStorage(props.viewId + ".show_side_panel", true) : ref(true);

/// FUNCTIONS

function toggleSidePanel() {
  // console.warn("toggleSidePanel", showSidePanel);
  showSidePanel.value = !showSidePanel.value;
}
</script>

<style>
.no-paddings {
  padding: 0;
}

.no-vertical-paddings {
  padding-top: 0;
  padding-bottom: 0;
}

.dark-background {
  background: rgba(212, 212, 213, 0.31);
}

.flex {
  display: flex;
}
</style>
