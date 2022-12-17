<template>
  <!-- <td class="right aligned" @click.stop="toggleOption(option)"> -->
  <!-- <div class="ui fitted toggle checkbox" :class="{ loading }" style="display: block; margin-left: auto">
      <input type="checkbox" name="public" :checked="checked" />
      <label></label>
    </div> -->
  <UICheckbox
    :id="'option_' + option"
    :model-value="checked"
    style="margin-top: 4.5px"
    @update:model-value="toggleOption"
  />
  <!-- </td> -->
</template>

<script>
import apiService from "@/services/api.service.js";

import UICheckbox from "@/components/UICheckbox.vue";

export default {
  name: "CMCheckboxContractOption",

  components: {
    UICheckbox,
  },

  props: {
    contractId: {
      type: Number,
      default: null,
    },
    checked: {
      type: Number,
      default: null,
    },
    option: {
      type: String,
      default: null,
      requred: true,
    },
  },

  data() {
    return {
      loading: false,
      // option_value: false,
    };
  },

  methods: {
    toggleOption(value) {
      if (value) {
        // set to 0
        this.fetchSetOption(this.contractId, { [this.option]: 1 });
      } else {
        // set to 1
        this.fetchSetOption(this.contractId, { [this.option]: 0 }); // online_pay
      }
    },

    // Network
    async fetchSetOption(contractId, value) {
      this.loading = true;
      try {
        await apiService.setContractOptions(contractId, value);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.loading = false;
    },
  },
};
</script>
