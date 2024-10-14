<template>
  <LayoutPage no-paddings toggle-panel-button :view-id="_viewId">
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Refresh -->
      <UIButton icon="refresh" type="icon basic" title="Обновить список" @click="reload" />
      <!-- View Mode -->
      <UIOptButtons v-model="viewMode" :options="modeOptions" type="icon" style="margin-left: 3.5rem" />
      <UISpacer />

      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <UISpacer />
      <!-- New -->
      <UIButton :disabled="!accessGoodCreate" icon="plus" type="right labeled" text="Новый товар" @click="newGood" />
    </template>

    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>

    <!-- List -->
    <TKGoodsGrid
      v-if="viewMode == 2"
      :key="seq"
      :filter-status="[menuSelectedId]"
      :header-sticked-at="42"
      :search-string="searchString"
      :view-mode="viewMode"
      @event-details="handleDetails"
    />
    <TKGoodsList
      v-else
      :key="viewMode + seq"
      :filter-status="[menuSelectedId]"
      :header-sticked-at="42"
      :search-string="searchString"
      :view-mode="viewMode"
      @event-details="handleDetails"
    />
  </LayoutPage>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";
import { useStorage, StorageSerializers } from "@vueuse/core";

import { useView } from "@/composables/view";
import { useNavigation } from "@/composables/navigation";

import AccessRights from "@/enums/AccessRights";

import combineMenu from "@/utils/combine";
import apiService from "@/services/api.service.js";

import TKGoodsList from "@/components/TKGoodsList.vue";
import TKGoodsGrid from "@/components/TKGoodsGrid.vue";
import UIOptButtons from "@/components/UIOptButtons.vue";

/// SETUP

const _viewId = "GoodsListView";
const _storageID = _viewId + ".list.selected_menu";

const { checkAuthRole } = useView(_viewId, {
  title: "Товары",
  subTitle: "Справочник товаров",
});
const { navigateTo } = useNavigation();

/// DATA

const searchString = useStorage(_viewId + ".list.search", "");
const menuSelectedId = useStorage(_storageID, null, undefined, {
  serializer: StorageSerializers.number,
});
const menu = ref([
  { id: null, name: "Все", icon: "folder" },
  { id: 0, name: "Новый", icon: "edit" },
  { id: 1, name: "На складе", icon: "warehouse", label: "" },
  { id: 2, name: "В продаже", icon: "store" },
  { id: 4, name: "Приостановлено", icon: "hourglass half" },
  { id: 3, name: "Продано", icon: "thumbs up" },
]);
const seq = ref(0);
const viewMode = ref(0); // 0 - text, 1 - image, 3 - grid

// UI
const modeOptions = ref([
  { id: 0, name: "", title: "Текстовый табличный вид", icon: "table" },
  { id: 1, name: "", title: "Табличный вид с фото", icon: "list" },
  { id: 2, name: "", title: "Галлерея", icon: "th" },
]);

/// COMPUTED

// Access Rights
const accessGoodCreate = computed(() => {
  return checkAuthRole(AccessRights.GoodsEdit);
});

/// WATCH

watchEffect(async () => {
  console.warn("watchEffect", menuSelectedId.value);
  await fetchGoodsCount();
});

/// FUNCTIONS

async function fetchGoodsCount() {
  await apiService
    .getGoodsCount()
    .then((counts) => combineMenu(counts, menu.value))
    .catch(console.error);
}

function reload() {
  seq.value++;
  fetchGoodsCount();
}

function newGood() {
  navigateTo.Goods.New();
}

function handleDetails(item) {
  navigateTo.Goods.Details({ goodId: item.id });
}
</script>
