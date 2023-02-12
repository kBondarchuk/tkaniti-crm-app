<template>
  <div class="ui top tabular menu" style="padding-top: 1em; padding-left: 1.5em">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="item"
      :class="{ active: tabIsActive(tab.id), disabled: tab.disabled }"
      @click="selected(tab.id)"
    >
      {{ tab.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "UIDetailsTabs",

  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["tabSelect"],

  methods: {
    tabIsActive(tabId) {
      const paths = this.$route.path.split("/");
      return paths[paths.length - 1] == tabId;
    },
    selected(tabId) {
      if (!this.tabIsActive(tabId)) {
        this.$emit("tabSelect", tabId);
      }
    },
  },
};
</script>
