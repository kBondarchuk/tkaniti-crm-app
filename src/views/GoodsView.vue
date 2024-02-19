<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <YTogglePanelButton :show="view.showSidePanel" @click="toggleSidePanel" />
      <!-- Refresh -->
      <UIButton icon="refresh" type="icon basic" title="Обновить список" @click="reload" />
      <!-- View Mode -->
      <UIOptButtons v-model="viewMode" :options="modeOptions" type="icon" style="margin-left: 3.5rem" />
      <UISpacer />

      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <UISpacer />
      <!-- New -->
      <UIButton :disabled="!checkAuthNewGood" icon="plus" type="right labeled" text="Новый товар" @click="newGood" />
    </template>

    <!-- Side Menu -->
    <template v-if="view.showSidePanel" #side>
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

<script>
import { ref, computed, watch } from "vue";

import { useView } from "@/composables/view";
import combineMenu from "@/utils/combine";

import apiService from "@/services/api.service.js";

import TKGoodsList from "@/components/TKGoodsList.vue";
import TKGoodsGrid from "@/components/TKGoodsGrid.vue";

import UIOptButtons from "@/components/UIOptButtons.vue";
import AccessRightsEnum from "@/enums/AccessRights";
import RouteNames from "@/router/routeNames";

const _storageID = "GoodsView.list.selected_menu";

export default {
  name: "GoodsView",

  components: {
    TKGoodsList,
    TKGoodsGrid,
    UIOptButtons,
  },

  setup() {
    const { view, checkAuthRole, toggleSidePanel, storageSaveValue, storageLoadValue } = useView("GoodsView");

    view.title = "Товары";
    view.subTitle = "Справочник товаров";

    /// DATA

    const menu = ref([
      { id: null, name: "Все", icon: "folder" },
      { id: 0, name: "Новый", icon: "edit" },
      { id: 1, name: "На складе", icon: "warehouse", label: "" },
      { id: 2, name: "В продаже", icon: "store" },
      { id: 4, name: "Приостановлено", icon: "hourglass half" },
      { id: 3, name: "Продано", icon: "thumbs up" },
    ]);
    const seq = ref(0);

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

    return {
      view,
      seq,
      menu,
      reload,
      checkAuthRole,
      toggleSidePanel,
      storageSaveValue,
      storageLoadValue,
      fetchGoodsCount,
    };
  },

  data() {
    return {
      // UI
      modeOptions: [
        { id: 0, name: "", title: "Текстовый табличный вид", icon: "table" },
        { id: 1, name: "", title: "Табличный вид с фото", icon: "list" },
        { id: 2, name: "", title: "Галлерея", icon: "th" },
      ],
      searchString: "",
      viewMode: 0, // 0 - text, 1 - image, 3 - grid
      menuSelectedId: 999,
    };
  },

  computed: {
    checkAuthNewGood() {
      return this.checkAuthRole(AccessRightsEnum.GoodsEdit);
    },
  },

  watch: {
    menuSelectedId(newValue) {
      this.storageSaveValue(_storageID, newValue);
      this.fetchGoodsCount();
    },
  },

  created() {
    this.menuSelectedId = this.storageLoadValue(_storageID);
  },

  methods: {
    newGood() {
      this.$router.push({ name: RouteNames.Goods.New });
    },
    handleDetails(item) {
      this.$router.push({ name: RouteNames.Goods.Details, params: { id: item.id } });
    },
  },
};
</script>
