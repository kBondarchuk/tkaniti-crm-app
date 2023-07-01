// detailsTabs.js
// import { ref, onMounted, onUnmounted, watch, reactive } from "vue";
import { useStore } from "vuex";

// by convention, composable function names start with "use"
export function useDetailsTabs(options) {
  /// SETUP

  // const router = useRouter();
  const store = useStore();

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

  function checkAuthRole(role) {
    return store.getters["auth/getAuthRights"].includes(role);
  }

  function createTabs(kTABS) {
    if (!kTABS) {
      console.error("[TabsMixin]: createTabs - No tabs defined!");
      return;
    }
    return parseTabs(kTABS);
  }

  /// RUN

  const tabs = createTabs(options);

  // expose managed state as return value
  return { tabs };
}
