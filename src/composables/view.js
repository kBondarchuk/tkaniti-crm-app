// view.js
import { onMounted, watch, reactive, inject } from "vue";
import { useStore } from "vuex";

export function useView(viewId) {
  /// SETUP
  if (viewId == undefined) {
    console.warn("[useView]: viewId is undefined!");
  }

  // const router = useRouter();
  const store = useStore();

  const appPresets = inject("APP_PRESETS");

  const _sidePanelStatus = loadSidePanel(viewId);

  /// DATA

  const view = reactive({
    title: "-",
    subTitle: "-",
    showSidePanel: _sidePanelStatus,
  });

  /// WATCHERS

  watch([() => view.title, () => view.subTitle], () => {
    // console.warn("!", view);
    setHtmlTitle();
    saveTitle();
  });

  /// LIFECYCLE

  onMounted(() => {
    setHtmlTitle();
    saveTitle();
  });

  /// FUNCTIONS

  function saveTitle() {
    store.commit("setTitle", {
      title: view.title,
      subTitle: view.subTitle,
    });
  }

  function setHtmlTitle() {
    const defaultTitle = appPresets.app_name;
    document.title = view.title + (defaultTitle ? " | " + defaultTitle : "");
  }

  function checkAuthRole(role) {
    return store.getters["auth/getAuthRights"].includes(role);
  }

  function loadSidePanel(tid) {
    return JSON.parse(localStorage.getItem(tid + ".show_side_panel")) ?? true;
  }

  function toggleSidePanel() {
    view.showSidePanel = !view.showSidePanel;
    localStorage.setItem(viewId + ".show_side_panel", view.showSidePanel);
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
  return { view, checkAuthRole, toggleSidePanel, storageSaveValue, storageLoadValue };
}
