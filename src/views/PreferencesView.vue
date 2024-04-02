<template>
  <LayoutPage :no-paddings="currentPaddings">
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>
    <!-- <h1>Заглавная страница</h1> -->
    <UITransition mode="out-in" duration="0.3s">
      <component :is="currentComponent" />
    </UITransition>
  </LayoutPage>
</template>

<script>
import { useView } from "@/composables/view";
import { useDetailsTabs } from "@/composables/detailsTabs";

import LayoutPage from "@/layouts/LayoutPage.vue";
import LayoutSideMenu from "@/layouts/LayoutSideMenu.vue";
import CMPrefsUsers from "@/components/CMPrefsUsers.vue";
import CMPrefsProfile from "@/components/CMPrefsProfile.vue";
// import CMPrefsTemplates from "@/components/CMPrefsTemplates.vue";
import CMPrefsParams from "@/components/CMPrefsParams.vue";
import CMPrefsCompanies from "@/components/CMPrefsCompanies.vue";
import CMPrefsSettings from "@/components/CMPrefsSettings.vue";
import CMPrefsAcquiring from "@/components/CMPrefsAcquiring.vue";
import CMPrefsPaymentsSbp from "@/components/CMPrefsPaymentsSbp.vue";
import CMPrefsOfd from "@/components/CMPrefsOfd.vue";
import CMPrefsSystem from "@/components/CMPrefsSystem.vue";

const _menu_items = [
  {
    id: 1,
    name: "Профиль пользователя",
    icon: "address card",
    component: "CMPrefsProfile",
    access: "user",
    noPaddings: true,
  },
  {
    id: 2,
    name: "Пользователи",
    icon: "user friends",
    component: "CMPrefsUsers",
    access: "sysadmin",
    noPaddings: true,
  },
  // { id: 3, name: "Шаблоны", icon: "file word", component: "CMPrefsTemplates", access: "admin" },
  { id: 15, name: "Настройки", icon: "tools", component: "CMPrefsSettings", access: "prefs.settings" },
  { id: 4, name: "Параметры", icon: "tools", component: "CMPrefsParams", access: "admin" },
  // { id: 7, name: "Реквизиты", icon: "stamp", component: "CMPrefsCompanies", access: "admin" },
  { id: 8, name: "Юр. лица", icon: "stamp", component: "CMPrefsCompanies", access: "admin" },
  { id: 9, name: "Эквайринг", icon: "visa", component: "CMPrefsAcquiring", access: "admin" },
  { id: 11, name: "СБП", icon: "visa", component: "CMPrefsPaymentsSbp", access: "admin" },
  { id: 10, name: "Фискализация", icon: "cash register", component: "CMPrefsOfd", access: "admin" },
  { id: 20, name: "Система", icon: "lightbulb", component: "CMPrefsSystem", access: "sysadmin" },
];

export default {
  name: "PreferencesView",

  components: {
    CMPrefsUsers,
    CMPrefsProfile,
    // CMPrefsTemplates,
    CMPrefsSettings,
    CMPrefsParams,
    CMPrefsCompanies,
    CMPrefsAcquiring,
    CMPrefsPaymentsSbp,
    CMPrefsOfd,
    CMPrefsSystem,
  },

  setup() {
    const { view } = useView("PreferencesView");

    view.title = "Настройки";
    view.subTitle = "Заготовка страницы";

    const { tabs: menu } = useDetailsTabs(_menu_items);

    // console.warn("Menu: ", menu);

    return { view, menu: menu.filter((item) => item.disabled == false), useDetailsTabs };
  },

  data() {
    return {
      menuSelectedId: 1,
    };
  },

  computed: {
    authData() {
      return this.$store.getters["auth/getAuthData"];
    },
    menuFiltered() {
      return this.menu.filter((item) => item.disabled == false);
    },
    currentComponent() {
      const item = this.menu.find((obj) => obj.id == this.menuSelectedId);
      return item ? item.component : null;
    },
    currentPaddings() {
      if (!this.menu) return null;
      const item = this.menu.find((obj) => obj.id == this.menuSelectedId);
      return item?.noPaddings ? true : false;
    },
  },

  watch: {
    authData: {
      immediate: true,
      handler(newValue) {
        // console.warn("authdata: ", newValue);

        if (newValue !== null) {
          // this.mountMenu();
          const { tabs } = useDetailsTabs(_menu_items);
          this.menu = tabs.filter((item) => item.disabled == false);
        }
      },
    },
  },
};
</script>
