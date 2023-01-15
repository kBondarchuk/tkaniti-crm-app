<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UIButton icon="filter" type="labeled basic" style="min-width: 10em" @click="toggleSideMenu">
        <span v-if="showSideMenu">Скрыть</span>
        <span v-else>Показать</span>
      </UIButton>
      <!--  -->
      <UISpacer />
      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <!--  -->
      <UISpacer />
      <!--  -->
      <UIButton v-if="checkAuthRole('goods')" icon="plus" type="right labeled" text="Новый товар" @click="newGood" />
    </template>
    <!-- /Toolbar -->
    <!-- Side Menu -->
    <template v-if="showSideMenu" #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>
    <!-- List -->
    <TKGoodsList
      :filter-status="[menuSelectedId]"
      :header-sticked-at="42"
      :search-string="searchString"
      @event-details="handleDetails"
    />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import LayoutPage from "@/components/LayoutPage.vue";
import TKGoodsList from "@/components/TKGoodsList.vue";

export default {
  name: "GoodsView",

  components: {
    TKGoodsList,
    LayoutPage,
  },

  mixins: [viewMixin],

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
        { id: 3, name: "Продано", icon: "thumbs up" },
        // { id: 4, name: "Отправлен", icon: "car" },
        // { id: 5, name: "Получен", icon: "undo alternate" },
        // { id: 6, name: "Отменён", icon: "hourglass half" },
      ],
      menuSelectedId: 999,
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
