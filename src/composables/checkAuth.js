// checkAuth.js
import { useAuthStore } from "@/stores/auth";

export function useCheckAuth(options) {
  /// SETUP

  const authStore = useAuthStore();

  /// FUNCTIONS

  function checkAuthRole(role) {
    return authStore.checkAuthRole(role);
  }

  /// RUN

  // expose managed state as return value
  return { checkAuthRole };
}
