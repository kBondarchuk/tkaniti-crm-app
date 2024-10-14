import { defineStore, acceptHMRUpdate } from "pinia";
import apiService from "@/services/api.service.js";

export const useAuthStore = defineStore("auth", {
  /// STATE

  state: () => {
    return {
      payload: null,
      loading: false,
    };
  },

  /// GETTERS

  getters: {
    isAuthenticated(state) {
      return state.payload != null;
    },
    isLoading(state) {
      return state.loading;
    },
    getAuthData(state) {
      return state.payload;
    },
    getAuthRights(state) {
      return state.payload ? state.payload.rights : [];
    },
  },

  /// ACTIONS

  actions: {
    async login(user) {
      console.log("[AuthStore]: login: " + user.login);

      // Start loading
      this.loading = true;

      // Atempt Login
      try {
        // Set auth payload
        this.payload = await apiService.login(user.login, user.password);

        if (this.payload.password_required == 1) {
          return 2; // Need Password Change
        } else {
          return 1; // OK
        }
      } catch (error) {
        // Reset auth payload
        this.payload = null;
        throw error;
      } finally {
        // Stop loading
        this.loading = false;
      }
    },
    async logoff() {
      console.log("[AuthStore]: logoff", this.isAuthenticated, this.isLoading);

      if (this.isLoading) {
        console.log("[AuthStore]: logging out in progress!");
        return Promise.reject("logging out in progress");
      }

      if (!this.isAuthenticated) {
        console.log("[AuthStore]: logged off already!");
        return Promise.reject("logged off already");
      }

      this.loading = true;

      //
      try {
        await apiService.logout();
        let result = await apiService.logoff();
        console.log("[AuthStore]: ", result);
        // Reset auth payload
        this.payload = null;
        return result.data;
      } catch (error) {
        console.warn("[AuthStore]: !!!!", error);
        return Promise.reject(error);
      } finally {
        this.loading = false;
      }
    },
    async logoffForced() {
      console.log("[AuthStore]: logoff forced", this.isAuthenticated, this.isLoading);
      // Reset auth payload
      this.payload = null;
    },
    setAuthData(payload) {
      this.payload = payload;
      console.log("[AuthStore]: Got AUTH data: ", payload);
    },
    checkAuthRole(role) {
      return this.getAuthRights.includes(role);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
