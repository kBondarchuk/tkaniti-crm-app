<template>
  <LayoutTwoColumns style="max-width: 105em">
    <!-- First column -->
    <TKCustomerDetails :customer="customer" :is-loading="isLoading" />

    <!-- Second column -->
    <template #second>
      <UIList :is-loading="isLoading">
        <UIListSection header="Статистика заказов">
          <UIListItem name="Всего заказов" :value="customer?.total_orders_count" />
          <UIListItem name="Оплаченных" :value="customer?.paid_orders_count" />
          <UIListItem name="Неоплаченных заказов" :value="customer?.unpaid_orders_count" />
          <UIListItem name="Отмененных вручную" :value="customer?.cancelled_orders_count" />
          <UIListItem name="Отмененных по тайм-ауту" :value="customer?.timeout_orders_count" />
        </UIListSection>
        <UIListSection>
          <UIListItem name="Процент невыкупленных" :value="raiting" />
        </UIListSection>
      </UIList>
    </template>
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

const raiting = computed(() => {
  if (props.customer == null) return null;

  const percent =
    ((props.customer.cancelled_orders_count + props.customer.timeout_orders_count) /
      (props.customer.cancelled_orders_count +
        props.customer.timeout_orders_count +
        props.customer.paid_orders_count)) *
    100;

  return Number(percent).toFixed(1) + "%";
});
</script>
