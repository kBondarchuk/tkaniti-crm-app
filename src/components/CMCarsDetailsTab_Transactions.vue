<template>
  <div>
    <!-- Toolbar -->
    <div class="ui-tool-bar-local">
      <UIButton
        type="right labeled"
        text="Внести расход"
        icon="right chevron"
        :class="{ disabled: car.ref_car_status != 1 && car.ref_car_status != 2 && car.ref_car_status < 5 }"
        @click="actionNewExpense"
      />
      <UIButton
        type="right labeled"
        text="Внести продажи"
        icon="right chevron"
        :class="{ disabled: car.ref_car_status != 1 && car.ref_car_status != 2 && car.ref_car_status < 5 }"
        @click="actionNewIncome"
      />
    </div>
    <div class="ui divider"></div>
    <!-- /Toolbar -->

    <!-- Grid -->
    <div class="ui grid">
      <!-- Fist Column -->
      <div class="twelve wide column">
        <!-- List -->
        <!-- <CMTransactionsList :car_id="car.id" :show-branch="true" /> -->
        <CMOperationsList
          operations-type="cars"
          :operations-subject-id="car.id"
          :show-basis="true"
          :show-branch="true"
        />
      </div>
      <div class="four wide column">
        <!-- Totals -->
        <CMExpensesTotalsList :car-id="car.id" group-branches />
        <CMSalesTotalsList :car-id="car.id" />
      </div>
    </div>
    <!-- /Grid -->
  </div>
</template>

<script>
import UIButton from "@/components/UIButton.vue";
import CMExpensesTotalsList from "@/components/CMExpensesTotalsList.vue";
import CMSalesTotalsList from "@/components/CMSalesTotalsList.vue";
import CMOperationsList from "@/components/CMOperationsList.vue";

export default {
  name: "CMCarsDetailsTabTransactions",

  components: {
    UIButton,
    CMExpensesTotalsList,
    CMOperationsList,
    CMSalesTotalsList,
  },

  props: {
    car: {
      type: Object,
    },
  },

  methods: {
    actionNewExpense() {
      this.$router.push({
        name: "budget_request_new",
        query: { car_id: this.car.id },
        params: { request_type: "expense" },
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
