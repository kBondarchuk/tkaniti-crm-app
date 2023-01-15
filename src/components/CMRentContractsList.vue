<template>
  <UITableList
    id="rent_contracts"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="contracts.length"
    :is-loading="isLoading"
    @header:sort="handleHeaderSort"
  >
    <!-- Items -->
    <CMRentContractsListItem
      v-for="item in contracts"
      :key="item.id"
      :item="item"
      @event-details="$emit('eventDetails', item)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import { arrayEquals } from "@/utils/utils.js";

import CMRentContractsListItem from "@/components/CMRentContractsListItem.vue";

export default {
  name: "CMRentContractsList",
  components: {
    CMRentContractsListItem,
  },
  props: {
    contractsStatus: {
      type: Array,
      default: null,
    },
    headerStickedAt: {
      type: Number,
      default: null,
    },
    searchString: {
      type: String,
      default: null,
    },
  },
  emits: ["eventDetails"],
  data() {
    return {
      headers: [
        { id: "id", name: "No.", class: "right aligned" },
        { id: "status", name: "Статус", class: "" },
        { id: "contract_number", name: "Договор", class: "" },
        { id: "fio", name: "Клиент", class: "" },
        { id: "car", name: "Автомобиль", class: "" },
        { id: "city", name: "Город", class: "" },
        { id: "branch", name: "Филиал", class: "" },
        // { id: "investor", name: "Инвестор", class: "" },
        // { id: "contract_pledge", name: "Залог", class: "right aligned" },
        { id: "daily_payment", name: "Платеж", class: "right aligned" },
        { id: "current_debt", name: "Начислено", class: "right aligned" },
        { id: "pledge_balance", name: "Залог", class: "right aligned" },
        { id: "balance", name: "Баланс", class: "right aligned" },
        { id: "prepayed_days", name: "Дней", class: "right aligned" },
        // { id: "option_online_pay", name: "Эквайр.", class: "right aligned" },
      ],
      contracts: [],
      isLoading: false,
      filter: {},
    };
  },
  watch: {
    contractsStatus(newValue, oldValue) {
      // console.log(newValue);
      if (!arrayEquals(newValue, oldValue)) {
        this.refetch(this.contractsStatus, this.filter, this.searchString);
      }
    },
    searchString() {
      this.refetch(this.contractsStatus, this.filter, this.searchString);
    },
  },
  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      if (this.contractsStatus === null) return;
      this.refetch(this.contractsStatus, item, this.searchString);
    },
    async refetch(status_arr, tableFilters, searchString) {
      this.isLoading = true;

      try {
        let result = await apiService.getRentContracts(status_arr, tableFilters, searchString);
        this.contracts = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
