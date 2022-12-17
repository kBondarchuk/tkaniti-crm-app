<template>
  <tr @click="$emit('eventDetails', item)">
    <td>{{ item.request_id }}</td>
    <!-- <td>{{ item.id }}</td> -->
    <td><CMBudgetStatusBadge :value="item.request_status" /></td>
    <td>{{ $filters.date(item.created_dt, 0) }}</td>
    <!-- <td>{{$filters.date(item.updated_dt )}}</td> -->
    <td class="text-bold">{{ request_types[item.request_type] }}</td>
    <!-- <td>{{ item.expense_type }}</td> -->
    <td>{{ item.expense_category }}</td>
    <td>
      <strong>{{ item.request_notes }}</strong> <br />{{ item.expense_notes }}
    </td>
    <td>{{ item.document }}</td>
    <td><CMLinkCar :car-id="item.car_id" /> {{ item.car }}</td>
    <td>{{ item.branch }}</td>
    <td>{{ item.investor }}</td>
    <td class="right aligned">
      <span class="text-bold">{{ $filters.money(item.expense_amount) }}</span>
    </td>
    <td>{{ item.user }}</td>
    <td>{{ item.recipient_user }}</td>
  </tr>
</template>

<script>
import CMBudgetStatusBadge from "@/components/CMBudgetStatusBadge.vue";
import CMLinkCar from "@/components/CMLinkCar.vue";

const request_types = {
  income: "Продажа",
  expense: "Оплата",
  advance_report: "АО",
};

export default {
  name: "CMBudgetRequestsItemsListItem",

  components: {
    CMBudgetStatusBadge,
    CMLinkCar,
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
