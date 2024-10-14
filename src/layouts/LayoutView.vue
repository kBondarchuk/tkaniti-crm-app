<template>
  <div id="layout" class="wrapper">
    <CMMainMenu />

    <router-view v-if="authStore.isAuthenticated" />
    <div
      v-else
      class="ui-layout"
      style="background-color: #76767624; display: flex; justify-content: center; align-items: center"
    >
      <span>Loading...</span>
    </div>

    <LayoutFooter />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import CMMainMenu from "@/components/CMMainMenu.vue";
import LayoutFooter from "@/layouts/LayoutFooter.vue";

/// SETUP

const authStore = useAuthStore();
</script>
