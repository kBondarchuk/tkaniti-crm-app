<template>
  <tr @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td>{{ $filters.date(item.date) }}</td>
    <td>
      <CMTransactionType :type="item.type_id" />
    </td>
    <td v-if="showBasis">{{ item.category_name }}</td>
    <td v-if="showBranch">
      {{ item.branch }}
    </td>
    <td>
      {{ item.user }}
    </td>
    <!--  -->
    <td v-if="customerAccount" class="right aligned">
      <span v-if="item.debet_customer_id">
        <strong>{{ $filters.money(item.amount) }}</strong>
      </span>
    </td>
    <td v-else class="right aligned">
      <span
        v-if="
          item.debet_contract_id || item.credit_car_id || item.debet_rent_contract_id || item.type_id == 'payment.sale'
        "
      >
        <strong>{{ $filters.money(item.amount) }}</strong>
      </span>
    </td>
    <!--  -->
    <td v-if="customerAccount" class="right aligned">
      <span v-if="item.credit_customer_id">
        <strong>{{ $filters.money(item.amount) }}</strong>
      </span>
    </td>
    <td v-else class="right aligned">
      <span
        v-if="
          (item.credit_contract_id && !item.debet_contract_id) ||
          (item.credit_rent_contract_id && !item.debet_rent_contract_id) ||
          (item.debet_car_id && !item.credit_car_id && item.type_id != 'payment.sale')
        "
      >
        <strong>{{ $filters.money(item.amount) }}</strong>
      </span>
    </td>
    <!--  -->
    <td v-if="showBasis"><CMLinkBudget :request-id="item.basis_id" /></td>
    <td>{{ item.notes }}</td>
  </tr>
</template>

<script>
import CMTransactionType from "@/components/CMTransactionType.vue";
import CMLinkBudget from "@/components/CMLinkBudget.vue";

export default {
  name: "CMTransactionsListItem",
  components: {
    CMTransactionType,
    CMLinkBudget,
  },
  props: {
    item: {
      type: Object,
    },
    showBranch: {
      type: Boolean,
      default: false,
    },
    showBasis: {
      type: Boolean,
      default: true,
    },
    customerAccount: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["eventDetails"],
};
</script>

<style scoped>
.ui.circular.button {
  background-color: transparent;
  padding: 3px;
}
.ui.circular.button:hover {
  background-color: #cacbcd;
}
</style>
