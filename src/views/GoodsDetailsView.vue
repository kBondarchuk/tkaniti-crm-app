<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('goods')" />
      <!--  -->
      <UISpacer />
      <!-- Statuses -->
      <div class="ui compact basic buttons" :class="{ disabled: !checkAuthEditGood }">
        <button class="ui disabled button" :class="{ active: good?.status_id == 0, disabled: !checkAuthEditGood }">
          Новый
        </button>
        <button
          class="ui button"
          :class="{ active: good?.status_id == 1, disabled: !checkAuthEditGood }"
          @click="actionSetStatus(1)"
        >
          На складе
        </button>
        <button
          class="ui button"
          :class="{ active: good?.status_id == 2, disabled: !checkAuthEditGood }"
          @click="actionSetStatus(2)"
        >
          В продаже
        </button>
        <button class="ui button" :class="{ active: good?.status_id == 4, disabled: !checkAuthEditGood }">
          Приостановлено
        </button>
        <!-- @click="actionSetStatus(3)" -->
        <button class="ui button" :class="{ active: good?.status_id == 3, disabled: !checkAuthEditGood }">
          Продано
        </button>
      </div>
      <!--  -->
      <UISpacer />

      <!--  -->
      <UIButton type="basic labeled" text="Изменить" icon="edit" :disabled="!checkAuthEditGood" @click="edit" />
      <!--  -->
    </template>
    <!-- /Toolbar -->

    <!-- Tabs -->
    <UIDetailsTabs :tabs="tabs" @tab-select="tabLink" />

    <!-- Pages -->
    <div class="ui active tab" style="padding: 0 1.5em 1.5em 1.5em">
      <router-view :good="good" @update="fetchGood(good_id)"></router-view>
    </div>

    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";

import { viewMixin } from "@/mixins/ViewMixin.js";
import { CheckAuthMixin } from "@/mixins/CheckAuthMixin.js";
import { TabsMixin } from "@/mixins/TabsMixin.js";

import { AccessRightsEnum } from "@/enums/index";

const kTABS = [
  { name: "ОСНОВНОЕ", id: "general" },
  { name: "ФОТО", id: "photos" },
  { name: "ЗАКАЗЫ", id: "orders", access: AccessRightsEnum.OrdersView },
];

export default {
  name: "GoodsDetailsView",

  components: {},

  mixins: [viewMixin, CheckAuthMixin, TabsMixin],

  props: {
    goodId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // Models
      good: null,
      // View
      view: { title: "Товар", subTitle: "Детализация" },
      // Tabs
      tabs: [],
    };
  },

  created() {
    // console.log(">> ", this.$store.getters["auth/getAuthRights"]);
    this.createTabs(kTABS);
    //
    if (this.goodId !== undefined) {
      this.fetchGood(this.goodId);
    }
  },

  methods: {
    setTitle() {
      this.view.title = this.good?.name + " " + "(" + this.goodId + ")";
      // this.view.subTitle = this.car.car_status;
    },
    // ---
    edit() {
      this.$router.push({ name: "good_edit" });
    },

    // Tabs
    tabLink(name) {
      this.$router.push({ name: `goods_details_${name}`, params: { id: this.goodId } });
    },

    // Actions
    actionSetStatus(status) {
      this.fetchSetStatus(this.goodId, status);
    },
    // Events
    buyDone(new_request_id) {
      if (new_request_id === null) return;

      this.$router.push({
        name: "budget_request_details",
        params: { request_id: new_request_id },
      });
    },
    sellDone(new_request_id) {
      console.log("Sell done!", new_request_id);
      if (new_request_id === null) return;

      this.$router.push({
        name: "budget_request_details",
        params: { request_id: new_request_id },
      });
      // this.keys.transactions++;
      // this.fetchCar(this.car_id);
    },

    // Networking
    async fetchGood(good_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getGood(good_id);
        this.good = result;
        console.warn(result);

        this.setTitle();
        this.createTabs(kTABS);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchSetStatus(good_id, status) {
      this.isLoading = true;
      try {
        await apiService.setGoodStatus(good_id, status);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }

      this.fetchGood(this.goodId);
    },
  },
};
</script>
