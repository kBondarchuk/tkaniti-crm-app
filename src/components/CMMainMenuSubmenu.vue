<template>
  <!-- Submenu -->
  <div class="ui simple dropdown item" :class="{ 'is-active': subIsActive() }">
    <i v-if="submenu.icon" class="icon bright" :class="submenu.icon" /> {{ submenu.name }}
    <i class="dropdown icon"></i>
    <div class="menu" :class="{ 'rounded-right-corner': rounded == 'right', 'rounded-left-corner': rounded == 'left' }">
      <!-- Items -->
      <template v-for="item in submenu.items" :key="item.id">
        <div v-if="item.divider == 'top'" :key="'div' + item.id" class="divider"></div>
        <CMMainMenuItem :item="item" />
      </template>
    </div>
  </div>
</template>

<script>
import CMMainMenuItem from "@/components/CMMainMenuItem.vue";

export default {
  name: "CMMainMenuSubmenu",

  components: {
    CMMainMenuItem,
  },

  props: {
    submenu: {
      type: Object,
      default: () => {},
    },
    rounded: {
      type: String,
      default: "right",
      validator(value) {
        // The value must match one of these strings
        return ["right", "left"].includes(value);
      },
    },
  },

  methods: {
    subIsActive() {
      const pathes = this.submenu.items.map((item) => {
        return item.route;
      });

      return pathes.some((path) => {
        return this.$route.path.indexOf(path) === 0; // current path starts with this path string
      });
    },
  },
};
</script>

<style scoped>
.ui.menu .ui.dropdown .menu {
  font-variant-caps: normal;
  /* font-size: 16px !important; */
  /* font-weight: 100 !important; */
  padding: 0.5em 0;
}

.ui.menu .ui.dropdown .menu > .item {
  font-variant-caps: normal;
  /* font-size: 16px !important; */
}

.ui.dropdown .menu.rounded-right-corner {
  border-top-right-radius: 0.285714rem;
  box-shadow: 0px 5px 10px 0 rgb(0 0 0 / 13%);
}
.ui.dropdown .menu.rounded-left-corner {
  border-top-left-radius: 0.285714rem;
  box-shadow: 0px 5px 10px 0 rgb(0 0 0 / 13%);
}

.ui.menu .ui.dropdown .menu > .item {
  padding-top: 9px !important;
  padding-bottom: 9px !important;
  min-height: 2em !important;
}

.ui.menu .ui.dropdown .menu > .item :deep(.icon:not(.dropdown)) {
  vertical-align: baseline;
  /* background-color: aqua; */
}

.ui.menu .ui.dropdown .menu > .item.active :deep(.icon:not(.dropdown)) {
  vertical-align: baseline;
  /* background-color: aqua; */
  color: var(--yum-mainmenu-accent-color) !important;
}
/* div#mainmenu >>> .ui.dropdown.item > .menu .item > .icon {
  vertical-align: baseline;
  background-color: aqua;
} */

/* .ui.menu .dropdown.item .menu {
  background-color: rgba(255, 255, 255, 0.3);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
} */

/* .ui.menu .ui.dropdown .menu > a.item.router-link-exact-active.active >>> .icon {
  color: rgb(226, 54, 38);
} */
</style>
