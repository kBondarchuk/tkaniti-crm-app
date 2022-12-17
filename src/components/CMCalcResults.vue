<template>
  <table class="ui very basic very compact two column sortable table" :class="{ loading: isLoading }">
    <!-- <thead>
      <tr>
        <th colspan="2" style="background-color: #eeeeee">Расчет параметров договора</th>
      </tr>
    </thead>-->
    <tbody>
      <tr>
        <td>Филиал</td>
        <td class="right aligned striked">
          <span v-if="branch">{{ branch }}</span>
          <span v-else>Филиал не определён</span>
        </td>
      </tr>
      <tr>
        <td>Инвестор</td>
        <td class="right aligned striked">
          <span v-if="investor">{{ investor }}</span>
          <span v-else>Инвестор не определён</span>
        </td>
      </tr>
      <tr>
        <td>Выкупная стоимость</td>
        <td class="right aligned striked">
          <span id="contract_price" class="ui blue">{{ $filters.money(total_payout) }}</span> &#8381;
        </td>
      </tr>
      <tr>
        <td>Сумма основного долга</td>
        <td class="right aligned striked">
          <span id="down_payment" class="ui blue">{{ $filters.money(debt_to_pay) }}</span> &#8381;
        </td>
      </tr>
      <tr>
        <td>Сумма процентов</td>
        <td class="right aligned striked">
          <span id="down_payment" class="ui blue">{{ $filters.money(interest_to_pay) }}</span> &#8381;
        </td>
      </tr>

      <tr>
        <td>Дневной платёж</td>
        <td id="period" class="right aligned striked">
          <span id="daily_payment">{{ $filters.money(daily_payment) }}</span> &#8381;
        </td>
      </tr>
      <tr>
        <td class="text-color-grey">Рекомендованный платёж</td>
        <td id="period" class="right aligned striked text-color-grey">
          <span>{{ $filters.money(recommended_payment) }}</span> &#8381;
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMCalcResults",
  props: {
    branch: {
      type: String,
    },
    investor: {
      type: String,
    },
    price: {
      type: [Number, String],
    },
    down_payment: {
      type: [Number, String],
    },
    days: {
      type: [Number, String],
    },
    daily_percentage: {
      type: [Number, String],
    },
    recommended_payment: {
      type: [Number, String],
    },
  },
  data() {
    return {
      // Calc Results
      daily_payment: 0,
      debt_to_pay: 0,
      interest_to_pay: 0,
      total_payout: 0,
      isLoading: false,
    };
  },
  mounted() {
    if (this.price && this.down_payment && this.days && this.daily_percentage) {
      this.refetch();
    }
  },
  methods: {
    async refetch() {
      this.isLoading = true;

      try {
        let result = await apiService.calc(this.price, this.down_payment, this.daily_percentage, this.days);

        // console.log(result);
        this.daily_payment = result["daily_payment"];
        this.debt_to_pay = result["debt_to_pay"];
        this.interest_to_pay = result["interest_to_pay"];
        this.total_payout = result["total_payout"];
      } catch (error) {
        console.log("!!!! " + error);
        // this.$UIService.showError("Ошибка", error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.no-bottom-margin {
  margin-bottom: 0;
}

.ui.basic.table tbody tr:last-child > td {
  border-bottom: 1px solid #dededf;
}
</style>
