<template>
  <div>
    <div class="ui hidden divider"></div>
    <div class="ui grid">
      <!-- Totals -->
      <CMCarTotalsList :car-id="car.id" />

      <div v-if="checkAuthRole('admin')">
        <div>
          <CMExpensesTotalsList :car-id="car.id" />
        </div>
        <CMSalesTotalsList :car-id="car.id" />
        <CMIncomeTotalsList :car-id="car.id" />
      </div>
    </div>
  </div>
</template>

<script>
import CMExpensesTotalsList from "@/components/CMExpensesTotalsList.vue";
import CMIncomeTotalsList from "@/components/CMIncomeTotalsList.vue";
import CMSalesTotalsList from "@/components/CMSalesTotalsList.vue";
import CMCarTotalsList from "@/components/CMCarTotalsList.vue";

export default {
  name: "CMCarsDetailsTabTotals",

  components: {
    CMExpensesTotalsList,
    CMIncomeTotalsList,
    CMSalesTotalsList,
    CMCarTotalsList,
  },

  props: {
    car: {
      type: Object,
    },
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
    actionNewExpense() {
      this.$router.push({
        name: "budget_request_new",
        query: { car_id: this.car.id },
      });
    },
    actionNewIncome() {
      this.$router.push({
        name: "budget_request_new",
        query: { car_id: this.car.id },
        params: { request_type: "income" },
      });
    },
  },
};
</script>
