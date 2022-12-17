import { createApp } from "vue";
// import { createApp, configureCompat } from "vue";
import App from "./App.vue";
import { createStore } from "./store/store";
import { createRouter } from "./router/router";
import GlobalComponents from "@/global_components";
// import "./filters/filters";
import UIService from "./plugins/UIService";
import UIFilters from "./plugins/filters";
import APIService from "./services/api.service.js";

// create store and router instances
const router = createRouter();
const store = createStore(router, import.meta.env);

const app = createApp(App);

// Store
app.use(store);
// Router
app.use(router);
// UI Plugin
app.use(UIService, { app_name: store.state.appName });
// UI Filters
app.use(UIFilters);

// Register global components
GlobalComponents.register(app);

// console.log(store, router);

console.log(
  `%c ${store.state.appName} APP ${store.state.appVersion} %c Detected Vue v${app.version} %c`, // ${Vue.version}
  "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
  "background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
  "background:transparent"
);
console.log(
  `%c Copyright (c) 2019-2022 Konstantin Bondarchuk %c`,
  "background:#35495e ; padding: 1px; border-radius: 3px;  color: #fff",
  "background:transparent"
);
console.log(
  `%c API BASE: %c ${import.meta.env.VUE_APP_API_BASE} %c`,
  "background:#b84541 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
  "background:#fff ; padding: 1px; border-radius: 0 3px 3px 0;  color: #000",
  "background:transparent"
);
console.log("CLIENT ID: " + import.meta.env.VUE_APP_API_CLIENT_ID);
console.log("[main]: APP MODE: " + JSON.stringify(import.meta.env));

// Service Init
APIService.init({
  baseURL: import.meta.env.VUE_APP_API_BASE,
  apiClientId: import.meta.env.VUE_APP_API_CLIENT_ID,
  // Login
  loginCallback: (auth_payload) => {
    // console.log("loginCallback: ", auth_payload);
    store.dispatch("auth/recall", auth_payload);
  },
  // Logoff
  logoutCallback: (test) => {
    console.log("[main]: logoutCallback: ", test);
    store
      .dispatch("auth/logoff")
      .catch(() => {
        console.log("[main]: Double");
      })
      .finally(() => {
        if (router.currentRoute.name != "login" && router.currentRoute.value.fullPath != "/login") {
          // Remember path to go
          console.warn("[MAIN]: Remember path ", JSON.stringify(router.currentRoute.value.fullPath));
          store.commit("setSavedPath", router.currentRoute.value.fullPath);

          router.push({ path: "/login" }).catch((error) => {
            console.info("ROUTER ERROR:", error.message);
          });
        }
      });
  },
});

// ROUTER
// Skip AUTH if in DEV mode ???
// CHECK AUTH
// Load JWT
// const jwt = localStorage.getItem("JWT");

// Load Prefs
store.dispatch("prefs/fetch");

// Load Auth from local storage
// store.dispatch("auth/recall");

router.beforeEach((to, from, next) => {
  // console.warn("[main]: 🔄 START LOADING...");
  // Set loading indicator
  store.commit("setLoadingState", true);

  // if (to.name != "login" && !store.getters["auth/isAuthenticated"]) {
  //   next();
  //   // next("login");
  // } else
  // console.log("router.beforeEach: ", from.name);
  // Check if prev route name is same or not
  if (from.name && to.query.navigate != "back" && from.name != to.name) {
    if (!from.meta.ignoreHistory) {
      store.commit("addRouteName", {
        name: from.path,
      });
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
  // Complete the animation of the route progress bar.
  // NProgress.done()
  // console.warn("[main]: 🔄 STOP LOADING.");
  // Set loading indicator
  store.commit("setLoadingState", false);
});

// VUE
// Vue.config.productionTip = false;

// actually mount to DOM
app.mount("#app");
