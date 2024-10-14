<template>
  <UITransition mode="out-in" appear>
    <div class="login">
      <div class="ui middle aligned center aligned grid">
        <div class="column">ВЫХОД...</div>
      </div>
    </div>
  </UITransition>
</template>

<script setup>
// name: "LogoffView",

import { useNavigation } from "@/composables/navigation";
import { useAuthStore } from "@/stores/auth";

/// SETUP

const { navigateTo } = useNavigation();
const authStore = useAuthStore();

/// RUN

authStore
  .logoff()
  .then((status) => {
    console.log("[LOGOFF]: success: " + status.message);
    navigateTo.Login();
  })
  .catch(() => {
    navigateTo.Login();
  });
</script>

<style scoped>
.login {
  background-color: rgba(218, 218, 218, 0.185);
  height: 100%;
  min-height: 100vh;
}
.grid {
  height: 100%;
  min-height: 100vh;
  margin: 0;
}
.column {
  max-width: 14em;
}
</style>
