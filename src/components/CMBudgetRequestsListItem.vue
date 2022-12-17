<template>
  <tr @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <td><CMBudgetStatusBadge :value="item.status" /></td>
    <td>{{ $filters.date(item.created_dt) }}</td>
    <!-- <td>{{$filters.date(item.updated_dt )}}</td> -->
    <td class="text-bold">{{ request_types[item.request_type] }}</td>
    <!-- <td>{{ item.expense_type }}</td> -->
    <!-- <td>{{ item.expense_category }}</td> -->
    <!-- <td><CMLinkCar :car-id="item.expense_car_id" /> {{ item.expense_car }}</td> -->
    <!-- <td>{{ item.branch }}</td> -->
    <td>{{ item.notes }}</td>
    <td class="right aligned">
      <span class="text-bold">{{ $filters.money(item.total_sum) }}</span>
    </td>
    <td>{{ item.user }}</td>
    <td>{{ item.recipient_user }}</td>
  </tr>
</template>

<script>
import CMBudgetStatusBadge from "@/components/CMBudgetStatusBadge.vue";
// import CMLinkCar from "@/components/CMLinkCar.vue";

const request_types = {
  income: "Продажа",
  expense: "Оплата",
  advance_report: "АО",
};

export default {
  name: "CMBudgetRequestsListItem",
  components: {
    CMBudgetStatusBadge,
    // CMLinkCar,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
  },

  emits: ["eventDetails"],

  data: function () {
    return {
      request_types,
    };
  },
};
</script>
