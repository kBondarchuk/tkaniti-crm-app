<template>
  <tr @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <!--  -->
    <td>{{ $filters.date(item.created_ts) }}</td>
    <!--  -->
    <td><CMInvoicePaymentMethod :value="item.payment_method" /></td>
    <!--  -->
    <td>{{ item.company_id }}</td>
    <!--  -->
    <td><CMAcquiringTypeStatus :type="item.subject_type" /></td>
    <!--  -->
    <td>{{ item.subject_id }}</td>
    <!--  -->
    <td>{{ item.invoice_number }}</td>
    <!-- Спис сумма -->
    <UIMoneyCell
      :value="item.deposit_amount"
      :class="{ 'text-bold': item.cleared == 1 }"
      :colored="item.cleared == 1"
    />
    <!--  -->
    <td>
      <CMInvoiceStatus :value="item.status" />
    </td>
    <!--  -->
    <td>
      <!-- {{ item.cleared }} -->
      <i v-if="item.cleared" class="check green icon"></i>
      <i v-if="item.status == 1 && !item.cleared" class="question red icon"></i>
    </td>
    <!--  -->
    <td><CMOfdStatus :value="item.status_code ?? (item['receipt_id'] != null ? 99 : null)" /></td>
  </tr>
</template>

<script>
import CMInvoiceStatus from "@/components/CMInvoiceStatus.vue";
import CMAcquiringTypeStatus from "@/components/CMAcquiringTypeStatus.vue";
import CMOfdStatus from "@/components/CMOfdStatus.vue";
import CMInvoicePaymentMethod from "@/components/CMInvoicePaymentMethod.vue";

export default {
  name: "CMPaymentsInvoicesListItem",

  components: {
    CMInvoiceStatus,
    CMAcquiringTypeStatus,
    CMOfdStatus,
    CMInvoicePaymentMethod,
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
