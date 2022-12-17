<template>
  <div>
    <!-- Loading block -->
    <div v-if="isLoading && !records.length" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !records.length" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Дохода нет</span>
    </div>
    <!-- Table -->
    <table v-if="records.length" class="ui very compact small table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>Доход по договорам</th>
          <th class="right aligned">Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" :item="item">
          <td>{{ getTypeName(item.type_id) }}</td>
          <td class="right aligned">
            <span class="nobr">{{ $filters.money(item.total) }}</span>
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
  name: "CMIncomeTotalsList",
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
      return this.records.filter((el) => el.type_id != null);
    },
  },
  watch: {
    carId: {
      immediate: true,
      handler(newValue) {
        // newValue, oldValue
        console.log("fetching totals for: " + this.carId);

        if (isNaN(newValue)) return;
        this.fetchTotalsForCar(this.carId);
      },
    },
  },
  methods: {
    getTypeName(type_id) {
      switch (type_id) {
        case "leasing_contract.debt":
          return "Основной долг";
        case "leasing_contract.interest":
          return "Проценты";
        case "leasing_contract.penalty":
          return "Пеня";
        case "rent_contract.debt":
          return "Арендные платежи";
      }
      return "";
    },
    // Network
    async fetchTotalsForCar(carId) {
      this.isLoading = true;

      try {
        let result = await apiService.getTotalIncomeForCar(carId);
        this.records = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
