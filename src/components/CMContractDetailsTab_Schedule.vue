<template>
  <!-- Live Schedule -->
  <CMLiveScheduleList v-if="contract.id" :contract_id="contract.id" :current_period="contract.current_period" />
  <!-- /Live Schedule -->
</template>

<script>
import CMLiveScheduleList from "@/components/CMLiveScheduleList.vue";

export default {
  name: "CMContractDetailsTabSchedule",

  components: {
    CMLiveScheduleList,
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
