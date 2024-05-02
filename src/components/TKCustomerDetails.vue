<template>
  <UIList :is-loading="isLoading">
    <UIListSection>
      <UIListItem name="ФИО" :value="customer?.last_name + ' ' + customer?.first_name + ' ' + customer?.second_name" />
      <UIListItem name="Телефон" :value="customer?.phone" type="phone" />
      <UIListItem name="Email" :value="customer?.email" />
    </UIListSection>
    <UIListSection header="Адреса">
      <UIListItem name="Адрес основной" :value="customer?.address_fact" />
    </UIListSection>
    <UIListSection header="Комментарий">
      <UIListItem name="Комментарий" :value="customer?.notes" />
    </UIListSection>
  </UIList>

  <!-- <UITableRow name="Дата рождения" :value="customer?.date_of_birth" type="date" />
  <UITableRow name="Пол" :value="customer?.gender_name" /> -->
  <!--  -->
</template>

<script>
// import apiService from "@/services/api.service.js";

export default {
  name: "TKCustomerDetails",

  props: {
    // customerId: {
    //   type: Number,
    //   default: null,
    // },
    customer: {
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
