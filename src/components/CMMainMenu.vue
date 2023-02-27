<template>
  <div id="mainmenu" class="ui fixed inverted menu">
    <div id="nav" class="ui fluid container">
      <!-- Home -->
      <CMMainMenuLogoItem :text="appName" />

      <!-- Items -->
      <template v-for="item in menu.items">
        <!-- Item -->
        <CMMainMenuItem v-if="item.route && !item.submenu" :key="item.id" :item="item" />
        <!-- Submenu -->
        <CMMainMenuSubmenu v-if="item.items" :key="item.id" :submenu="item" />
      </template>

      <!-- Prefs submenu -->
      <CMMainMenuPrefsItem />
    </div>
    <!-- <div id="progress" class="ui blue swinging inverted indeterminate bottom attached progress">
      <div class="bar"></div>
    </div> -->
    <div v-if="loadingState" id="progress" class="progress progress-striped active">
      <!-- <div role="progressbar progress-striped " style="width: 100%; height: 3px" class="progress-bar-info"></div> -->
      <div role="progressbar " style="width: 100%" class="progress-bar"></div>
    </div>
  </div>
</template>

<script>
import CMMainMenuItem from "@/components/CMMainMenuItem.vue";
import CMMainMenuSubmenu from "@/components/CMMainMenuSubmenu.vue";
import CMMainMenuPrefsItem from "@/components/CMMainMenuPrefsItem.vue";
import CMMainMenuLogoItem from "@/components/CMMainMenuLogoItem.vue";

// import * as _menuObject from "../main_menu.json";

export default {
  name: "CMMainMenu",

  components: {
    CMMainMenuItem,
    CMMainMenuSubmenu,
    CMMainMenuPrefsItem,
    CMMainMenuLogoItem,
  },

  data() {
    return {
      menuObject: null,
      menu: { items: [] },
    };
  },

  computed: {
    authData() {
      return this.$store.getters["auth/getAuthData"];
    },
    authRights() {
      return this.$store.getters["auth/getAuthRights"];
    },
    loadingState() {
      return this.$store.getters["getLoadingState"];
    },
    appName() {
      return this.$store.state.appName;
    },
  },

  watch: {
    authData: {
      immediate: true,
      handler(newValue) {
        console.log("[MainMenu]: *** Auth data changed to: ", newValue);
        if (newValue !== null) {
          this.makeMenu();
        } else {
          console.log("[MainMenu]: *** No Auth data! "); // Redirecting to logoff...

          // this.$router.push({ path: "/logoff" });
        }
      },
    },
  },

  methods: {
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input];

      return paths.some((path) => {
        return this.$route.path.indexOf(path) === 0; // current path starts with this path string
      });
    },
    // makeActive: function (event) {
    //   if (event.srcElement.classList.contains("active")) {
    //     event.srcElement.classList.remove("active");
    //   } else {
    //     event.srcElement.classList.add("active");
    //   }
    // },
    checkAccess(role) {
      return this.authRights.includes(role);
    },
    parseMenu(menuItems) {
      const parsedMenu = { items: [] };

      menuItems.forEach((item) => {
        if (item.items) {
          const newItem = Object.assign({}, item);
          newItem.items = this.parseMenu(item.items).items;

          if (newItem.items.length > 0) {
            parsedMenu.items.push(newItem);
          }
        } else {
          if (this.checkMenuItem(item)) {
            parsedMenu.items.push(item);
          }
        }

        return true;
      });
      return parsedMenu;
    },
    checkMenuItem(item) {
      return this.checkAccess(item.access) || item.access === undefined;
    },
    async makeMenu() {
      if (!this.menuObject) {
        //
        var main_menu_file = "main_menu";

        if (import.meta.env.VUE_APP_MODE === "customers") {
          var main_menu_file = "main_menu_customers";
        }

        console.warn(main_menu_file);

        this.menuObject = await import(`../${main_menu_file}.json`);
        console.log("MENU:   ", JSON.stringify(this.menuObject.default));
      }

      // console.log("+++ ", this.authRights);
      // console.log(this.checkMenu(_menuObject.items));
      this.menu = this.parseMenu(this.menuObject.default.items);
      // console.log(">>> menu ", JSON.stringify(this.menu));
      // console.log(">>> после", JSON.stringify(_menuObject.default));

      // $("#progress").progress();
    },
  },
};
</script>

<style scoped>
div#mainmenu {
  --ui-main-menu-font-size: 16px;
  --ui-main-menu-icon-size: 18px;
}

div#mainmenu {
  /* font-family: "SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Helvetica Neue", "Helvetica", "Arial", sans-serif; */
  /* font-family: -apple-system, BlinkMacSystemFont, sans-serif; */
  background-color: rgba(0, 0, 0, 0.79);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

div#mainmenu .item.active,
div#mainmenu :deep(.item.is-active) {
  background-color: var(--yum-mainmenu-accent-color);
  /* background-color: rgb(226, 54, 38); */
  color: #ffffff;
  transition: background 0.2s ease-in-out;
}

div#mainmenu :deep(.item > .icon:not(.ui.dropdown.item .item > .icon)) {
  color: white;
  /* margin-top: -2px; */
  /* margin-bottom: -2px; */
  font-size: var(--ui-main-menu-icon-size);
}

.ui.menu #nav {
  margin-left: 0.23rem;
}

.ui.menu #nav > .item {
  border-radius: 6px;
  /* margin: 0.4em 0.6em; */
  margin: 5px 8.5px;
  padding: 7px 10px;
  /* padding: 0.5rem 0.7rem; */

  font-size: var(--ui-main-menu-font-size);
  font-variant-caps: small-caps;
  font-weight: 600;
  /* background-color: violet; */
}

.ui.menu #nav > .item:last-child {
  border-radius: 6px !important;
  margin: 5px 8.5px;
}
.ui.menu #nav > .item:nth-last-child(2) {
  margin-right: 17px;
}

.ui.menu #nav > .item:last-child:hover {
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.ui.menu .item::before {
  /* reset  */
  content: "";
  top: inherit;
  right: inherit;
  height: inherit;
  width: inherit;
}

.ui.menu .item:not(:last-child)::before {
  content: "";
  top: 12%;
  right: calc(-9.5px);
  height: 80%;
  width: 2px;
  /* background: red; */
}

/* progress  */
#progress {
  position: absolute !important;
  left: 0;
  bottom: -4px;
  width: 100%;
}
</style>

<style lang="scss">
.progress-bar {
  height: 4px;
}

$brand-default: #b0bec5;
$brand-primary: #2196f3;
$brand-secondary: #323a45;
$brand-success: #64dd17;
$brand-warning: #ffd600;
$brand-info: #29b6f6;
$brand-danger: #ef1c1c;
$bg-light-gray: #f5f5f5;

.progress {
  background-color: $bg-light-gray;
  border-radius: 3px;
  box-shadow: none;

  &.progress-xs {
    height: 5px;
    margin-top: 5px;
  }

  &.progress-sm {
    height: 10px;
    margin-top: 5px;
  }

  &.progress-lg {
    height: 25px;
  }

  &.vertical {
    position: relative;
    width: 20px;
    height: 200px;
    display: inline-block;
    margin-right: 10px;

    > .progress-bar {
      width: 100% !important;
      position: absolute;
      bottom: 0;
    }

    &.progress-xs {
      width: 5px;
      margin-top: 5px;
    }

    &.progress-sm {
      width: 10px;
      margin-top: 5px;
    }

    &.progress-lg {
      width: 30px;
    }
  }
}

.progress-bar {
  background-color: $brand-primary;
  box-shadow: none;

  &.text-left {
    text-align: left;

    span {
      margin-left: 10px;
    }
  }

  &.text-right {
    text-align: right;

    span {
      margin-right: 10px;
    }
  }
}

@mixin gradient-striped($color: rgba(255, 255, 255, 0.372), $angle: 45deg) {
  // background-image: -webkit-linear-gradient(
  //   $angle,
  //   $color 25%,
  //   transparent 25%,
  //   transparent 50%,
  //   $color 50%,
  //   $color 75%,
  //   transparent 75%,
  //   transparent
  // );
  // background-image: -o-linear-gradient(
  //   $angle,
  //   $color 25%,
  //   transparent 25%,
  //   transparent 50%,
  //   $color 50%,
  //   $color 75%,
  //   transparent 75%,
  //   transparent
  // );
  background-image: linear-gradient(
    $angle,
    $color 25%,
    transparent 25%,
    transparent 50%,
    $color 50%,
    $color 75%,
    transparent 75%,
    transparent
  );
}

@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }

  to {
    background-position: 0 0;
  }
}

// Spec and IE10+
@keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }

  to {
    background-position: 0 0;
  }
}

@mixin animation($animation) {
  -webkit-animation: $animation;
  -o-animation: $animation;
  animation: $animation;
}

.progress.active .progress-bar,
.progress-bar.active {
  @include animation(progress-bar-stripes 0.2s linear infinite);
}

.progress-striped .progress-bar,
.progress-bar-striped {
  @include gradient-striped;
  background-size: 40px 40px;
}

@mixin progress-bar-variant($color) {
  background-color: $color;
}

.progress-bar-secondary {
  @include progress-bar-variant($brand-secondary);
}

.progress-bar-default {
  @include progress-bar-variant($brand-default);
}

.progress-bar-success {
  @include progress-bar-variant($brand-success);
}

.progress-bar-info {
  @include progress-bar-variant($brand-info);
}

.progress-bar-warning {
  @include progress-bar-variant($brand-warning);
}

.progress-bar-danger {
  @include progress-bar-variant($brand-danger);
}
</style>

<style>
/* .ui.inverted.menu .active.item,
.ui.inverted.menu .item.is-active {
  background-color: rgb(226, 54, 38);
  color: #ffffff;
  transition: background 0.2s ease-in-out;
} */

/* .ui.avatar.image {
  margin-right: 0.8em;
} */

/* .ui.menu#mainmenu > #nav > .item {
  font-variant-caps: small-caps;
  font-weight: bolder;
  background-color: violet;
  color: green;
  transition: background 0.2s ease-in-out;
} */

/* .ui.menu {
  border-radius: 0;
} */

/*
#mainmenu .item:first-child {
   border-radius: 6px !important;
} */

/* .ui.menu #nav > .dropdown.item > .menu .icon.large {
  background-color: blueviolet;
  vertical-align: bottom;
} */

/* .ui.menu #nav .item:first-child {
  border-radius: 6px !important;
} */

/* a.item.active > .large.icon {
  color: #fff;
} */

/* .ui.dropdown .menu > a.item.active > .icon {
  color: rgb(226, 54, 38);
} */
</style>
