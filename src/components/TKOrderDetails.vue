<template>
  <!-- Order -->
  <UIStaticTable>
    <!--  -->
    <UITableRow name="Статус заказа">
      <TKOrderStatus :value="order.status_id" />
    </UITableRow>
    <!--  -->
    <UITableRow name="Статус оплаты">
      <TKOrderPaymentStatus :value="order.payment_status_id" />
    </UITableRow>

    <!--  -->
    <UITableDividerRow />
    <UITableRow name="Дата, время заказа" :value="order.date" type="date" />

    <!-- Customer -->
    <UITableDividerRow />
    <UITableRow name="Клиент" :value="order.real_customer_fio">
      <TKLink :id="order.customer_id" path-name="customers_details" />
    </UITableRow>
    <!-- Order Customer data -->
    <UITableDividerRow />
    <UITableRow name="ФИО клиента" :value="order.customer_fio" />
    <UITableRow name="Телефон клиента" :value="order.customer_phone" type="phone" />
    <UITableRow name="Комментарий клиента" :value="order.notes" />

    <UITableDividerRow />
    <!-- delivery_method_id -->
    <UITableRow name="Метод доставки" :value="order.delivery_method_name" />
    <!-- delivery_method_other -->
    <UITableRow v-if="order.delivery_method_other" name="Другой" :value="order.delivery_method_other" />
    <!-- delivery_address -->
    <UITableRow name="Адрес доставки" :value="order.delivery_address" />

    <!--  -->
    <UITableDividerRow />
    <UITableRow name="Метод оплаты" :value="order.payment_method_name" />

    <!--  -->
    <!-- <UITableDividerRow /> -->
    <!-- <UITableRow name="Комментарий" :value="order.notes" /> -->
    <!--  -->
  </UIStaticTable>

  <!-- EOT -->
</template>

<script>
import TKOrderStatus from "@/components/TKOrderStatus.vue";
import TKOrderPaymentStatus from "@/components/TKOrderPaymentStatus.vue";
import TKLink from "@/components/TKLink.vue";

export default {
  name: "TKOrderDetails",

  components: {
    TKOrderStatus,
    TKOrderPaymentStatus,
    TKLink,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      // UI
      isLoading: false,
    };
  },
};
</script>
