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
          <CUISelectCompany v-model="filter.company_id" unselected-text="Все" label="Юр. лицо" />
          <!--  -->
          <UIInputDropdownString v-model="filter.payment_method" label="Способ оплаты" :options="payment_methods" />
          <!--  -->
          <UIInputDropdown v-model.number="filter.cleared" label="Зачислено" :options="cleared_options" />
          <!--  -->
          <UIInputNumber v-model="filter.subject_id" label="ID заказа" />
          <!--  -->
          <UIButton class="primary">Обновить</UIButton>
        </form>
      </div>
    </template>

    <!-- List -->
    <CMPaymentsInvoicesList :key="key" :filter="filter" :header-sticked-at="42" @event-details="handleDetails" />
  </LayoutPage>
</template>

<script setup>
import { ref } from "vue";
import { useView } from "@/composables/view";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useNavigation } from "@/composables/navigation";

import CMPaymentsInvoicesList from "@/components/CMPaymentsInvoicesList.vue";
import CUISelectCompany from "@/components/CUISelectCompany.vue";

/// SETUP

const { view } = useView("PaymentsView", { title: "Касса", subTitle: "Список счетов на оплату" });
const router = useRouter();
const { navigateTo } = useNavigation();

/// DATA

const status_options = [
  { name: "Все", value: null },
  { name: "Ошибка", value: -5 },
  { name: "Отказ", value: -1 },
  { name: "Создан", value: 0 },
  { name: "Запрошен", value: 3 },
  { name: "Оплачен", value: 1 },
  { name: "Отменён", value: 2 },
];
const payment_methods = [
  { name: "Все", value: null },
  { name: "Эквайринг", value: "acq" },
  { name: "СБП", value: "sbp" },
];
const cleared_options = [
  { name: "Все", value: null },
  { name: "Зачисленные", value: 1 },
  { name: "Не зачисленные", value: 0 },
];

const ofd_statuses = [
  { name: "Новый", value: 0 },
  { name: "Сформирован", value: 1 },
  { name: "ОФД OK", value: 2 },
  { name: "Ошибка", value: 3 },
  { name: "Запрошен", value: 99 },
  { name: "Нет чека", value: null },
];

const _filter = {
  date1: "",
  date2: "",
  status: null,
  company_id: null,
  payment_method: null,
  cleared: null,
  subject_id: null,
};

// Keys
const key = ref(0);
// Data
const items = ref([]);
// bind object
const filter = useStorage("payments.filter", _filter);

/// FUNCTIONS

function handleDetails(item) {
  navigateTo.Payments.Details({ invoiceId: item.id });
}

function reload() {
  key.value++;
}
</script>
