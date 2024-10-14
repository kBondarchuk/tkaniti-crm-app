<template>
  <LayoutPage :view-id="_viewId">
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
import CMPrefsUsers from "@/components/CMPrefsUsers.vue";
import CMPrefsProfile from "@/components/CMPrefsProfile.vue";
import CMPrefsParams from "@/components/CMPrefsParams.vue";
import CMPrefsCompanies from "@/components/CMPrefsCompanies.vue";
import CMPrefsSettings from "@/components/CMPrefsSettings.vue";
import CMPrefsAcquiring from "@/components/CMPrefsAcquiring.vue";
import CMPrefsPaymentsYoo from "@/components/CMPrefsPaymentsYoo.vue";
import CMPrefsPaymentsSbp from "@/components/CMPrefsPaymentsSbp.vue";
import CMPrefsOfd from "@/components/CMPrefsOfd.vue";
import CMPrefsSystem from "@/components/CMPrefsSystem.vue";

import { ref, computed, watch, toRaw } from "vue";

import { useView } from "@/composables/view";
import { useAuthStore } from "@/stores/auth";

import { arrayEquals } from "@/utils/utils.js";
import AccessRights from "@/enums/AccessRights";

const _menu_items = [
  {
    id: 1,
    name: "Профиль пользователя",
    icon: "address card",
    component: CMPrefsProfile,
    access: AccessRights.User,
  },
  {
    id: 2,
    name: "Пользователи",
    icon: "user friends",
    component: "CMPrefsUsers",
    access: AccessRights.Sysadmin,
  },
  // { id: 3, name: "Шаблоны", icon: "file word", component: "CMPrefsTemplates", access: AccessRights.Admin },
  { id: 15, name: "Настройки", icon: "tools", component: CMPrefsSettings, access: "prefs.settings" },
  { id: 4, name: "Параметры", icon: "tools", component: CMPrefsParams, access: AccessRights.Admin },
  // { id: 7, name: "Реквизиты", icon: "stamp", component: "CMPrefsCompanies", access: AccessRights.Admin },
  { id: 8, name: "Юр. лица", icon: "stamp", component: CMPrefsCompanies, access: AccessRights.Admin },
  { id: 9, name: "Эквайринг", icon: "visa", component: CMPrefsAcquiring, access: AccessRights.Admin },
  { id: 12, name: "Ю-касса", icon: "visa", component: CMPrefsPaymentsYoo, access: AccessRights.Admin },
  { id: 11, name: "СБП", icon: "visa", component: CMPrefsPaymentsSbp, access: AccessRights.Admin },
  { id: 10, name: "Фискализация", icon: "cash register", component: CMPrefsOfd, access: AccessRights.Admin },
  { id: 20, name: "Система", icon: "lightbulb", component: CMPrefsSystem, access: AccessRights.Sysadmin },
];

/// SETUP

const _viewId = "PreferencesView";

const { view, checkAuthRole } = useView(_viewId, {
  title: "Настройки",
  subTitle: "",
});

const authStore = useAuthStore();

/// DATA

const menu = ref([]);
const menuSelectedId = ref(1);

/// COMPUTED

const currentComponent = computed(() => {
  const item = menu.value.find((obj) => obj.id == menuSelectedId.value);

  // console.warn(toRaw(item.component));
  if (item) {
    return toRaw(item.component);
  } else {
    return null;
  }
});

const currentPaddings = computed(() => {
  const item = menu.value.find((obj) => obj.id == menuSelectedId.value);

  // console.warn(item);
  if (item?.noPaddings) {
    return true;
  } else {
    return false;
  }
});

/// WATCHERS

watch(
  () => authStore.getAuthData,
  (newValue, oldValue) => {
    if (newValue !== null && !arrayEquals(newValue?.rights, oldValue?.rights)) {
      console.warn("[PrefsView]: Reparsing...");
      mountMenu();
    }
  },
  { immediate: true }
);

/// FUNCTIONS

function mountMenu() {
  menu.value = [];
  menu.value = parseMenu(_menu_items);
  if (menu.value.length > 0) {
    menuSelectedId.value = menu.value[0].id;
  }
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
