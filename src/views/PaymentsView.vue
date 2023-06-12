<template>
  <LayoutPage no-paddings>
    <!-- Side Menu -->
    <template #side>
      <div id="side" class="sticked" style="top: 61px">
        <!-- Filter -->
        <form class="ui form" @submit.prevent="reload">
          <!--  -->
          <UIInputDate v-model="filter.date1" label="Начальная дата" />
          <!--  -->
          <UIInputDate v-model="filter.date2" label="Конечная дата" />
          <!--  -->
          <UIInputDropdown v-model="filter.status" label="Статус оплаты" :options="status_options" />
          <!--  -->
          <!-- <UIInputDropdown v-model="filter.company_id" label="Юр. лицо" :options="companies_options" /> -->
          <!--  -->
          <UIInputDropdownString v-model="filter.payment_method" label="Способ оплаты" :options="payment_methods" />
          <!--  -->
          <UIInputDropdown v-model.number="filter.cleared" label="Зачислено" :options="cleared_options" />
          <!--  -->
          <UIButton class="primary">Обновить</UIButton>
        </form>
      </div>
    </template>

    <!-- Toolbar -->
    <!-- <template #toolbar>
      <UIButton icon="plus" type="labeled" style="visibility: hidden">x</UIButton>
    </template> -->
    <!-- /Toolbar -->

    <!-- List -->
    <CMPaymentsInvoicesList :key="key" :filter="filter" :header-sticked-at="42" @event-details="handleDetails" />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import CMPaymentsInvoicesList from "@/components/CMPaymentsInvoicesList.vue";

export default {
  name: "PaymentsView",

  components: {
    CMPaymentsInvoicesList,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Касса", subTitle: "Список счетов на оплату" },
      // Keys
      key: 0,
      // Data
      items: [],
      // Filters
      filter: {
        date1: "",
        date2: "",
        status: null,
        company_id: null,
        payment_method: null,
        cleared: null,
      },
      // UI
      status_options: [
        { name: "Все", value: null },
        { name: "Отказ", value: -1 },
        { name: "Создан", value: 0 },
        { name: "Оплачен", value: 1 },
        { name: "Отменён", value: 2 },
      ],
      companies_options: [
        { name: "Все", value: null },
        { name: "ИП Каратаева Л.М.", value: 1 },
        { name: "ИП Каратаев Ю.М.", value: 2 },
      ],
      payment_methods: [
        { name: "Все", value: null },
        { name: "Эквайринг", value: "acq" },
        { name: "СБП", value: "sbp" },
      ],
      cleared_options: [
        { name: "Все", value: null },
        { name: "Зачисленные", value: 1 },
        { name: "Не зачисленные", value: 0 },
      ],
    };
  },

  created() {
    // Load saved params
    let filter = JSON.parse(localStorage.getItem("payments.filter"));
    if (filter != null) {
      this.filter = filter;
    }
  },

  methods: {
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.$router.push({
        name: "payments_invoice_details",
        params: { id: item.id },
      });
    },
    reload() {
      // Save params
      localStorage.setItem("payments.filter", JSON.stringify(this.filter));
      // this.refetch(this.filter);
      this.key++;
    },
    // value
    orderStatusDropDownChanged() {},
  },
};
</script>
