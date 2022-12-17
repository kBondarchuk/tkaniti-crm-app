// import Vue from "vue";
// import Vuex from "vuex";
import { createStore as _createStore } from "vuex";
import investors from "./modules/investors.js";
// import investments from "./modules/investments.js";
// import contracts from "./modules/contracts.js";
import auth from "./modules/auth.js";
// import expenses from "./modules/expenses.js";
import prefs from "./modules/prefs.js";
import * as config from "../../package.json";
const APP_VERSION = config.version;

// Vue.use(Vuex);

export function createStore(router, env) {
  return _createStore({
    state: {
      title: "",
      subTitle: "",
      appName: "TKANITI.CRM",
      appVersion: "v" + APP_VERSION,
      url_download_base: env.VUE_APP_DOWNLOAD_BASE,
      routesHistory: [],
      routerSavedPath: null,
      globalLoading: false,
      siteHost: document.location.host,
      staticHost: env.VUE_APP_STATIC_HOST,
    },
    mutations: {
      setTitle(state, payload) {
        state.title = payload.title;
        state.subTitle = payload.subTitle;
      },
      addRouteName(state, payload) {
        state.routesHistory.push(payload.name);
      },
      removeLastRouteName(state) {
        state.routesHistory.pop();
      },
      setLoadingState(state, payload) {
        state.globalLoading = payload;
      },
      setSavedPath(state, payload) {
        state.routerSavedPath = payload;
      },
    },
    getters: {
      getLastRoutePath: (state) => {
        return state.routesHistory[state.routesHistory.length - 1];
      },
      getLoadingState: (state) => {
        return state.globalLoading;
      },
      getSavedPath: (state) => {
        return state.routerSavedPath;
      },
      getStaticPrefix: (state) => {
        const regexp = /^(.*)\..*\./;
        const match = state.siteHost.match(regexp);
        console.warn("static prefix:", match);

        return match[1];
      },
    },
    actions: {},
    modules: {
      investors,
      // investments,
      auth,
      // contracts,
      // expenses,
      prefs,
    },
  });
}
