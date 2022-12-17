<template>
  <tr @click="$emit('eventDetails', item)">
    <td v-if="item.day">{{ $filters.date(item.day) }}</td>
    <td v-else>ИТОГО</td>

    <!-- Deposit -->
    <td class="right aligned">
      <span v-if="item.acquiring">
        {{ $filters.money(item.acquiring) }}
      </span>
      <span v-else> 0.00 </span>
    </td>
    <!--  -->
    <td class="right aligned">
      <span v-if="item.cash"> {{ $filters.money(item.cash) }} </span>
      <span v-else> 0.00 </span>
    </td>
    <!--  -->
  </tr>
</template>

<script>
export default {
  name: "CMDepositGraphItem",

  props: {
    item: {
      type: Object,
    },
  },

  emits: ["eventDetails"],
};
</script>
