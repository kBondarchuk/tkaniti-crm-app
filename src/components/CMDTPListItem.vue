<template>
  <tr @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td>{{ $filters.date(item.date, false) }}</td>
    <td>
      <CMLinkCar :car-id="item.car_id" />
      {{ item.car }}
    </td>
    <td>{{ item.driver }}</td>
    <td>{{ item.culprit }}</td>
    <td>
      <span class="nobr"> {{ $filters.phone(item.culprit_phone) }}</span>
    </td>
    <td>{{ $filters.date(item.inspection_date, false) }}</td>
    <td>{{ $filters.date(item.payout_date) }}</td>
    <!-- <td class="right aligned">
      <strong>{{$filters.money(item.payout_amount )}}</strong>
    </td> -->
    <UIMoneyCell :value="item.payout_amount" class="text-bold" />
    <td>{{ item.description }}</td>
    <td class="right aligned">
      <span v-if="!item.payout_amount">{{ item.days_till_payout }}</span>
    </td>
  </tr>
</template>

<script>
import CMLinkCar from "@/components/CMLinkCar.vue";

export default {
  name: "CMDTPListItem",

  components: {
    CMLinkCar,
  },

  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
};
</script>
