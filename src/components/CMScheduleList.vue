<template>
  <UITableList
    id="schedule"
    :headers="headers"
    :header-sticked-at="headerStickedAt"
    :items-count="graph.length"
    :is-loading="isLoading"
    no-sort
  >
    <tr v-for="item in graph" :key="item.day" :class="{ highlite: current_period == item.day }">
      <td>{{ item.day }}</td>
      <td class="right aligned">
        <span class="nobr">{{ $filters.money(item.daily_payment) }}</span>
      </td>
      <td class="right aligned">{{ $filters.money(item.daily_interest) }}</td>
      <td class="right aligned">{{ $filters.money(item.daily_debt) }}</td>
      <td class="right aligned">{{ $filters.money(item.ostatok_interest) }}</td>
      <td class="right aligned">{{ $filters.money(item.ostatok_debt) }}</td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMScheduleList",
  components: {},
  props: {
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
    current_period: {
      type: [Number],
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
    headerStickedAt: {
      type: Number,
      default: null,
    },
  },
  emits: ["calc:result"],
  data() {
    return {
      headers: [
        { id: "1", name: "День", class: "" },
        { id: "2", name: "Платеж", class: "right aligned" },
        { id: "3", name: "Арендный платёж", class: "right aligned" },
        { id: "4", name: "Выкуп", class: "right aligned" },
        { id: "5", name: "Остаток аренд. плат", class: "right aligned" },
        { id: "6", name: "Остаток выкупа", class: "right aligned" },
      ],
      graph: [],
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
      // context.commit("setLoadingState");
      try {
        let result = await apiService.calcGraph(this.price, this.down_payment, this.daily_percentage, this.days);
        // console.log(result[0]);
        this.graph = result;
        this.$emit("calc:result", result[1].daily_payment);
      } catch (error) {
        // console.log("!!!! " + error);
        // this.$UIService.showError("Ошибка", error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.highlite {
  background-color: rgb(230, 230, 225);
  font-weight: bold;
}
</style>
