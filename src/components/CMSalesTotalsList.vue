<template>
  <div>
    <!-- Loading block -->
    <div v-if="isLoading && !records.length" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !records.length" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Продаж нет</span>
    </div>
    <!-- Table -->
    <table v-if="records.length" class="ui very compact small table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>Продажи по категориям</th>
          <th class="right aligned">Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" :item="item">
          <td>{{ item.category_name }}</td>
          <td class="right aligned nobr">
            {{ $filters.money(item.total) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <span class="text-bold">Итого</span>
          </td>
          <td class="right aligned">
            <span class="text-bold nobr">{{ $filters.money(records[records.length - 1].total) }}</span>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMSalesTotalsList",

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
  },

  data() {
    return {
      records: [],
      isLoading: false,
    };
  },

  computed: {
    items() {
      return this.records.filter((el) => el.category_id != null);
    },
  },

  watch: {
    investorId: {
      immediate: true,
      handler(newValue) {
        // newValue, oldValue
        if (newValue === null) return;
        if (newValue === undefined) return;
        console.log("fetching investors totals sales for: " + this.investorId);
        this.fetchTotalsForInvestor(this.investorId);
      },
    },
    carId: {
      immediate: true,
      handler(newValue) {
        // newValue, oldValue
        if (isNaN(newValue) || this.investorId) return;
        console.log("fetching total sales for: " + this.carId);

        // if (isNaN(newValue))

        if (!newValue) {
          this.fetchSalesTotals();
        } else {
          this.fetchTotalsForCar(this.carId);
        }
      },
    },
  },

  methods: {
    // Network
    async fetchTotalsForCar(carId) {
      this.isLoading = true;

      try {
        let result = await apiService.getTotalSalesForCar(carId);
        this.records = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }

      this.isLoading = false;
    },
    async fetchTotalsForInvestor(investor_id) {
      this.isLoading = true;

      try {
        this.records = await apiService.getInvestorSalesTotals(investor_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }

      this.isLoading = false;
    },
    async fetchSalesTotals() {
      this.isLoading = true;

      try {
        let result = await apiService.getSalesTotals();
        this.records = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }

      this.isLoading = false;
    },
  },
};
</script>
