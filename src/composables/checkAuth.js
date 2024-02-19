// checkAuth.js
// import { useAuthStore } from "@/stores/auth";
import { useStore } from "vuex";

export function useCheckAuth(options) {
  /// SETUP

  // const authStore = useAuthStore();
  const store = useStore();

  /// FUNCTIONS

  function checkAuthRole(role) {
    return store.getters["auth/getAuthRights"].includes(role);
  }

  /// RUN

  // expose managed state as return value
  return { checkAuthRole };
}
