export const TabsMixin = {
  methods: {
    // Tabs
    parseTabs(menuItems) {
      const parsedMenu = [];

      menuItems.forEach((item) => {
        if (this.checkTabItem(item)) {
          item.disabled = false;
          parsedMenu.push(item);
        } else {
          item.disabled = true;
          parsedMenu.push(item);
        }
        return true;
      });
      return parsedMenu;
    },
    checkTabItem(item) {
      return this.checkAuthRole(item.access) || item.access === undefined;
    },
    createTabs(kTABS) {
      if (!kTABS) return;
      // console.log("<<<", kTABS);

      this.tabs = this.parseTabs(kTABS);

      // if (!this.checkAuthRole("operations")) {
      //   this.tabs = this.tabs.filter((item) => item.id !== "transactions");
      // }

      // console.log(">>>", this.tabs);
    },
  },
};
