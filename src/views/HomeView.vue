<template>
  <CMHomeManager v-if="authStore.checkAuthRole('manager')" />
  <!-- <CMHomeInvestor v-else-if="checkAuthRole('investor')" /> -->
  <TKHomeEmpty v-else />
</template>

<script setup>
import apiService from "@/services/api.service.js";

import CMHomeManager from "@/components/CMHomeManager.vue";
import TKHomeEmpty from "@/components/TKHomeEmpty.vue";
import { useAuthStore } from "@/stores/auth";

// name: "HomeView",

/// SETUP
const authStore = useAuthStore();

/// FUNCTIONS

// function checkAuthRole(role) {
//   return authStore.getAuthRights.includes(role);
// }

// Networking
async function ping() {
  try {
    await apiService.ping();
    // console.log(result);
  } catch (error) {
    // console.error(error);
    // this.$UIService.showNetworkError(error);
  }
}

/// RUN

ping();
</script>
