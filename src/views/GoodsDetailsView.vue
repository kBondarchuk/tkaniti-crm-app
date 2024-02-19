<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <YBackButton to="goods" />
      <UISpacer />

      <!-- Statuses -->
      <UIOptButtons
        v-if="good"
        :model-value="good.status_id"
        :options="modeOptions"
        :disabled="!checkAuthEditGood"
        @update:model-value="actionSetStatus"
      />
      <UISpacer />

      <!-- Edit -->
      <UIButton type="basic labeled" text="Изменить" icon="edit" :disabled="!checkAuthEditGood" @click="edit" />
      <!--  -->
    </template>

    <!-- Tabs -->
    <YDetailsTabs :tabs="tabs" @tab-select="tabLink" />

    <!-- Pages -->
    <div class="ui active tab" style="padding: 0 1.5em 1.5em 1.5em">
      <router-view :good="good" @update="fetchGood(good_id)"></router-view>
    </div>

    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";

import { useView } from "@/composables/view";
import { useDetailsTabs } from "@/composables/detailsTabs";

import { AccessRightsEnum } from "@/enums/index";
import RouteNames from "@/router/routeNames";

import UIOptButtons from "@/components/UIOptButtons.vue";

const kTABS = [
  { name: "ОСНОВНОЕ", id: "general" },
  { name: "ФОТО", id: "photos" },
  { name: "ЗАКАЗЫ", id: "orders", access: AccessRightsEnum.OrdersView },
];

export default {
  name: "GoodsDetailsView",

  components: {
    UIOptButtons,
  },

  props: {
    goodId: {
      type: Number,
      default: null,
    },
  },

  setup() {
    const { view, checkAuthRole } = useView("GoodsDetailsView");

    view.title = "Товар";
    view.subTitle = "Детализация";

    const { tabs } = useDetailsTabs(kTABS);

    return { tabs, view, checkAuthRole };
  },

  data() {
    return {
      // Models
      good: null,
      // UI
      modeOptions: [
        { id: 0, name: "Новый", title: "", icon: null, disabled: true },
        { id: 1, name: "На складе", title: "", icon: null },
        { id: 2, name: "В продаже", title: "", icon: null },
        { id: 4, name: "Приостановлено", title: "", icon: null },
        { id: 3, name: "Продано", title: "", icon: null },
      ],
    };
  },

  computed: {
    checkAuthEditGood() {
      return this.checkAuthRole(AccessRightsEnum.GoodsEdit);
    },
  },

  created() {
    if (this.goodId) {
      this.fetchGood(this.goodId);
    }
  },

  methods: {
    setTitle() {
      this.view.title = this.good?.name + " " + "(" + this.goodId + ")";
    },
    // ---
    edit() {
      this.$router.push({ name: RouteNames.Goods.Edit });
    },

    // Tabs
    tabLink(name) {
      this.$router.push({ name: RouteNames.Goods.Details + `_${name}`, params: { id: this.goodId } });
    },

    // Actions
    actionSetStatus(status) {
      console.warn(status);

      if (status == 3 || status == 4) return;
      this.fetchSetStatus(this.goodId, status);
    },

    // Networking
    async fetchGood(good_id) {
      try {
        var result = await apiService.getGood(good_id);
        console.warn(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.good = result;
      this.setTitle();
    },
    async fetchSetStatus(good_id, status) {
      try {
        await apiService.setGoodStatus(good_id, status);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }

      this.fetchGood(this.goodId);
    },
  },
};
</script>
