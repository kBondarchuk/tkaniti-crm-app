<template>
  <!-- Select Customer -->
  <UIInputSelect
    v-bind="$attrs"
    label="Клиент"
    placeholder="Клиент не выбран"
    :value="customer?._fio_short"
    @button-did-click="openBrowser = true"
  />
  <!-- New Customers Browser -->
  <BrowseCustomers
    :active="openBrowser"
    :filter-branch-id="filterBranchId"
    @hide="openBrowser = false"
    @selected="selected"
  />
</template>

<script>
import apiService from "@/services/api.service.js";

import UIInputSelect from "@/components/UIInputSelect.vue";
import BrowseCustomers from "@/components/BrowseCustomers.vue";

export default {
  name: "CUISelectCustomer",

  components: {
    UIInputSelect,
    BrowseCustomers,
  },

  props: {
    customerId: {
      type: Number,
      default: null,
    },
    filterBranchId: {
      type: Number,
      default: null,
    },
    // multipleSelection: {
    //   type: Boolean,
    //   default: false,
    // },
    // selectedCustomers: {
    //   type: Array,
    //   default: () => [],
    // },
  },

  emits: ["selected"],

  data() {
    return {
      customer: null,
      openBrowser: false,
    };
  },

  watch: {
    customerId: {
      immediate: true,
      async handler(newValue) {
        // console.warn("[CUISelectCustomer] watch customerId: ", newValue);

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

    async reload(customer_id) {
      await this.fetchCustomer(customer_id);
      this.$emit("selected", this.customer);
    },

    async fetchCustomer(customer_id) {
      this.isLoading = true;
      try {
        this.customer = await apiService.getCustomer(customer_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },

  // EOF
};
</script>
