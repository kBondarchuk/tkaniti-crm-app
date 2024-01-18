<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Toggle -->
      <!-- <ToolbarSideMenuToggleButton :id="$options.name" /> -->

      <UIButton icon="filter" type="labeled basic" style="min-width: 10em" @click="viewToggleSideMenu">
        <span v-if="viewShowSideMenu">Скрыть</span>
        <span v-else>Показать</span>
      </UIButton>

      <!-- Refresh -->
      <UIButton icon="refresh" type="icon basic" title="Обновить список" @click="reload" />
      <UISpacer />

      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <UISpacer />

      <!-- New -->
      <UIButton :disabled="!checkAuthNewOrder" icon="plus" type="right labeled" text="Новый заказ" @click="newOrder" />
    </template>
    <!-- /Toolbar -->

    <!-- Side Menu -->
    <template v-if="viewShowSideMenu" #side>
      <LayoutSideMenu v-model="viewSideMenuSelectedId" :items="menu" :sticky-at="56" />
    </template>

    <!-- List -->
    <TKOrdersList
      :filter-status="[viewSideMenuSelectedId]"
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

import TKOrdersList from "@/components/TKOrdersList.vue";

export default {
  name: "OrdersView",

  components: {
    TKOrdersList,
  },

  mixins: [viewMixin, CheckAuthMixin],

  data() {
    return {
      searchString: "",
      // UI
      view: { title: "Заказы", subTitle: "Работа с заказами" },
      menu: [
        { id: null, name: "Все", icon: "folder" },
        { id: 0, name: "Новый", icon: "shopping cart" },
        { id: 1, name: "Проверка", icon: "check square", label: "" },
        { id: 2, name: "Оплата", icon: "dollar sign" },
        { id: 7, name: "Сборка", icon: "boxes" },
        { id: 3, name: "К отправке", icon: "box" },
        { id: 4, name: "Отправлен", icon: "shipping fast" },
        { id: 5, name: "Получен", icon: "grin stars" },
        { id: 6, name: "Отменён", icon: "times circle" },
      ],
      seq: 0,
    };
  },

  methods: {
    newOrder() {
      this.$router.push({ name: "order_new" });
    },
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.$router.push({ name: "order_details", params: { id: item.id } });
    },
    reload() {
      this.seq++;
      this.fetchOrdersCount();
    },
    viewSideMenuSelected(id) {
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
