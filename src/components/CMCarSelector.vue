<template>
  <div>
    <!-- Select Car -->
    <UIInputSelect
      placeholder="Автомобиль не выбран"
      :clear-button="selectedCar != ''"
      :value="selectedCar"
      :loading="isLoading"
      @button-did-click="modals.browseCars = true"
      @button-clear-did-click="carClear"
    />
    <!--  -->
    <!-- Cars Browser -->
    <BrowseCars
      :active="modals.browseCars"
      :filter-status="[0, 1, 2, 3, 4, 5, 6]"
      @hide="modals.browseCars = false"
      @selected="carSelected"
    />
    <!------->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

import UIInputSelect from "@/components/UIInputSelect.vue";
import BrowseCars from "@/components/BrowseCars.vue";

export default {
  name: "CMCarSelector",

  components: {
    UIInputSelect,
    BrowseCars,
  },

  props: {
    carId: {
      type: Number,
      default: null,
    },
  },

  emits: ["update:carId"], // valueChanged

  data() {
    return {
      car_id: null,
      car: null,
      modals: {
        browseCars: false,
      },
      isLoading: false,
    };
  },

  computed: {
    selectedCar() {
      if (!this.car && this.carId) {
        return this.carId;
      } else if (!this.car) {
        return "";
      } else
        return (
          this.car.brand + " " + this.car.model + " " + this.car.year_of_issue + " [" + this.car.plate_number + "]"
        );
    },
  },

  watch: {
    carId: {
      immediate: true,
      handler(newValue) {
        this.car_id = newValue;

        if (newValue) {
          this.fetchCar(this.car_id);
        }
      },
    },
  },

  methods: {
    carSelected(item) {
      console.log("[CMCarSelector]: carSelected");
      this.car = item;
      this.modals.browseCars = false;
      this.$emit("update:carId", item.id);
    },
    carClear() {
      console.log("[CMCarSelector]: carClear");
      this.car = null;
      this.$emit("update:carId", null);
    },

    // Networking
    async fetchCar(carId) {
      this.isLoading = true;
      try {
        this.car = await apiService.getCar(carId);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
