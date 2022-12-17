<template>
  <!-- Select Car -->
  <UIInputSelect
    v-show="!hide"
    v-bind="$attrs"
    label="Автомобиль"
    placeholder="Автомобиль не выбран"
    :value="car?._car_name"
    :loading="isLoading"
    @button-did-click="openBrowser = !openBrowser"
  />
  <!-- New Cars Browser -->
  <BrowseCars :active="openBrowser" :filter-status="filterStatus" @hide="openBrowser = false" @selected="selected" />
</template>

<script>
import apiService from "@/services/api.service.js";

import UIInputSelect from "@/components/UIInputSelect.vue";
import BrowseCars from "@/components/BrowseCars.vue";

export default {
  name: "CUISelectCar",

  components: {
    UIInputSelect,
    BrowseCars,
  },

  props: {
    carId: {
      type: Number,
      default: null,
    },
    filterStatus: {
      type: Array,
      default: null,
    },
    hide: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["selected"],

  data() {
    return {
      car: null,
      openBrowser: false,
      isLoading: false,
    };
  },

  watch: {
    carId: {
      immediate: true,
      async handler(newValue) {
        // console.warn("[CUISelectCar]  watch carId: ", newValue);

        if (!newValue) return;

        await this.reload(newValue);
      },
    },
  },

  methods: {
    async selected(item) {
      this.openBrowser = false;
      this.reload(item.id);
    },

    async reload(car_id) {
      await this.fetchCar(car_id);
      this.$emit("selected", this.car);
    },

    async fetchCar(car_id) {
      this.isLoading = true;
      try {
        this.car = await apiService.getCar(car_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },

  // EOF
};
</script>
