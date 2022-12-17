<template>
  <tr @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <td>{{ item.short_type_name }}</td>
    <td><CMBudgetStatusBadge :value="item.status" /></td>
    <td>{{ $filters.date(item.created_dt) }}</td>
    <td>{{ $filters.date(item.apply_dt) }}</td>
    <!-- <td>{{$filters.date(item.updated_dt )}}</td> -->
    <!-- <td>{{ request_types[item.request_type] }}</td> -->
    <!-- <td>{{ item.expense_type }}</td> -->
    <!-- <td>{{ item.expense_category }}</td> -->
    <!-- <td><CMLinkCar :car-id="item.expense_car_id" /> {{ item.expense_car }}</td> -->
    <!-- <td>{{ item.branch }}</td> -->
    <td class="right aligned">
      <span class="nobr text-bold" :class="{ 'text-color-green': item.type_id == 1 }">{{
        $filters.money(item.amount)
      }}</span>
    </td>
    <td>{{ item.user_recipient }}</td>
    <td>{{ item.user }}</td>
    <td>{{ item.notes }}</td>
  </tr>
</template>

<script>
import CMBudgetStatusBadge from "@/components/CMBudgetStatusBadge.vue";
// import CMLinkCar from "@/components/CMLinkCar.vue";

const request_types = {
  income: "Продажа",
  expense: "Расход",
};

export default {
  name: "CMAdvanceRequestsListItem",

  components: {
    CMBudgetStatusBadge,
  },

  props: {
    item: {
      type: Object,
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
