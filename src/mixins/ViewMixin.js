export const viewMixin = {
  data: function () {
    return {
      view: { title: "-", subTitle: "-" },
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
  },
};
