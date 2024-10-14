import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUiStore = defineStore("uiStore", () => {
  /// DATA

  const title = ref("1");
  const subTitle = ref("2");
  const globalLoading = ref(false);
  const routerSavedPath = ref(null);
  const urlDownloadBase = ref(null);
  const staticHost = import.meta.env.VUE_APP_STATIC_HOST;
  const appName = ref("");

  /// GETTERS

  const isAppModeCustom = computed(() => {
    return import.meta.env.VUE_APP_MODE == "customers";
  });

  /// FUNCTIONS

  function setSavedPath(path) {
    routerSavedPath.value = path;
  }

  function getSavedPath() {
    return routerSavedPath.value;
  }

  return {
    globalLoading,
    urlDownloadBase,
    setSavedPath,
    getSavedPath,
    isAppModeCustom,
    appName,
    staticHost,
    title,
    subTitle,
  };
});
