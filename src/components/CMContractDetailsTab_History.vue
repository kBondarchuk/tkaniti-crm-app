<template>
  <CMHistoryStatusList v-if="contract.id" :contract_id="contract.id" style="max-width: 50%" />
</template>

<script>
import CMHistoryStatusList from "@/components/CMHistoryStatusList.vue";

export default {
  name: "CMContractDetailsTabHistory",

  components: {
    CMHistoryStatusList,
  },

  props: {
    contract: {
      type: Object,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
  },
};
</script>
