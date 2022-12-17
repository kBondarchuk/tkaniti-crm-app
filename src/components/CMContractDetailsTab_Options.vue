<template>
  <div style="margin-left: 1em">
    <!--  -->
    <UICheckbox
      id="acquiring"
      v-model="acquiring"
      label="Онлайн оплата (Эквайринг)"
      style="margin-bottom: 1em"
      :class="{ disabled: loading['online_pay'] }"
      @update:model-value="changedPayOnline"
    />
    <br />
    <!--  -->
    <UICheckbox
      id="pay_fines"
      v-model="payFines"
      label="Автоматически оплачивать штрафы ГИБДД"
      :class="{ disabled: loading['car_fines_pay'] }"
      @update:model-value="changedPayFine"
    />
    <!--  -->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

import UICheckbox from "@/components/UICheckbox.vue";

export default {
  name: "CMContractDetailsTabOptions",

  components: {
    UICheckbox,
  },

  props: {
    contract: {
      type: Object,
    },
  },

  emits: ["needRefetch"],

  data() {
    return {
      acquiring: false,
      payFines: false,
      //
      loading: {
        car_fines_pay: false,
        online_pay: false,
      },
    };
  },

  watch: {
    contract: {
      immediate: true,
      handler() {
        // console.log("watch: ", this.contract.option_online_pay, this.contract.option_car_fines_pay);
        this.acquiring = this.contract.option_online_pay == 1;
        this.payFines = this.contract.option_car_fines_pay == 1;
      },
    },
  },

  methods: {
    changedPayOnline(newValue) {
      // console.log("A", newValue);
      this.acquiring = newValue;
      this.fetchSetOption(this.contract.id, { online_pay: this.acquiring });
    },
    changedPayFine(newValue) {
      // console.log(newValue);
      this.payFines = newValue;
      this.fetchSetOption(this.contract.id, { car_fines_pay: this.payFines });
    },

    // Network
    async fetchSetOption(contractId, options) {
      const keys = Object.keys(options);
      const values = Array(keys.length).fill(true);
      // const map = new Map([keys, values]);
      const loading = Object.fromEntries(values.map((value, index) => [keys[index], value]));

      this.loading = Object.assign(this.loading, loading);

      // console.warn("+++", this.loading);

      try {
        await apiService.setContractOptions(contractId, options);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }

      // this.loading = false;
      const values_false = Array(keys.length).fill(false);
      // const map = new Map([keys, values]);
      const loading_off = Object.fromEntries(values_false.map((value, index) => [keys[index], value]));

      this.loading = Object.assign(this.loading, loading_off);

      // console.warn("---", this.loading);
      this.$emit("needRefetch");
    },
  },
};
</script>
