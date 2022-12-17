<template>
  <!-- Grid -->
  <div class="ui grid">
    <!-- fist column -->
    <div class="eight wide column">
      <!-- Table -->
      <CMCarDetails :car="car" />
      <!-- /Table -->
    </div>
    <!-- second column -->
    <div class="eight wide second column">
      <!-- Table -->
      <CMCustomersContractsList :car_id="car.id" />
      <!-- Car Fines -->
      <CMCarFinesTotalsList v-if="checkAuthRole('manager')" :car-id="car.id" />
      <!-- Warnings -->
      <CMWarningsList v-if="car.id && checkAuthRole('manager')" :car-id="car.id" style="margin-top: 1em" />
      <!--  -->
    </div>
  </div>
</template>

<script>
import CMCarDetails from "@/components/CMCarDetails.vue";
import CMCustomersContractsList from "@/components/CMCustomersContractsList.vue";
import CMWarningsList from "@/components/CMWarningsList.vue";
import CMCarFinesTotalsList from "@/components/CMCarFinesTotalsList.vue";

export default {
  name: "CMCarsDetailsTabGeneral",

  components: {
    CMCarDetails,
    CMCustomersContractsList,
    CMWarningsList,
    CMCarFinesTotalsList,
  },

  props: {
    car: {
      type: Object,
      default: null,
    },
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
  },
};
</script>
