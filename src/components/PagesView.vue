<template>
  <LayoutPage :no-paddings="noPaddings" :view-id="viewId">
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" />
    </template>
    <!-- <UITransition mode="out-in" appear :duration="150"> -->
    <component :is="currentComponent" />
    <!-- </UITransition> -->
  </LayoutPage>
</template>

<script setup>
import { ref, computed, watch, defineAsyncComponent } from "vue";

import { useCheckAuth } from "@/composables/checkAuth";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

import { arrayEquals } from "@/utils/utils.js";

/// SETUP

const { checkAuthRole } = useCheckAuth();
const authStore = useAuthStore();
const router = useRouter();

/// PROPS

const props = defineProps({
  pageId: {
    type: String,
    default: null,
  },
  routeName: {
    type: String,
    default: null,
  },
  viewId: {
    type: String,
    default: null,
  },
  items: {
    type: Array,
    default: () => [],
  },
  noPaddings: {
    type: Boolean,
    default: false,
  },
});

/// DATA

const menu = ref([]);
const menuSelectedId = ref(1);

/// COMPUTED

const currentComponent = computed(() => {
  const item = menu.value.find((obj) => obj.id == menuSelectedId.value);

  if (item) {
    // console.warn("component:", item.component);
    const componentName = item.component;
    const pageComponent = defineAsyncComponent(() => import(`../components/${componentName}.vue`));
    return pageComponent;
  } else {
    return null;
  }
});

/// WATCHERS

watch(
  () => authStore.getAuthData,
  (newValue, oldValue) => {
    if (newValue !== null && !arrayEquals(newValue?.rights, oldValue?.rights)) {
      console.warn("[PagesView]: Reparsing...");
      mountMenu();
    }
  },
  { immediate: true }
);

watch(
  () => menuSelectedId.value,
  (newValue, oldValue) => {
    // console.warn(">>> menuSelectedId", newValue);
    // navigator.navigateTo.Prefs.Pages({ pageId: newValue });
    router.push({ name: props.routeName, params: { pageId: newValue }, replace: false });
  }
);

watch(
  () => props.pageId,
  (newValue, oldValue) => {
    // console.warn("props.pageId", newValue);
    menuSelectedId.value = newValue;
  },
  { immediate: true }
);

/// FUNCTIONS

function mountMenu() {
  menu.value = [];
  menu.value = parseMenu(props.items);
  // if (menu.value.length > 0) {
  //   menuSelectedId.value = menu.value[0].id;
  // }
}

function parseMenu(menuItems) {
  const parsedMenu = [];

  menuItems.forEach((item) => {
    if (checkMenuItem(item)) {
      parsedMenu.push(item);
    }

    return true;
  });
  return parsedMenu;
}

function checkMenuItem(item) {
  return checkAuthRole(item.access) || item.access === undefined;
}
</script>
