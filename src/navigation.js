function setNavigation(router, store) {
  // ROUTER NAVIGATION
  router.beforeEach((to, from, next) => {
    // console.warn("[main]: 🔄 START LOADING...");
    store.commit("setLoadingState", true);

    // Check if prev route name is same or not
    // Do not remember if it was back already
    if (from.name && to.query.navigate != "back" && from.name != to.name) {
      // Do not remember if ignoreHistory set to true
      if (!from.meta.ignoreHistory) {
        // Do not remember if same group
        if (to.meta.historyGroup == undefined || from.meta.historyGroup != to.meta.historyGroup) {
          store.commit("addRouteName", {
            name: from.path,
          });
        }
      }
    }
    //remove query navigate data
    if (to.query.navigate == "back") {
      delete to.query["navigate"];
    }
    // check auth
    if (to.name == "login" && store.getters["auth/isAuthenticated"]) {
      next("/");
    } else {
      next();
    }
  });

  router.afterEach((to, from) => {
    // console.warn("[main]: 🔄 STOP LOADING.");
    store.commit("setLoadingState", false);
  });
}

function navigateBack(router, store, pathName, force = false) {
  if (force) {
    router.push({ name: pathName });
    return;
  }

  const lastRoutePath = store.getters["getLastRoutePath"];
  const currentRoutePath = router.currentRoute.path;

  if (lastRoutePath && lastRoutePath != currentRoutePath) {
    console.log("<< Return to : ", lastRoutePath);
    store.commit("removeLastRouteName");
    router.push({ path: lastRoutePath, query: { navigate: "back" } });
  } else {
    console.log("<< Return to : ", pathName);
    router.push({ name: pathName });
  }
}

export { setNavigation, navigateBack };
