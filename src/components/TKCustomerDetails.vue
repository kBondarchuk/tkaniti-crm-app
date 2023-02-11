<template>
  <!--  -->
  <!-- <UIStaticTable> -->
  <!--  -->
  <!-- <UITableDividerRow /> -->
  <!-- <UITableRow name="ФИО" :value="customer.last_name + ' ' + customer.first_name + ' ' + customer.second_name" />
    <UITableRow name="Телефон" :value="customer.phone" type="phone" />
    <UITableRow name="Email" :value="customer.email" />
    <UITableRow name="Адрес фактический" :value="address_fact" />
    <UITableDividerRow />
    <UITableRow name="Комментарий" :value="customer.notes" /> -->
  <!--  -->
  <!-- </UIStaticTable> -->

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

  // data() {
  //   return {
  //     // customer: {},
  //     // referrer: {},
  //     isLoading: false,
  //   };
  // },

  // computed: {
  //   address_reg() {
  //     return [
  //       this.customer.address_reg_region,
  //       this.customer.address_reg_area,
  //       this.customer.address_reg_city
  //         ? this.customer.address_reg_city_type + "&nbsp;" + this.customer.address_reg_city
  //         : null,
  //       this.customer.address_reg,
  //     ]
  //       .filter(Boolean)
  //       .join(",<br/>");
  //   },
  //   address_fact() {
  //     return [
  //       this.customer.address_fact_region,
  //       this.customer.address_fact_area,
  //       this.customer.address_fact_city
  //         ? this.customer.address_fact_city_type + "&nbsp;" + this.customer.address_fact_city
  //         : null,
  //       this.customer.address_fact,
  //     ]
  //       .filter(Boolean)
  //       .join(",<br/>");
  //   },
  // },

  // watch: {
  //   customerId: {
  //     immediate: true,
  //     handler(newValue) {
  //       if (newValue !== undefined) {
  //         this.fetchItem(newValue);
  //       }
  //     },
  //   },
  // },
  methods: {
    // async fetchItem(customer_id) {
    //   this.isLoading = true;
    //   try {
    //     this.customer = await apiService.getCustomer(customer_id);
    //   } catch (error) {
    //     this.$UIService.showNetworkError(error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
  },
  // mounted() {
  //   if (this.customer_id !== undefined) {
  //     this.fetchItem(this.customer_id);
  //   }
  // },
};
</script>
