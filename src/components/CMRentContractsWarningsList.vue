<template>
  <UITable
    :headers="headers"
    :count="items.length"
    :loading="isLoading"
    :empty-text="emptyText"
    title="Просроченные договоры аренды"
  >
    <tr v-for="item in items" :key="item.id" :item="item" @click="handleDetails(item)">
      <!-- <td>{{item.id}}</td> -->
      <td class=""><CMRentContractStatus :value="item.status" /></td>
      <td class="">{{ item.fio }}</td>
      <td class="">{{ item.car }}</td>
      <td class="right aligned"><UIMoney :value="item.balance" rub /></td>
    </tr>
  </UITable>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITable from "@/components/UITable.vue";
import CMRentContractStatus from "@/components/CMRentContractStatus.vue";

export default {
  name: "CMRentContractsWarningsList",

  components: {
    UITable,
    CMRentContractStatus,
  },

  props: {
    carId: {
      type: Number,
    },
  },

  data() {
    return {
      items: [],
      isLoading: false,
    };
  },

  computed: {
    headers() {
      return [];
    },
    emptyText() {
      return "Нет просроченных договоров аренды";
    },
  },

  watch: {
    carId: {
      immediate: true,
      handler() {
        this.refetch([2, 4]);
      },
    },
  },

  methods: {
    handleDetails(item) {
      console.log("details clicked: " + item.id);
      if (item.id) {
        this.$router.push({
          name: "contract_rent_details",
          params: { id: item.id },
        });
      }
    },
    // Network
    async refetch(status_arr) {
      this.isLoading = true;

      try {
        this.items = await apiService.getRentContracts(status_arr);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
