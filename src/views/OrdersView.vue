<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UIButton icon="filter" type="labeled basic" style="min-width: 10em" @click="toggleSideMenu">
        <span v-if="showSideMenu">Скрыть</span>
        <span v-else>Показать</span>
      </UIButton>
      <!--  -->
      <UIButton icon="refresh" type="icon basic" title="Обновить список" @click="reload" />

      <!--  -->
      <UISpacer />
      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <!--  -->
      <UISpacer />
      <!--  -->
      <UIButton :disabled="!checkAuthNewOrder" icon="plus" type="right labeled" text="Новый заказ" @click="newOrder" />
    </template>
    <!-- /Toolbar -->
    <!-- Side Menu -->
    <template v-if="showSideMenu" #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>
    <!-- List -->
    <TKOrdersList
      :filter-status="[menuSelectedId]"
      :header-sticked-at="42"
      :search-string="searchString"
      :seq="seq"
      @event-details="handleDetails"
    />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import { CheckAuthMixin } from "@/mixins/CheckAuthMixin.js";

import apiService from "@/services/api.service.js";

import LayoutPage from "@/components/LayoutPage.vue";
import TKOrdersList from "@/components/TKOrdersList.vue";

export default {
  name: "OrdersView",

  components: {
    TKOrdersList,
    LayoutPage,
  },

  mixins: [viewMixin, CheckAuthMixin],

  data() {
    return {
      searchString: "",
      //
      view: { title: "Заказы", subTitle: "Работа с заказами" },
      showSideMenu: true,
      menu: [
        { id: null, name: "Все", icon: "folder" },
        { id: 0, name: "Новый", icon: "shopping cart" },
        { id: 1, name: "Проверка", icon: "check square", label: "" },
        { id: 2, name: "Оплата", icon: "dollar sign" },
        { id: 3, name: "К отправке", icon: "box" },
        { id: 4, name: "Отправлен", icon: "truck" },
        { id: 5, name: "Получен", icon: "grin stars" },
        { id: 6, name: "Отменён", icon: "times circle" },
      ],
      menuSelectedId: 999,
      // UI
      seq: 0,
    };
  },

  watch: {
    menuSelectedId: {
      immediate: false,
      handler(newValue) {
        // console.log("menuSelectedId", newValue);
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
      // console.log("->", selected_menu_params);
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
    newOrder() {
      this.$router.push({ name: "order_new" });
    },
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.$router.push({ name: "order_details", params: { id: item.id } });
    },
    toggleSideMenu() {
      this.showSideMenu = !this.showSideMenu;
      localStorage.setItem(this.$options.name + ".list.show_side_menu", this.showSideMenu);
    },
    reload() {
      this.seq++;
      this.fetchOrdersCount();
    },
    async fetchOrdersCount() {
      try {
        let result = await apiService.getOrdersCount();
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
