<template>
  <!-- Order -->

  <UIList class="grouped" :is-loading="isLoading">
    <UIListSection>
      <UIListItem name="Статус заказа">
        <TKOrderStatus :value="order?.status_id" />
      </UIListItem>
      <UIListItem name="Дата, время заказа" :value="order?.date" type="date" />
      <UIListItem name="Ссылка для клиента" :value="'https://store.tkaniti.ru/orders/' + order?.uuid">
        <UIClipButton :value="'https://store.tkaniti.ru/orders/' + order?.uuid" />
      </UIListItem>
    </UIListSection>

    <!--  -->
    <UIListSection>
      <UIListItem name="Клиент" :value="order?.real_customer_fio" placeholder="Не привязан">
        <TKLinkCustomer v-if="order?.customer_id" :id="order?.customer_id" />
      </UIListItem>
      <UIListItem v-if="order?.customer_id" name="Адрес клиента" :value="order?.customer_address" />
    </UIListSection>

    <!-- Customer -->
    <UIListSection header="Оплата">
      <UIListItem name="Юр. лицо" :value="order?.company_name" />
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
import TKLinkCustomer from "@/components/TKLinkCustomer.vue";
import UIClipButton from "@/components/UIClipButton.vue";
import UIListItem from "./UIListItem.vue";

export default {
  name: "TKOrderDetails",

  components: {
    TKOrderStatus,
    TKOrderPaymentStatus,
    TKLinkCustomer,
    UIListItem,
    UIClipButton,
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
