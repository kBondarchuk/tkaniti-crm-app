<template>
  <div class="ui-footer">
    <div id="copyright" class="ui-footer-content">{{ appPresets.app_name }} {{ appPresets.app_version }}</div>
  </div>
</template>

<script setup>
import { inject } from "vue";
// name: "LayoutFooter",
const appPresets = inject("APP_PRESETS");
console.warn(appPresets);
</script>

<style scoped>
#copyright {
  text-align: center;
  font-size: 1.24rem;
  font-weight: light;
  color: rgba(0, 0, 0, 0.25);
}
</style>
