import { createApp } from "vue";
// import { createApp, configureCompat } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createRouter } from "%/router/router";
import { setNavigation } from "./utils/navigation";
import GlobalComponents from "@/global_components";
import UIService from "./plugins/UIService";
import UIFilters from "./plugins/filters";
import APIService from "./services/api.service.js";
import UIComponents from "@kbond/vue-ui";
import "@kbond/vue-ui/dist/style.css";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/auth";
import * as config from "../package.json";

const APP_PRESETS = { app_name: "TKANITI.CRM", app_version: "v" + config.version };

// create store and router instances
const router = createRouter();
const pinia = createPinia();

const app = createApp(App);

// Store
app.use(pinia);
// Router
app.use(router);
// UI Plugin
app.use(UIService, APP_PRESETS);
// UI Filters
app.use(UIFilters);
// UI Components
app.use(UIComponents);
// Register global components
GlobalComponents.register(app);

// Provite app presets
app.provide("APP_PRESETS", APP_PRESETS);

// Setup Store
const uiStore = useUiStore();
uiStore.appName = APP_PRESETS.app_name;
uiStore.urlDownloadBase = import.meta.env.VUE_APP_DOWNLOAD_BASE;

const authStore = useAuthStore();

console.log(
  `%c ${APP_PRESETS.app_name} APP ${APP_PRESETS.app_version} %c Detected Vue v${app.version} %c`, // ${Vue.version}
  "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
  "background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
  "background:transparent",
);
console.log(
  `%c Copyright (c) 2019-2024 Konstantin Bondarchuk %c`,
  "background:#35495e ; padding: 1px; border-radius: 3px;  color: #fff",
  "background:transparent",
);
console.log(
  `%c API BASE: %c ${import.meta.env.VUE_APP_API_BASE} %c`,
  "background:#b84541 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
  "background:#fff ; padding: 1px; border-radius: 0 3px 3px 0;  color: #000",
  "background:transparent",
);
console.log("CLIENT ID: " + import.meta.env.VUE_APP_API_CLIENT_ID);
console.warn("[main]: APP MODE: ", import.meta.env.MODE);
console.dir(import.meta.env);

function savePathAndGoLogin() {
  if (
    router.currentRoute.name != "login" &&
    router.currentRoute.value.fullPath != "/login" &&
    router.currentRoute.name != "logoff" &&
    router.currentRoute.value.fullPath != "/logoff"
  ) {
    // Remember path to go
    console.warn("[MAIN]: Remember path ", JSON.stringify(router.currentRoute.value.fullPath));
    uiStore.setSavedPath(router.currentRoute.value.fullPath);

    router.push({ path: "/login" }).catch((error) => {
      console.info("ROUTER ERROR:", error.message);
    });
  }
}

function savePathAndGoLogin2() {
  const path = window.location.pathname;

  if (path != "/login" && path != "/logoff") {
    // Remember path to go
    console.warn("[MAIN]: Remember path ", JSON.stringify(path));
    uiStore.setSavedPath(path);

    router.push({ path: "/login" }).catch((error) => {
      console.warn("ROUTER ERROR:", error.message);
    });
  }
}

// Service Init
APIService.init({
  baseURL: import.meta.env.VUE_APP_API_BASE,
  apiClientId: import.meta.env.VUE_APP_API_CLIENT_ID,
  // Refresh token callback
  loginCallback: (auth_payload) => {
    console.warn("[MAIN]: loginCallback: ", auth_payload);
    authStore.setAuthData(auth_payload);
  },
  // Logoff
  logoutCallback: (params) => {
    console.warn("[MAIN]: logoutCallback: ", params);
    authStore.logoffForced();
    savePathAndGoLogin();
  },
});

// If no refresh token saved go to Login page
console.info("[MAIN] API init result:", APIService.refreshToken?.slice(-10));
if (!APIService.refreshToken) {
  savePathAndGoLogin2();
}

// SETUP ROUTER NAVIGATION
setNavigation(router, uiStore, authStore);

// VUE
// Vue.config.productionTip = false;

// actually mount to DOM
app.mount("#app");
