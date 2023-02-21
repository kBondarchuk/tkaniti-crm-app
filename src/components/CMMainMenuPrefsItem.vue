<template>
  <!-- <div class="right menu"> -->
  <CMMainMenuSubmenu
    :submenu="menu"
    class="right"
    rounded="left"
    style="padding-right: 1em; font-variant-caps: normal; font-size: 14px; font-weight: 400"
  />
</template>

<script>
import CMMainMenuSubmenu from "@/components/CMMainMenuSubmenu.vue";

export default {
  name: "CMMainMenuPrefsItem",

  components: {
    CMMainMenuSubmenu,
  },

  computed: {
    authData() {
      return this.$store.getters["auth/getAuthData"] || {};
    },
    host() {
      return import.meta.env.VUE_APP_API_BASE;
    },
    menu() {
      return {
        id: 99,
        name: this.authData.name || "Ошибка",
        icon: "circle user",
        route: "",
        items: [
          {
            id: 91,
            name: this.host + "<br/>" + this.authData.email + " :: " + this.authData.ip,
            // +
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
            route: "/prefs",
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
    },
  },

  methods: {
    subIsActive(pathes) {
      return pathes.some((path) => {
        return this.$route.path.indexOf(path) === 0; // current path starts with this path string
      });
    },
  },
};
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
