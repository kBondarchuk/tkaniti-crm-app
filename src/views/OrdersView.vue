<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Toggle -->
      <YTogglePanelButton :show="view.showSidePanel" @click="toggleSidePanel" />

      <!-- Refresh -->
      <UIButton icon="refresh" type="icon basic" title="Обновить список" @click="reload" />
      <!-- <UISpacer /> -->
      <!-- Pager -->
      <UIButton
        icon="left arrow"
        type="icon basic"
        title="Предыдущая страница"
        :disabled="currentPage == 0"
        style="margin-left: 3.5rem"
        @click="pageDown"
      />
      <UIButton :text="pageText" :type="totalPages < 1 ? 'basic loading' : 'basic'" />
      <UIButton
        icon="right arrow"
        type="icon basic"
        title="Следующая страница"
        :disabled="isPageLast"
        @click="pageUp"
      />
      <UISpacer />

      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <UISpacer />

      <!-- New -->
      <UIButton :disabled="!checkAuthNewOrder" icon="plus" type="right labeled" text="Новый заказ" @click="newOrder" />
    </template>
    <!-- /Toolbar -->

    <!-- Side Menu -->
    <template v-if="view.showSidePanel" #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>

    <!-- List -->
    <TKOrdersList
      :filter-status="[menuSelectedId]"
      :header-sticked-at="42"
      :search-string="searchString"
      :seq="seq"
      :current-page="currentPage"
      @event-details="handleDetails"
      @pager="handlePagerEvent"
    />
  </LayoutPage>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

import apiService from "@/services/api.service.js";
import { useView } from "@/composables/view";
import combineMenu from "@/utils/combine";
import TKOrdersList from "@/components/TKOrdersList.vue";

import AccessRightsEnum from "@/enums/AccessRights";
import RouteNames from "@/router/routeNames";

const _storageID = "OrdersView.list.selected_menu";

// name: "OrdersView",

/// SETUP

const router = useRouter();
const { view, checkAuthRole, toggleSidePanel, storageSaveValue, storageLoadValue } = useView("OrdersView");

view.title = "Заказы";
view.subTitle = "Работа с заказами";

/// DATA

const searchString = ref("");
const seq = ref(0);
const menuSelectedId = ref(999);
const currentPage = ref(0);
const totalPages = ref(0);

const menu = ref([
  { id: null, name: "Все", icon: "folder" },
  { id: 0, name: "Новый", icon: "shopping cart" },
  { id: 1, name: "Проверка", icon: "check square", label: "" },
  { id: 2, name: "Оплата", icon: "dollar sign" },
  { id: 7, name: "Сборка", icon: "boxes" },
  { id: 3, name: "К отправке", icon: "box" },
  { id: 4, name: "Отправлен", icon: "shipping fast" },
  { id: 5, name: "Получен", icon: "grin stars" },
  { id: 6, name: "Отменён", icon: "times circle" },
]);

/// COMPUTED

const checkAuthNewOrder = computed(() => {
  return checkAuthRole(AccessRightsEnum.OrdersEdit);
});

const isPageLast = computed(() => {
  return currentPage.value >= totalPages.value - 1;
});

const pageText = computed(() => {
  return `${currentPage.value + 1} из ${totalPages.value}`;
});

/// WATCHERS

watch(
  () => menuSelectedId.value,
  (newValue, oldValue) => {
    console.warn(newValue);
    currentPage.value = 0;
    storageSaveValue(_storageID, newValue);
    fetchOrdersCount();
  }
);

watch(
  () => searchString.value,
  (newValue, oldValue) => {
    console.warn(newValue);
    currentPage.value = 0;
  }
);

/// FUNCTIONS

async function fetchOrdersCount() {
  await apiService
    .getOrdersCount()
    .then((counts) => combineMenu(counts, menu.value))
    .catch(console.error);
}

function newOrder() {
  router.push({ name: "order_new" });
}

function handleDetails(item) {
  // console.log("row clicked: " + item.id);
  router.push({ name: "order_details", params: { id: item.id } });
}

function handlePagerEvent(event) {
  totalPages.value = event.total_pages;
  currentPage.value = event.current_page;
}

function reload() {
  seq.value++;
  fetchOrdersCount();
}

function pageUp() {
  currentPage.value++;
}
function pageDown() {
  currentPage.value--;
}

/// RUN

menuSelectedId.value = storageLoadValue(_storageID);
</script>
