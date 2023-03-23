<template>
  <!-- Order -->
  <!-- <UIStaticTable> -->
  <!--  -->
  <!-- <UITableRow name="Статус заказа">
      <TKOrderStatus :value="order?.status_id" />
    </UITableRow> -->
  <!--  -->
  <!-- <UITableRow name="Статус оплаты">
      <TKOrderPaymentStatus :value="order?.payment_status_id" />
    </UITableRow> -->

  <!--  -->
  <!-- <UITableDividerRow />
    <UITableRow name="Дата, время заказа" :value="order?.date" type="date" /> -->

  <!-- Customer -->
  <!-- <UITableDividerRow />
    <UITableRow name="Клиент" :value="order?.real_customer_fio">
      <TKLink v-if="order?.customer_id" :id="order?.customer_id" path-name="customers_details" />
    </UITableRow> -->

  <!-- Order Customer data -->
  <!-- <UITableDividerRow /> -->
  <!-- <UITableRow name="ФИО получателя" :value="order?.customer_fio" /> -->
  <!-- <UITableRow name="Телефон получателя" :value="order?.customer_phone" type="phone" /> -->
  <!-- <UITableRow name="Комментарий клиента" :value="order?.notes" /> -->

  <!-- <UITableDividerRow /> -->
  <!-- delivery_method_id -->
  <!-- <UITableRow name="Метод доставки" :value="order?.delivery_method_name" /> -->
  <!-- delivery_method_other -->
  <!-- <UITableRow v-if="order?.delivery_method_other" name="Другой" :value="order?.delivery_method_other" /> -->
  <!-- delivery_address -->
  <!-- <UITableRow name="Адрес доставки" :value="order?.delivery_address" /> -->
  <!-- Отложенная отправка -->
  <!-- <UITableRow name="Отложить до" :value="order?.delivery_date" type="date" /> -->

  <!--  -->
  <!-- <UITableDividerRow />
    <UITableRow name="Метод оплаты" :value="order?.payment_method_name" /> -->

  <!--  -->
  <!-- <UITableDividerRow /> -->
  <!-- <UITableRow name="Комментарий" :value="order?.notes" /> -->
  <!--  -->
  <!-- </UIStaticTable> -->

  <UIList class="grouped" :is-loading="isLoading">
    <UIListSection>
      <UIListItem name="Статус заказа">
        <TKOrderStatus :value="order?.status_id" />
      </UIListItem>
      <UIListItem name="Дата, время заказа" :value="order?.date" type="date" />
      <UIListItem name="Ссылка для клиента" :value="'https://store.tkaniti.ru/orders/' + order?.uuid" />
    </UIListSection>

    <!--  -->
    <UIListSection>
      <UIListItem name="Клиент" :value="order?.real_customer_fio" placeholder="Не привязан">
        <TKLink v-if="order?.customer_id" :id="order?.customer_id" path-name="customers_details" />
      </UIListItem>
      <UIListItem v-if="order?.customer_id" name="Адрес клиента" :value="order?.customer_address" />
    </UIListSection>

    <!-- Customer -->
    <UIListSection header="Оплата">
      <UIListItem name="Метод оплаты" :value="order?.payment_method_name" />
      <UIListItem name="Статус оплаты">
        <TKOrderPaymentStatus :value="order?.payment_status_id" />
      </UIListItem>
    </UIListSection>

    <!--  -->
    <!-- Order Customer data -->
    <UIListSection header="Получатель">
      <UIListItem name="ФИО получателя" :value="order?.customer_fio" />
      <UIListItem name="Телефон получателя" :value="order?.customer_phone" type="phone" />
      <UIListItem name="Комментарий клиента" :value="order?.customer_notes" />
    </UIListSection>

    <UIListSection header="Доставка">
      <!-- delivery_method_id -->
      <UIListItem name="Метод доставки" :value="order?.delivery_method_name" />
      <!-- delivery_method_other -->
      <UIListItem v-if="order?.delivery_method_other" name="Другой" :value="order?.delivery_method_other" />
      <!-- delivery_address -->
      <UIListItem name="Адрес доставки" :value="order?.delivery_address" />
      <!-- Отложенная отправка -->
      <UIListItem name="Отложить до" :value="order?.delivery_date" type="date" />
      <!-- Номер посылки -->
      <UIListItem name="Номер посылки" :value="order?.parcel_number" />
    </UIListSection>

    <UIListSection header="Комментарий сотрудника">
      <UIListItem :value="order?.notes" />
    </UIListSection>

    <!--  -->
  </UIList>

  <!-- EOT -->
</template>

<script>
import TKOrderStatus from "@/components/TKOrderStatus.vue";
import TKOrderPaymentStatus from "@/components/TKOrderPaymentStatus.vue";
import TKLink from "@/components/TKLink.vue";
import UIListItem from "./UIListItem.vue";

export default {
  name: "TKOrderDetails",

  components: {
    TKOrderStatus,
    TKOrderPaymentStatus,
    TKLink,
    UIListItem,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
