<template>
  <td class="right aligned" @click.stop="toggleOption()">
    <div class="ui fitted toggle checkbox" :class="{ loading }" style="display: block; margin-left: auto">
      <input type="checkbox" name="public" :checked="checked" />
      <label></label>
    </div>
  </td>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMToggleOnlinePayCell",

  props: {
    contractId: {
      type: Number,
      default: null,
    },
    checked: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      loading: false,
      option_online_pay: false,
    };
  },

  methods: {
    toggleOption() {
      if (this.checked) {
        // set to 0
        this.fetchSetOption(this.contractId, { online_pay: 0 });
      } else {
        // set to 1
        this.fetchSetOption(this.contractId, { online_pay: 1 });
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
