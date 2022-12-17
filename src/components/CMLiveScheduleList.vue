<template>
  <table class="ui very basic very compact small sortable table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th>День</th>
        <th class="right aligned">Дата</th>
        <th class="right aligned">Процент</th>
        <th class="right aligned">Платеж</th>
        <th class="right aligned">Арендный</th>
        <th class="right aligned">Выкупной</th>
        <th class="right aligned">Остаток аренд. плат.</th>
        <th class="right aligned">Остаток выкупа</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in graph"
        :key="item.day + '-' + item.exception"
        :class="{ highlite: current_period == item.day, positive: item.exception }"
      >
        <td>
          {{ item.day }}
          <i v-if="current_period == item.day" class="blue right arrow icon" title="Текущий период" />
          <span v-if="item.exception == 1">Досрочное погашение</span>
          <span v-if="item.exception == 2">Реструктуризация</span>
          <span v-if="item.exception == 4">Увелич. осн. долга</span>
        </td>
        <td class="right aligned">{{ $filters.date(item.current_date) }}</td>
        <td class="right aligned">{{ item.daily_percent }}</td>
        <td class="right aligned">
          <span class="nobr">{{ $filters.money(item.daily_payment) }}</span>
        </td>
        <td class="right aligned">{{ $filters.money(item.daily_interest) }}</td>
        <td class="right aligned">{{ $filters.money(item.daily_debt) }}</td>
        <td class="right aligned">
          <i v-if="item.exception" class="orange exclamation icon" title />
          {{ $filters.money(item.ostatok_interest) }}
        </td>
        <td class="right aligned">
          <i v-if="item.exception == 4" class="orange exclamation icon" title="Изменение основного долга" />
          {{ $filters.money(item.ostatok_debt) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMLiveScheduleList",
  props: {
    contract_id: {
      type: Number,
    },
    current_period: {
      type: Number,
    },
  },
  data() {
    return {
      graph: [],
      isLoading: false,
    };
  },
  mounted() {
    this.refetch();
  },
  methods: {
    async refetch() {
      this.isLoading = true;
      try {
        let result = await apiService.getContractsSchedule(this.contract_id);
        this.graph = result;
      } catch (error) {
        console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.highlite {
  background-color: #2185d021;
  font-weight: bold;
  font-size: 1.1em;
}
</style>
