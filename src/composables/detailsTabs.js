// detailsTabs.js
// import { ref, onMounted, onUnmounted, watch, reactive } from "vue";
import { useCheckAuth } from "@/composables/checkAuth";

export function useDetailsTabs(options) {
  /// SETUP

  const { checkAuthRole } = useCheckAuth();

  /// FUNCTIONS

  function parseTabs(menuItems) {
    const parsedMenu = [];

    menuItems.forEach((item) => {
      if (checkTabItem(item)) {
        item.disabled = false;
        parsedMenu.push(item);
      } else {
        item.disabled = true;
        parsedMenu.push(item);
      }
      return true;
    });
    return parsedMenu;
  }

  function checkTabItem(item) {
    return checkAuthRole(item.access) || item.access === undefined;
  }

  function createTabs(kTABS) {
    if (!kTABS) {
      console.error("[Tabs Composable]: createTabs - No tabs defined!");
      return;
    }
    return parseTabs(kTABS);
  }

  /// RUN

  const tabs = createTabs(options);

  // expose managed state as return value
  return { tabs };
}
