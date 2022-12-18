<template>
  <tr @click="$emit('eventDetails', item.id)">
    <!--  -->
    <td>
      {{ item.id }}
    </td>
    <!--  -->
    <td><TKOrderStatus :value="item.status_id" /></td>
    <!--  -->
    <td><TKOrderPaymentStatus :value="item.payment_status_id" /></td>
    <!--  -->
    <td>
      {{ $filters.date(item.date) }}
    </td>
    <!--  -->
    <td>
      {{ item.goods_count }}
    </td>
    <!--  -->
    <td>
      {{ item.total_quantity }}
    </td>
    <!--  -->
    <UIMoneyCell :value="item.total_price" class="text-bold" />
    <!--  -->
    <td>
      {{ item.customer_fio }}
    </td>
    <!--  -->
    <td class="right aligned nobr">
      {{ $filters.phone(item.customer_phone) }}
    </td>
    <!--  -->
    <td :title="item.notes" v-html="$filters.truncate(item.notes, 30)"></td>
  </tr>
</template>

<script>
import TKOrderStatus from "@/components/TKOrderStatus.vue";
import TKOrderPaymentStatus from "@/components/TKOrderPaymentStatus.vue";

export default {
  name: "TKOrdersListItem",

  components: {
    TKOrderStatus,
    TKOrderPaymentStatus,
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
