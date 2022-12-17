<template>
  <UITableList
    id="billing_plans"
    title="Биллинг планы"
    bordered
    hide-paging
    :headers="headers"
    :columns-count="3"
    :items-count="items.length"
    :is-loading="isLoading"
    empty-text="Нет планов"
  >
    <tr v-for="item in items" :key="item.id" :item="item" @click="handleDetails(item)">
      <td>{{ $filters.date(item.date_opened) }}</td>
      <td>{{ item.current_period }}</td>
      <td>{{ item.year_percent }}%</td>
      <td>{{ item.user_id }}</td>
      <td>{{ item.notes }}</td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";

export default {
  name: "CMBillingPlansList",

  components: {
    UITableList,
  },

  props: {
    investorId: {
      type: Number,
    },
  },

  data() {
    return {
      items: [],
      isLoading: false,
      headers: [
        { id: "date_opend", name: "С даты", class: "" },
        { id: "current_period", name: "Последнее", class: "" },
        { id: "year_percent", name: "Процент", class: "" },
        { id: "user_id", name: "Создал", class: "" },
        { id: "notes", name: "Заметки", class: "" },
      ],
    };
  },

  watch: {
    carId: {
      immediate: true,
      handler() {
        this.refetch();
      },
    },
  },

  methods: {
    handleDetails(item) {
      console.log("details clicked: " + item.id);
      // if (item.car_id != this.carId) {
      //   this.$router.push({
      //     name: "cars_details",
      //     params: { id: item.car_id },
      //   });
      // }
    },

    // Network
    async refetch() {
      this.isLoading = true;

      try {
        this.items = await apiService.getInvestorBillingPlans(this.investorId);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
  // mounted() {
  //   this.refetch();
  // },
};
</script>
