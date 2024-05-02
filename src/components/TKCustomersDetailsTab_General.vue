<template>
  <LayoutTwoColumns style="max-width: 105em">
    <!-- First column -->
    <TKCustomerDetails :customer="customer" :is-loading="isLoading" />

    <!-- Second column -->
    <!-- <template #second>
      <UIList :is-loading="isLoading">
        <UIListSection>
          <UIListItem name="Кол-во неоплаченных заказов" :value="customer?.unpaid_orders_count" />
        </UIListSection>
      </UIList>
    </template> -->
  </LayoutTwoColumns>
  <!--  -->
</template>

<script setup>
import { computed } from "vue";
import TKCustomerDetails from "@/components/TKCustomerDetails.vue";

// name: "TKCustomersDetailsTabGeneral",

/// PROPS

const props = defineProps({
  customer: {
    type: Object,
    default: null,
  },
});

/// COMPUTED

const isLoading = computed(() => {
  return props.customer == null;
});
</script>
