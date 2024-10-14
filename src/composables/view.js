// view.js
import { onMounted, watch, reactive, inject } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/uiStore";

export function useView(viewId, { title = "", subTitle = "" } = {}) {
  /// SETUP

  if (viewId == undefined) {
    console.warn("[useView]: viewId is undefined!");
  }

  // const router = useRouter();
  // const store = useStore();
  const authStore = useAuthStore();
  const uiStore = useUiStore();

  const appPresets = inject("APP_PRESETS");

  /// DATA

  const view = reactive({
    title: title,
    subTitle: subTitle,
  });

  /// WATCHERS

  watch([() => view.title, () => view.subTitle], () => {
    setHtmlTitle();
    saveTitle();
  });

  /// LIFECYCLE

  saveTitle();

  onMounted(() => {
    setHtmlTitle();
    saveTitle();
  });

  /// FUNCTIONS

  function saveTitle() {
    uiStore.$patch({
      title: view.title,
      subTitle: view.subTitle,
    });
  }

  function setHtmlTitle() {
    const defaultTitle = appPresets.app_name;
    document.title = view.title + (defaultTitle ? " | " + defaultTitle : "");
  }

  function checkAuthRole(role) {
    return authStore.checkAuthRole(role);
  }

  function storageSaveValue(_storageID, value) {
    localStorage.setItem(_storageID, value);
  }

  function storageLoadValue(storageId) {
    // Load saved params
    const loadedValue = localStorage.getItem(storageId);

    // console.log("->", loadedValue);
    if (loadedValue) {
      return JSON.parse(loadedValue);
    } else {
      return null;
    }
  }

  /// EXPOSE

  return { view, checkAuthRole, storageSaveValue, storageLoadValue };
}
