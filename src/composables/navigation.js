// navigation.js
import { useRouter } from "vue-router";

import { navigation } from "@/router/navigation.gen";

export function useNavigation(options) {
  /// SETUP

  const router = useRouter();

  /// DATA

  const navigateTo = navigation(router);

  /// EXPOSE
  return { navigateTo };
}
