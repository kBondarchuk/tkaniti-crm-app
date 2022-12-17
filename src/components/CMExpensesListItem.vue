<template>
  <tr @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td>{{ $filters.date(item.date) }}</td>
    <td v-if="showInvestor">{{ item.investor }}</td>
    <td v-if="showBranch">{{ item.branch }}</td>
    <td>{{ item.category_name }}</td>
    <td v-if="showCar">
      <CMLinkCar :car-id="item.car_id" />
      {{ item.car }}
    </td>
    <td class="right aligned">
      <strong class="nobr">{{ $filters.money(item.amount) }}</strong>
    </td>
    <td>
      <span class="nobr">{{ item.user }}</span>
    </td>
    <td><CMLinkBudget :request-id="item.basis_id" /></td>
    <td>{{ item.notes }}</td>
  </tr>
</template>

<script>
import CMLinkCar from "@/components/CMLinkCar.vue";
import CMLinkBudget from "@/components/CMLinkBudget.vue";

export default {
  name: "CMExpensesListItem",
  components: {
    CMLinkCar,
    CMLinkBudget,
  },
  props: {
    item: {
      type: Object,
    },
    showInvestor: {
      type: Boolean,
      default: false,
    },
    showBranch: {
      type: Boolean,
      default: false,
    },
    showCar: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["eventDetails"],
};
</script>
