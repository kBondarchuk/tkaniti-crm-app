<template>
  <!-- Юр. лицо -->
  <UIInputDropdown v-bind="$attrs" label="Юр. лицо" :options="optionsCompany" @update:model-value="selected" />
</template>

<script>
import apiService from "@/services/api.service.js";

import UIInputDropdown from "@/components/UIInputDropdown.vue";

export default {
  name: "CUISelectCompany",

  components: {
    UIInputDropdown,
  },

  // props: {
  //   filterBranchId: {
  //     type: Number,
  //     default: null,
  //   },
  // },

  emits: ["selected"],

  data() {
    return {
      // title: null,
      // selectedId: null,
      companies: [],
      // selectedCompany: null,
    };
  },

  computed: {
    optionsCompany() {
      let menu = [{ name: "Не выбрано", value: null }].concat(
        this.companies.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
  },

  created() {
    this.fetchCompanies();
  },

  methods: {
    selected(id) {
      const item = this.companies.find((item) => item.id == id);
      this.$emit("selected", item);
      this.openBrowser = false;
    },

    // Networking
    async fetchCompanies() {
      this.isLoading = true;
      try {
        this.companies = await apiService.getCompanies();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  // EOF
};
</script>
