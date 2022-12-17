<template>
  <!-- Page 1 -->
  <div class="ui stackable grid">
    <!-- Fist Column -->
    <div class="eight wide column">
      <!-- Contract Details -->
      <!-- <UITransition mode="out-in" appear> -->
      <CMContractDetails :preloaded-contract="contract" :is-loading-external="isLoading" />
      <!-- </UITransition> -->
      <!-- Car Fines -->
      <CMCarFinesTotalsList v-if="checkAuthRole('manager')" :contract-id="contract.id" />
      <!-- warnings -->
      <CMWarningsList
        v-if="contract.car_id > 0 && checkAuthRole('manager')"
        :car-id="contract.car_id"
        style="margin-top: 1em"
      />
      <!-- /warnings -->
    </div>

    <!-- Second column -->
    <div class="eight wide column">
      <!-- Car Details -->
      <CMCarDetailsWidget :car-id="contract.car_id" />
      <!-- Customer Details -->
      <CMCustomerDetailsWidget v-if="checkAuthRole('manager')" :customer_id="contract.customer_id" />
    </div>
  </div>
  <!-- /Page 1 -->
</template>

<script>
import CMContractDetails from "@/components/CMContractDetails.vue";
import CMWarningsList from "@/components/CMWarningsList.vue";
import CMCustomerDetailsWidget from "@/components/CMCustomerDetailsWidget.vue";
import CMCarDetailsWidget from "@/components/CMCarDetailsWidget.vue";
import CMCarFinesTotalsList from "@/components/CMCarFinesTotalsList.vue";

export default {
  name: "CMContractDetailsTabGeneral",

  components: {
    CMContractDetails,
    CMWarningsList,
    CMCarDetailsWidget,
    CMCustomerDetailsWidget,
    CMCarFinesTotalsList,
  },

  props: {
    contract: {
      type: Object,
      default: null,
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
