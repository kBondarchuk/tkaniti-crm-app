import { createStore as _createStore } from "vuex";
import auth from "./modules/auth.js";
import * as config from "../../package.json";
const APP_VERSION = config.version;

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
        // console.warn("static prefix:", match);

        return match[1];
      },
    },
    actions: {},
    modules: {
      auth,
    },
  });
}
