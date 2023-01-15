<template>
  <UITableList
    id="contracts"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="contracts.length"
    :is-loading="isLoading"
    @header:sort="handleHeaderSort"
  >
    <!-- Items -->
    <component
      :is="component"
      v-for="item in contracts"
      :key="item.id"
      :item="item"
      :show-status-date="showStatusDate"
      :sort-by="filter.sort_by"
      @event-details="$emit('eventDetails', item)"
    />
    <!--  -->
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import { arrayEquals } from "@/utils/utils.js";

import CMContractsListItem from "@/components/CMContractsListItem.vue";
import CMContractsListCardItem from "@/components/CMContractsListCardItem.vue";

const HEADERS = [
  { id: "id", name: "No.", class: "right aligned" },
  { id: "status", name: "Статус", class: "" },
  { id: "closing_date", name: "Дата закрытия", class: "" },
  { id: "contract_number", name: "Договор", class: "" },
  // { id: "fio", name: "Клиент", class: "" },
  // [
  { id: "fio", name: "Клиент", class: "" },
  { id: "car", name: "Автомобиль", class: "" },
  // ],

  { id: "photo_report_status", name: "ФО", class: "center aligned" },
  { id: "branch", name: "Филиал", class: "" },
  { id: "city", name: "Город", class: "" },
  // { id: "investor", name: "Инвестор", class: "" },
  {
    id: "contract_total_payout",
    name: "Выкуп. цена",
    class: "right aligned",
  },
  { id: "daily_payment", name: "Платеж", class: "right aligned" },
  { id: "balance", name: "Баланс", class: "right aligned" },
  { id: "option_online_pay", name: "Настр.", class: "right aligned" },
];

export default {
  name: "CMContractsList",

  components: {
    CMContractsListItem,
    CMContractsListCardItem,
  },

  props: {
    contractsStatus: {
      type: Array,
      default: null,
    },
    contractsInvestors: {
      type: Array,
      default: null,
    },
    contractsBranches: {
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
    cardView: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["eventDetails"],

  data() {
    return {
      headers: [],
      contracts: [],
      isLoading: false,
      filter: {},
      showStatusDate: true,
    };
  },

  computed: {
    component() {
      return this.cardView ? "CMContractsListCardItem" : "CMContractsListItem";
    },
  },

  watch: {
    contractsStatus(newValue, oldValue) {
      // console.log(newValue);
      if (!arrayEquals(newValue, oldValue)) {
        this.refetch(this.contractsStatus, this.filter, this.searchString);
      }
    },
    contractsInvestors: {
      handler() {
        this.filter.investors = this.contractsInvestors;
        this.refetch(this.contractsStatus, this.filter, this.searchString);
      },
      deep: true,
    },
    contractsBranches: {
      handler() {
        this.filter.branches = this.contractsBranches;
        this.refetch(this.contractsStatus, this.filter, this.searchString);
      },
      deep: true,
    },
    searchString() {
      this.refetch(this.contractsStatus, this.filter, this.searchString);
    },
  },

  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      this.filter.investors = this.contractsInvestors;
      this.filter.branches = this.contractsBranches;
      if (this.contractsStatus === null) return;
      this.refetch(this.contractsStatus, item, this.searchString);
    },
    generateHeaders(status_arr) {
      // Check if status is 'Closed'
      if (status_arr[0] == 10) {
        console.log("!!!");
        this.headers = HEADERS;
        this.showStatusDate = true;
      } else {
        this.showStatusDate = false;
        this.headers = HEADERS.filter((item) => {
          return item.id != "closing_date";
        });
      }
    },
    async refetch(status_arr, tableFilters, searchString) {
      this.isLoading = true;

      try {
        let result = await apiService.getContracts(status_arr, tableFilters, searchString);
        this.contracts = result;
        this.generateHeaders(status_arr);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
