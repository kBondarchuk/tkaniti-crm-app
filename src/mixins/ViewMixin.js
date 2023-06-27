export const viewMixin = {
  data: function () {
    return {
      view: { title: "-", subTitle: "-" },
      viewShowSideMenu: true,
      viewSideMenuSelectedId: 999,
    };
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
    back(name) {
      const lastRoutePath = this.$store.getters["getLastRoutePath"];
      const currentRoutePath = this.$router.currentRoute.path;

      if (lastRoutePath && lastRoutePath != currentRoutePath) {
        console.log("<< Return to : ", lastRoutePath);
        this.$store.commit("removeLastRouteName");
        this.$router.push({ path: lastRoutePath, query: { navigate: "back" } });
      } else {
        console.log("<< Return to : ", name);
        this.$router.push({ name });
      }
    },
    viewToggleSideMenu() {
      this.viewShowSideMenu = !this.viewShowSideMenu;
      localStorage.setItem(this.$options.name + ".list.show_side_menu", this.viewShowSideMenu);
    },
    viewSideMenuSelected(id) {
      console.warn("[ViewMixin]: viewSideMenuSelected", id);
    },
  },

  created() {
    // Load saved params
    this.viewShowSideMenu = JSON.parse(localStorage.getItem(this.$options.name + ".list.show_side_menu")) ?? true;
    const selected_menu_params = localStorage.getItem(this.$options.name + ".list.selected_menu");

    if (selected_menu_params) {
      console.log("->", selected_menu_params);
      this.viewSideMenuSelectedId = JSON.parse(selected_menu_params);
    } else {
      this.viewSideMenuSelectedId = null;
    }
  },

  mounted() {
    this.$store.commit("setTitle", {
      title: this.view.title,
      subTitle: this.view.subTitle,
    });
    this.$UIService.setHtmlTitle(this.view.title);
  },

  watch: {
    "view.title": function () {
      this.$store.commit("setTitle", {
        title: this.view.title,
        subTitle: this.view.subTitle,
      });
      this.$UIService.setHtmlTitle(this.view.title);
    },
    "view.subTitle": function () {
      this.$store.commit("setTitle", {
        title: this.view.title,
        subTitle: this.view.subTitle,
      });
    },
    viewSideMenuSelectedId: {
      immediate: false,
      handler(newValue) {
        localStorage.setItem(this.$options.name + ".list.selected_menu", newValue);
        this.viewSideMenuSelected(newValue);
      },
    },
  },
};
