<template>
  <div>
    <!-- Loading block -->
    <div v-if="isLoading && !records.length" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !records.length" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Данных нет</span>
    </div>
    <!-- Table -->
    <table v-if="records.length" class="ui very compact small celled table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>Категории</th>
          <th class="right aligned">Доход</th>
          <th class="right aligned">Расход</th>
          <th class="right aligned">Сальдо</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" :item="item">
          <td>{{ item.category_name }}</td>
          <td class="right aligned">{{ $filters.money(item.income_total) }}</td>
          <td class="right aligned">{{ $filters.money(item.expense_total) }}</td>
          <td class="right aligned"><UIMoney :value="item.total" /></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <span>Итого</span>
          </td>
          <td class="right aligned text-bold">
            <UIMoney :value="records[records.length - 1].income_total" />
          </td>
          <td class="right aligned text-bold">
            <UIMoney :value="records[records.length - 1].expense_total" />
          </td>
          <td class="right aligned text-bold">
            <UIMoney :value="records[records.length - 1].total" />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMCarTotalsList",

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
      return this.records.filter((el) => el.category_name != null);
    },
  },
  watch: {
    carId: {
      immediate: true,
      handler(newValue) {
        // newValue, oldValue
        // console.log("fetching totals for: " + this.carId);

        if (isNaN(newValue)) return;
        this.fetchTotalsForCar(this.carId);
      },
    },
  },
  methods: {
    // mapCategoryName(category_name) {
    //   if (category_name == "debt") {
    //     category_name = "Основной долг по договору выкупа";
    //   } else if (category_name == "interest") {
    //     category_name = "Проценты по договору выкупа";
    //   } else if (category_name == "penalty") {
    //     category_name = "Пеня по договору выкупа";
    //   }

    //   return category_name;
    // },
    // Network
    async fetchTotalsForCar(carId) {
      this.isLoading = true;

      try {
        let result = await apiService.getTotalForCar(carId);
        this.records = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
