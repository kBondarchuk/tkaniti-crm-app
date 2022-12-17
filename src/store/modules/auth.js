import apiService from "@/services/api.service.js";

// initial state
const state = {
  payload: null,
  loading: false,
};

// getters
const getters = {
  isAuthenticated: (state) => {
    return state.payload != null;
  },
  isLoading: (state) => {
    return state.loading;
  },
  getAuthData: (state) => {
    return state.payload;
  },
  getAuthRights: (state) => {
    if (state.payload) {
      return state.payload.rights;
    } else {
      return [];
    }
  },
};

// mutations
const mutations = {
  SET_AUTH(state, payload) {
    state.payload = payload;
  },
  SET_LOADING(state, payload) {
    state.loading = payload;
  },
};

// actions
const actions = {
  async login(context, user) {
    console.log("[AUTH]: login: " + user.login);

    // Start loading
    context.commit("SET_LOADING", true);

    // Atempt Login
    try {
      let payload = await apiService.login(user.login, user.password);

      // Set auth payload
      context.commit("SET_AUTH", payload);
      // Save auth payload to local storage
      // localStorage.setItem("AUTH", JSON.stringify(result.payload));
      // Stop loading
      context.commit("SET_LOADING", false);

      if (payload.password_required == 1) {
        return 2; // Need Password Change
      } else {
        return 1; // OK
      }
    } catch (error) {
      // Stop loading
      context.commit("SET_LOADING", false);
      // Reset auth payload
      context.commit("SET_AUTH", null);
      // Remove auth payload
      // localStorage.removeItem("AUTH");
      // console.log("!!!!", error);
      // console.log(error.response.data);
      return Promise.reject(error);
    }
  },

  async logoff(context) {
    console.log("[AUTH]: logoff", this.getters["auth/isAuthenticated"]);

    if (!this.getters["auth/isAuthenticated"]) {
      console.log("[AUTH]: logged off already!");
      return Promise.reject("logged off already");
    }

    context.commit("SET_LOADING", true);

    //
    try {
      let result = await apiService.logoff();
      console.log("[AUTH]: ", result);
      // Reset auth payload
      context.commit("SET_AUTH", null);
      // Remove auth payload
      // localStorage.removeItem("AUTH");
      context.commit("SET_LOADING", false);
      return result.data;
    } catch (error) {
      context.commit("SET_LOADING", false);
      console.log("[AUTH]: !!!!", error);
      return Promise.reject(error);
    }
  },
  recall(context, payload) {
    // console.log("recall auth...");
    // Remove auth payload
    // const payload = JSON.parse(localStorage.getItem("AUTH"));
    context.commit("SET_AUTH", payload);
    console.log("[AUTH]: Got AUTH data: ", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
