<template>
  <div class="wpanel" :style="style" :class="{ 'no-padding': noPadding, scrollable: scrollable }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "WPanel",
  components: {},
  props: {
    size: {
      type: String,
      default: null,
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: false,
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
.wpanel {
  flex: 0 0;
  /* background: rgba(15, 15, 250, 0.041); */
  padding: 1em 1em 1em 1em;
}

.wpanel-container.horizontal > .wpanel {
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
}

.wpanel-container.horizontal > .wpanel:last-child {
  border-bottom: 0;
}

.wpanel-container.vertical > .wpanel {
  border-right: 1px solid rgba(34, 36, 38, 0.15);
}

.wpanel-container.vertical > .wpanel:last-child {
  border-right: 0;
}

.wpanel-container > .wpanel.no-padding {
  padding: 0;
}

.wpanel-container > .wpanel.scrollable {
  overflow: auto;
}
</style>
