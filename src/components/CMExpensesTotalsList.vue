<template>
  <UITableList
    id="CMExpensesTotalsList"
    :headers="headers"
    :items-count="items.length"
    :is-loading="isLoading"
    no-sort
    bordered
    not-selectable
  >
    <!-- Body -->
    <template v-for="(item, index) in items">
      <tr v-if="items[index - 1] ? items[index - 1].branch != item.branch && item.branch : true" :key="index + 'head'">
        <th colspan="2" class="gray_bg border-bottom">{{ item.branch }}</th>
      </tr>
      <tr v-if="item.branch || item.category_name" :key="index">
        <td style="padding-left: 1em">{{ item.category_name || "Всего по филиалу" }}</td>
        <td class="right aligned nobr" :class="{ 'text-bold': !item.category_name }">
          {{ $filters.money(item.total) }}
        </td>
      </tr>
    </template>
    <!-- Footer -->
    <template #tooter>
      <tr>
        <th>
          <span class="text-bold">Итог по всем филиалам</span>
        </th>
        <th class="right aligned">
          <span v-if="records[records.length - 1]" class="text-bold">
            {{ $filters.money(records[records.length - 1].total) }}
          </span>
        </th>
      </tr>
    </template>
    <!--  -->
  </UITableList>
  <!--  -->
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMExpensesTotalsList",
  components: {},
  props: {
    investorId: {
      type: Number,
      required: false,
      default: null,
    },
    carId: {
      type: Number,
      required: false,
    },
    groupBranches: {
      type: Boolean,
      default: false,
    },
    showGeneral: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      records: [],
      isLoading: false,
    };
  },
  computed: {
    items() {
      return this.records.filter(() => true); // => el.category_name != null);
    },
    headers() {
      return [{ name: "Затраты по категориям" }, { name: "Сумма", class: "right aligned" }];
    },
  },
  watch: {
    investorId: {
      immediate: true,
      handler(newValue) {
        // newValue, oldValue
        if (newValue === null) return;
        if (newValue === undefined) return;
        console.log("fetching expenses totals for investor: " + this.investorId);
        this.fetchTotalsForInvestor(this.investorId);
      },
    },
    carId: {
      immediate: true,
      handler(newValue) {
        // newValue, oldValue
        if (isNaN(newValue) || this.investorId) return;
        console.log("fetching expenses totals for car: " + this.carId);

        this.fetchTotalsForCar(this.carId);
      },
    },
    showGeneral: {
      immediate: false,
      handler(newValue) {
        // newValue, oldValue
        console.log("fetching totals general: " + newValue);

        if (newValue) {
          this.fetchTotalsGeneral();
        } else {
          if (isNaN(newValue)) return;
          this.fetchTotalsForCar(this.carId);
        }
      },
    },
  },
  methods: {
    async fetchTotalsForInvestor(investorId) {
      this.isLoading = true;

      try {
        let result = await apiService.getExpensesTotalsForInvestor(investorId, this.groupBranches);
        this.records = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchTotalsForCar(carId) {
      this.isLoading = true;

      try {
        let result = await apiService.getExpensesTotalsForCar(carId, this.groupBranches);
        this.records = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchTotalsGeneral() {
      this.isLoading = true;

      try {
        this.records = await apiService.getExpensesTotalsGeneral(this.groupBranches);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.ui.table > tbody > tr:not(:first-child) > th {
  border-top: 1px solid rgba(34, 36, 38, 0.1);
}
</style>
