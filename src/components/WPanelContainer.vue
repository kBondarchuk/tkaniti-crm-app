<template>
  <div class="wpanel-container" :style="style" :class="{ vertical: vertical, horizontal: horizontal }">
    <slot></slot>
  </div>
</template>

<script>
// import LayoutPageTitle from "@/components/LayoutPageTitle.vue";

export default {
  name: "WPanelContainer",
  components: {},
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: null,
    },
  },
  computed: {
    style() {
      if (!this.size) return "";
      if (this.size == "full") {
        return "flex: 1 0";
      } else if (this.size) {
        return "flex: 0 0 " + this.size;
      }
      return "";
    },
  },
};
</script>

<style>
.wpanel-container {
  display: flex;
  /* background: rgba(250, 23, 15, 0.055); */
  padding: 0;
  flex: 0 0;
}

.wpanel-container.horizontal {
  flex-direction: column;
  flex: 1;
}

.wpanel-container.vertical {
  flex-direction: row;
  flex: 1;
}
</style>
