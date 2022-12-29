<template>
  <CMHomeManager v-if="checkAuthRole('manager')" />
  <!-- <CMHomeInvestor v-else-if="checkAuthRole('investor')" /> -->
  <TKHomeEmpty v-else />
</template>

<script>
import apiService from "@/services/api.service.js";

import CMHomeManager from "@/components/CMHomeManager.vue";
import TKHomeEmpty from "@/components/TKHomeEmpty.vue";
// import CMHomeInvestor from "@/components/CMHomeInvestor.vue";

export default {
  name: "HomeView",

  components: {
    CMHomeManager,
    TKHomeEmpty,
  },

  mounted() {
    this.ping();
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },

    // Networking
    async ping() {
      try {
        await apiService.ping();
        // console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
  },
};
</script>
