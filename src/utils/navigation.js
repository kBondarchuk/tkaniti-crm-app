function setNavigation(router, uiStore, authStore) {
  // ROUTER NAVIGATION
  router.beforeEach((to, from, next) => {
    // console.warn("[main]: 🔄 START LOADING...");
    uiStore.globalLoading = true;

    // Check if prev route name is same or not
    // Do not remember if it was back already
    /*
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
    */
    // check auth
    if (to.name == "login" && authStore.isAuthenticated) {
      next("/");
    } else {
      next();
    }
  });

  router.afterEach((to, from) => {
    // console.warn("[main]: 🔄 STOP LOADING.");
    uiStore.globalLoading = false;
  });
}

function navigateBack(router, pathName) {
  const lastRoutePath = router.options.history.state.back;
  const currentRoutePath = router.currentRoute.value.fullPath;
  console.warn(lastRoutePath, currentRoutePath, router.options.history);

  // If no history left
  if (lastRoutePath == null) {
    router.push({ name: pathName });
  }
  // If previous path the same as current
  else if (lastRoutePath == currentRoutePath) {
    if (window.history.length > 2) {
      router.go(-2);
    } else {
      router.push({ name: pathName });
    }
  } else {
    router.go(-1);
  }
}

export { setNavigation, navigateBack };
