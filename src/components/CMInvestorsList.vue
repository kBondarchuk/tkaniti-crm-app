<template>
  <UITableList
    id="investors"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    @header:sort="handleHeaderSort"
  >
    <template v-for="item in items">
      <!--  -->
      <CMInvestorsListItem
        v-if="item.id"
        :key="item.id"
        :item="item"
        @event-details="$emit('eventDetails', item)"
        @event-edit="$emit('eventEdit', item.id)"
        @event-delete="$emit('eventDelete', item.id)"
      />
      <!-- Totals -->
      <tr v-else :key="'total' + item.id">
        <td></td>
        <td class="text-bold">ВСЕГО</td>
        <td class="right aligned text-bold">{{ $filters.money(item.balance) }}</td>
        <td class="right aligned text-bold">{{ $filters.money(item.investments_balance) }}</td>
        <td class="right aligned text-bold">{{ $filters.money(item.interest_balance) }}</td>
        <td></td>
      </tr>
      <!--  -->
    </template>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

import UITableList from "@/components/UITableList.vue";
import CMInvestorsListItem from "@/components/CMInvestorsListItem.vue";

export default {
  name: "CMInvestorsList",

  components: {
    UITableList,
    CMInvestorsListItem,
  },

  props: {
    headerStickedAt: {
      type: Number,
      default: null,
    },
  },
  emits: ["eventDetails", "eventEdit", "eventDelete"],

  data() {
    return {
      headers: [
        { id: "id", name: "No.", class: "" },
        { id: "last_name", name: "ФИО", class: "" },
        // { id: "debet", name: "Инвестиции", class: "right aligned" },
        { id: "balance", name: "Баланс", class: "right aligned" },
        { id: "investments_balance", name: "Инвестиции", class: "right aligned" },
        { id: "interest_balance", name: "Проценты", class: "right aligned" },
        { id: "notes", name: "Примечание", class: "" },
      ],
      items: [],
      isLoading: false,
      filter: {},
    };
  },

  mounted() {
    // this.$store.dispatch("investors/fetchAll");
  },

  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      this.refetch(item);
    },

    // Network
    async refetch(tableFilters) {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestors(tableFilters);
        this.items = result;

        // Get totals
        let totals = await apiService.getInvestorsTotals();
        this.items.push(totals);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async refetchTotals() {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestorsTotals();
        this.items.push(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
