<template>
  <LayoutPage :no-paddings="currentPaddings">
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" />
    </template>
    <!-- <h1>Заглавная страница</h1> -->
    <!-- <UITransition mode="out-in" appear :duration="150"> -->
    <component :is="currentComponent" />
    <!-- </UITransition> -->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";
// import UITransition from "@/components/UITransition.vue";
import CMPrefsUsers from "@/components/CMPrefsUsers.vue";
import CMPrefsProfile from "@/components/CMPrefsProfile.vue";
// import CMPrefsTemplates from "@/components/CMPrefsTemplates.vue";
import CMPrefsParams from "@/components/CMPrefsParams.vue";
// import CMPrefsBranches from "@/components/CMPrefsBranches.vue";
import CMPrefsCompanies from "@/components/CMPrefsCompanies.vue";
// import CMPrefsExpensesCategories from "@/components/CMPrefsExpensesCategories.vue";
import CMPrefsSystem from "@/components/CMPrefsSystem.vue";
// import CMPrefsPercentTable from "@/components/CMPrefsPercentTable.vue";

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
  { id: 4, name: "Параметры", icon: "tools", component: "CMPrefsParams", access: "admin" },
  // {
  //   id: 9,
  //   name: "Таблица процентов",
  //   icon: "percent",
  //   component: "CMPrefsPercentTable",
  //   access: "admin",
  // },
  // { id: 5, name: "Филиалы", icon: "landmark", component: "CMPrefsBranches", access: "sysadmin" },
  // {
  //   id: 6,
  //   name: "Статьи расхода",
  //   icon: "piggy bank",
  //   component: "CMPrefsExpensesCategories",
  //   access: "sysadmin",
  // },
  { id: 7, name: "Реквизиты", icon: "stamp", component: "CMPrefsCompanies", access: "admin" },
  { id: 8, name: "Система", icon: "lightbulb", component: "CMPrefsSystem", access: "sysadmin" },
];

export default {
  name: "PreferencesView",

  components: {
    LayoutPage,
    LayoutSideMenu,
    // UITransition,
    CMPrefsUsers,
    CMPrefsProfile,
    // CMPrefsTemplates,
    CMPrefsParams,
    // CMPrefsBranches,
    CMPrefsCompanies,
    // CMPrefsExpensesCategories,
    CMPrefsSystem,
    // CMPrefsPercentTable,
  },

  mixins: [viewMixin],

  data() {
    return {
      // View
      view: { title: "Настройки", subTitle: "" },
      // Menu
      menu: [],
      menuSelectedId: 1,
    };
  },

  computed: {
    authData() {
      return this.$store.getters["auth/getAuthData"];
    },
    authRights() {
      return this.$store.getters["auth/getAuthRights"];
    },
    currentComponent() {
      // if (!this.menu.length) return null;
      // console.warn(this.menuSelectedId);

      const item = this.menu.find((obj) => obj.id == this.menuSelectedId);

      // console.warn(item);
      if (item) {
        return item.component;
      } else {
        return null;
      }
    },
    currentPaddings() {
      const item = this.menu.find((obj) => obj.id == this.menuSelectedId);

      // console.warn(item);
      if (item.noPaddings) {
        return true;
      } else {
        return false;
      }
    },
  },

  watch: {
    authData: {
      immediate: true,
      handler(newValue) {
        // console.warn(newValue);

        if (newValue !== null) {
          this.mountMenu();
        }
      },
    },
  },

  // created() {
  //   console.warn("[PreferencesView]: created ");

  //   // this.mountMenu();
  // },

  methods: {
    mountMenu() {
      // console.warn("mountMenu");

      this.menu = [];

      this.menu = this.parseMenu(_menu_items);

      this.menuSelectedId = this.menu[0].id;
    },

    checkAccess(role) {
      return this.authRights.includes(role);
    },
    parseMenu(menuItems) {
      const parsedMenu = [];

      menuItems.forEach((item) => {
        if (this.checkMenuItem(item)) {
          parsedMenu.push(item);
        }

        return true;
      });
      return parsedMenu;
    },
    checkMenuItem(item) {
      return this.checkAccess(item.access) || item.access === undefined;
    },
  },
};
</script>
