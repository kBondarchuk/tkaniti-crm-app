<template>
  <tr @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <!-- <td>{{ new Date(parseInt(item.date)).toLocaleString() }}</td> -->
    <td>{{ $filters.date(item.date_converted) }}</td>
    <td><CMAcquiringTypeStatus :type="item.contract_type" /></td>
    <td>{{ item.contract_id }}</td>
    <td>{{ item.orderNumber }}</td>
    <td class="right aligned">
      <span class="nobr">{{ $filters.money(item.amount) }}</span>
    </td>
    <td class="right aligned" :class="{ 'text-bold': item.cleared == 1 }">
      {{ $filters.money(item.depositedAmount) }}
    </td>
    <td>
      <CMSberStatus :value="item.orderStatus" />
      <!-- {{ item.paymentState }} -->
      <!-- <span v-if="item.orderStatus">({{ item.orderStatus }})</span> -->
    </td>
    <td>{{ item.actionCode }}</td>
    <td>
      <!-- {{ item.cleared }} -->
      <i v-if="item.cleared" class="check green icon"></i>
      <i v-if="item.orderStatus == 2 && item.actionCode == 0 && !item.cleared" class="question red icon"></i>
    </td>
  </tr>
</template>

<script>
// "id": 49,
// "orderId": "3b266a87-4cd6-783f-bafb-07635e1f622a",
// "orderNumber": "136-1571651566",
// "orderStatus": 2,
// "actionCode": 0,
// "amount": "630.00",
// "date": "1571651566221",
// "orderDescription": "Оплата по договору 136 оплата 136-1571651566 на ЮМ-АВТО",
// "ip": "94.233.232.218",
// "paymentSystem": null,
// "contract_id": 136,
// "paymentState": "DEPOSITED",
// "approvedAmount": "630.00",
// "depositedAmount": "630.00",
// "refundedAmount": "0.00",
// "cleared": 1,
// "timestamp": "2019-10-21 19:53:25",
// "deleted": 0
import CMSberStatus from "@/components/CMSberStatus.vue";
import CMAcquiringTypeStatus from "@/components/CMAcquiringTypeStatus.vue";

export default {
  name: "CMAcquiringTransactionsListItem",

  components: {
    CMSberStatus,
    CMAcquiringTypeStatus,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
  },

  emits: ["eventDetails"],
};
</script>
