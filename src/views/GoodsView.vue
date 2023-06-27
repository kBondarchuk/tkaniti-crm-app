<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!--  -->
      <UIButton icon="filter" type="labeled basic" style="min-width: 10em" @click="viewToggleSideMenu">
        <span v-if="viewShowSideMenu">Скрыть</span>
        <span v-else>Показать</span>
      </UIButton>

      <!-- View Mode -->
      <UIOptButtons v-model="viewMode" :options="modeOptions" style="margin-left: 4.5rem" />
      <!--  -->
      <UISpacer />
      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <!--  -->
      <UISpacer />
      <!--  -->
      <UIButton :disabled="!checkAuthNewGood" icon="plus" type="right labeled" text="Новый товар" @click="newGood" />
    </template>
    <!-- /Toolbar -->

    <!-- Side Menu -->
    <template v-if="viewShowSideMenu" #side>
      <LayoutSideMenu v-model="viewSideMenuSelectedId" :items="menu" :sticky-at="56" />
    </template>

    <!-- List -->
    <TKGoodsGrid
      v-if="viewMode == 2"
      :filter-status="[viewSideMenuSelectedId]"
      :header-sticked-at="42"
      :search-string="searchString"
      :view-mode="viewMode"
      @event-details="handleDetails"
    />
    <TKGoodsList
      v-else
      :filter-status="[viewSideMenuSelectedId]"
      :header-sticked-at="42"
      :search-string="searchString"
      :view-mode="viewMode"
      @event-details="handleDetails"
    />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import { CheckAuthMixin } from "@/mixins/CheckAuthMixin.js";

import apiService from "@/services/api.service.js";

import TKGoodsList from "@/components/TKGoodsList.vue";
import TKGoodsGrid from "@/components/TKGoodsGrid.vue";

import UIOptButtons from "@/components/UIOptButtons.vue";

export default {
  name: "GoodsView",

  components: {
    TKGoodsList,
    TKGoodsGrid,
    UIOptButtons,
  },

  mixins: [viewMixin, CheckAuthMixin],

  data() {
    return {
      searchString: "",
      // UI
      view: { title: "Товары", subTitle: "Справочник товаров" },
      menu: [
        { id: null, name: "Все", icon: "folder" },
        { id: 0, name: "Новый", icon: "edit" },
        { id: 1, name: "На складе", icon: "warehouse", label: "" },
        { id: 2, name: "В продаже", icon: "store" },
        { id: 4, name: "Приостановлено", icon: "hourglass half" },
        { id: 3, name: "Продано", icon: "thumbs up" },
        // { id: 4, name: "Отправлен", icon: "car" },
        // { id: 5, name: "Получен", icon: "undo alternate" },
        // { id: 6, name: "Отменён", icon: "hourglass half" },
      ],
      viewMode: 0, // 0 - text, 1 - image, 3 - grid
      modeOptions: [
        { id: 0, name: "", title: "Текстовый табличный вид", icon: "table" },
        { id: 1, name: "", title: "Табличный вид с фото", icon: "list" },
        { id: 2, name: "", title: "Галлерея", icon: "th" },
      ],
    };
  },

  methods: {
    newGood() {
      this.$router.push({ name: "good_new" });
    },
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.$router.push({ name: "goods_details", params: { id: item.id } });
    },
    viewSideMenuSelected(id) {
      this.fetchGoodsCount();
    },

    // Networking
    async fetchGoodsCount() {
      try {
        let result = await apiService.getGoodsCount();
        this.combineMenu(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
    combineMenu(counts) {
      this.menu
        .filter((item) => {
          return item.id >= 0;
        })
        .forEach((menuItem) => {
          const result = counts.find((obj) => obj.status_id == menuItem.id);

          if (result) {
            menuItem["label"] = result.count;
          }
        });
    },
  },
};
</script>
