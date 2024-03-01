<template>
  <div class="ui-layout">
    <!-- Header -->
    <LayoutPageTitle>
      <slot name="title"></slot>
    </LayoutPageTitle>
    <!-- Toolbar -->
    <LayoutToolbar v-if="$slots.toolbar">
      <slot name="toolbar"></slot>
    </LayoutToolbar>
    <!-- /Toolbar -->
    <div class="ui-container">
      <!-- Side Menu -->
      <div v-if="$slots.side" class="ui-side-bar">
        <slot name="side"></slot>
      </div>
      <!-- /Side Menu -->

      <!-- main column -->
      <div
        class="ui-main"
        :class="{
          'no-paddings': noPaddings,
          'no-vertical-paddings': noVerticalPaddings,
          'dark-background': background == 'dark',
          flex: flex,
        }"
      >
        <slot></slot>
      </div>
      <!-- /main column -->
    </div>
  </div>
</template>

<script>
import LayoutPageTitle from "@/layouts/LayoutPageTitle.vue";
import LayoutToolbar from "@/layouts/LayoutToolbar.vue";

export default {
  name: "LayoutPage",
  abstract: true,
  components: {
    LayoutPageTitle,
    LayoutToolbar,
  },
  props: {
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
  },
};
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
