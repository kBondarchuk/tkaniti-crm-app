<template>
  <tr @click="$emit('eventDetails', item)">
    <td>{{ $filters.date(item.day) }}</td>

    <!-- Долг -->
    <td class="right aligned nobr">
      {{ $filters.money(item.debt_plus) }}
    </td>
    <td class="right aligned nobr" :class="{ 'text-color-blue': item.debt_minus > 0 }">
      {{ $filters.money(item.debt_minus) }}
    </td>
    <td class="right aligned nobr" :class="{ negative: item.debt_balance < 0 }">
      <strong>{{ $filters.money(item.debt_balance) }}</strong>
    </td>

    <!-- Пеня -->
    <td class="right aligned nobr">
      {{ $filters.money(item.penalty_plus) }}
    </td>
    <td class="right aligned nobr" :class="{ 'text-color-blue': item.penalty_minus > 0 }">
      {{ $filters.money(item.penalty_minus) }}
    </td>
    <td class="right aligned nobr text-bold" :class="{ negative: item.penalty_balance < 0 }">
      {{ $filters.money(item.penalty_balance) }}
    </td>

    <!-- Deposit -->
    <td class="right aligned nobr" :class="{ positive: item.deposit_plus > 0, 'text-bold': item.deposit_plus > 0 }">
      <span v-if="item.deposit_plus > 0">+</span>
      {{ $filters.money(item.deposit_plus) }}
    </td>
    <td class="right aligned" :class="{ 'text-color-blue': item.deposit_minus != 0 }">
      <span class="nobr"> {{ $filters.money(item.deposit_minus) }} </span>
    </td>
    <td class="right aligned nobr" :class="{ 'text-bold': item.deposit_balance > 0 }">
      {{ $filters.money(item.deposit_balance) }}
    </td>
    <!--  -->
  </tr>
</template>

<script>
export default {
  name: "CMAccountsGraphItem",

  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
};
</script>
