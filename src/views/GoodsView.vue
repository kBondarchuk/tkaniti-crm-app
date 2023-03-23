<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UIButton icon="filter" type="labeled basic" style="min-width: 10em" @click="toggleSideMenu">
        <span v-if="showSideMenu">Скрыть</span>
        <span v-else>Показать</span>
      </UIButton>
      <!-- View Mode -->
      <div class="ui compact basic icon buttons" :class="{ disabled: !checkAuthEditGood }" style="margin-left: 4.5rem">
        <button
          class="ui button"
          :class="{ active: viewMode == 0 }"
          title="Текстовый табличный вид"
          @click="viewMode = 0"
        >
          <i class="table icon"></i>
        </button>
        <button class="ui button" :class="{ active: viewMode == 1 }" title="Табличный вид с фото" @click="viewMode = 1">
          <i class="list icon"></i>
        </button>
        <button class="ui button" :class="{ active: viewMode == 2 }" title="Галлерея" @click="viewMode = 2">
          <i class="th icon"></i>
        </button>
      </div>
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
    <template v-if="showSideMenu" #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>
    <!-- List -->

    <TKGoodsGrid
      v-if="viewMode == 2"
      :filter-status="[menuSelectedId]"
      :header-sticked-at="42"
      :search-string="searchString"
      :view-mode="viewMode"
      @event-details="handleDetails"
    />
    <TKGoodsList
      v-else
      :filter-status="[menuSelectedId]"
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

import LayoutPage from "@/components/LayoutPage.vue";
import TKGoodsList from "@/components/TKGoodsList.vue";
import TKGoodsGrid from "@/components/TKGoodsGrid.vue";

export default {
  name: "GoodsView",

  components: {
    TKGoodsList,
    TKGoodsGrid,
    LayoutPage,
  },

  mixins: [viewMixin, CheckAuthMixin],

  data() {
    return {
      searchString: "",
      //
      view: { title: "Товары", subTitle: "Справочник товаров" },
      showSideMenu: true,
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
      menuSelectedId: 999,
      viewMode: 0, // 0 - text, 1 - image, 3 - grid
    };
  },

  watch: {
    menuSelectedId: {
      immediate: false,
      handler(newValue) {
        console.log("menuSelectedId", newValue);
        // Save menuSelectedId
        // if (newValue === null) {
        //   localStorage.removeItem("cars.list.selected_menu");
        // } else {
        localStorage.setItem(this.$options.name + ".list.selected_menu", newValue);
        // }
        // fetch
        this.fetchOrdersCount();
      },
    },
  },

  created() {
    // Load saved params
    const selected_menu_params = localStorage.getItem(this.$options.name + ".list.selected_menu");

    if (selected_menu_params) {
      console.log("->", selected_menu_params);
      this.menuSelectedId = JSON.parse(selected_menu_params);
    } else {
      this.menuSelectedId = null;
    }

    this.showSideMenu = JSON.parse(localStorage.getItem(this.$options.name + ".list.show_side_menu")) ?? true;
  },

  // mounted() {
  //   this.fetchOrdersCount();
  // },

  methods: {
    newGood() {
      this.$router.push({ name: "good_new" });
    },
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.$router.push({ name: "goods_details", params: { id: item.id } });
    },
    toggleSideMenu() {
      this.showSideMenu = !this.showSideMenu;
      localStorage.setItem(this.$options.name + ".list.show_side_menu", this.showSideMenu);
    },
    async fetchOrdersCount() {
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
