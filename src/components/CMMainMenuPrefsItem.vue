<template>
  <CMMainMenuSubmenu
    :submenu="menu"
    class="right"
    rounded="left"
    style="padding-right: 1em; font-variant-caps: normal; font-size: 14px; font-weight: 400"
  />
</template>

<script setup>
import { computed } from "vue";
import CMMainMenuSubmenu from "@/components/CMMainMenuSubmenu.vue";
import { useAuthStore } from "@/stores/auth";

// name: "CMMainMenuPrefsItem",

const authStore = useAuthStore();

/// DATA

const host = import.meta.env.VUE_APP_API_BASE;

const menu = computed(() => {
  return {
    id: 99,
    name: authStore.getAuthData?.name || "Ошибка",
    icon: "circle user",
    route: "",
    items: [
      {
        id: 91,
        name: host + "<br/>" + authStore.getAuthData?.email || "-", //+
        // "<br/>" +
        // this.authData.ip +
        // "<br/><br/>" +
        // this.authData.branches,
      },

      // {
      //   id: 92,
      //   name: "ЮМ.бонус",
      //   icon: "folder",
      //   route: "/promo",
      //   access: "yum_bonus",
      // },
      {
        id: 93,
        name: "Настройки",
        icon: "large sliders horizontal",
        route: "/prefs/profile",
        access: "profile.edit",
        divider: "top",
      },
      {
        id: 95,
        name: "Выйти",
        icon: "large sign out alternative",
        route: "/logoff",
        access: "",
        divider: "top",
      },
    ],
  };
});
</script>

<style scoped>
/* .ui.menu #nav .item:first-child {
  border-radius: 0px !important;
} */
.ui.menu .item.right:last-child::before {
  content: "";
  top: 22%;
  left: calc(-1px);
  height: 60%;
  width: 0px;
  /* background: red; */
}
</style>
