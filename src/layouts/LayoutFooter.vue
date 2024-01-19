<template>
  <div class="ui-footer">
    <div id="copyright" class="ui-footer-content">{{ appName }} {{ version }}</div>
  </div>
</template>

<script>
export default {
  name: "LayoutFooter",
  computed: {
    version() {
      return this.$store.state.appVersion;
    },
    appName() {
      return this.$store.state.appName;
    },
  },
};
</script>

<style scoped>
#copyright {
  text-align: center;
  font-size: 1.24rem;
  font-weight: light;
  color: rgba(0, 0, 0, 0.25);
}
</style>
