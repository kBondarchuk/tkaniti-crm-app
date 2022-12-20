<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('goods')" />

      <!--  -->
      <!-- <UISpacer /> -->
      <!--  -->

      <!-- <UIButton
        :class="{ disabled: ![0, 1].includes(good.status_id) }"
        text="Изменить филиал"
        @click="actionChangeBranch"
      /> -->
      <!--  -->
      <UISpacer />
      <!-- Выкуп -->

      <!--  -->
      <!-- Statuses -->
      <div class="ui compact buttons">
        <button class="ui button" :class="{ active: good.status_id == 0 }" @click="actionSetStatus(0)">Новый</button>
        <button class="ui button" :class="{ active: good.status_id == 1 }" @click="actionSetStatus(1)">
          На складе
        </button>
        <button class="ui button" :class="{ active: good.status_id == 2 }" @click="actionSetStatus(2)">
          <!-- <i class="circle icon" :class="{ green: good.status_id == 2 }"></i> -->
          В продаже
        </button>
        <button class="ui button" :class="{ active: good.status_id == 3 }" @click="actionSetStatus(3)">Продано</button>
      </div>
      <!--  -->
      <UISpacer />

      <!--  -->
      <UIButton
        type="basic labeled"
        text="Изменить"
        icon="edit"
        :class="{ disabled: !checkAuthRole('cars.edit') }"
        @click="edit"
      />
      <!--  -->
    </template>
    <!-- /Toolbar -->

    <!-- Tabs -->
    <div class="ui top tabular menu" style="padding-top: 1em; padding-left: 1.5em">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="item"
        :class="{ active: tabIsActive(tab.id) }"
        @click="tabLink(tab.id)"
      >
        {{ tab.name }}
      </div>
    </div>

    <!-- Pages -->
    <div class="ui active tab" style="padding: 0 1.5em 1.5em 1.5em">
      <router-view :good="good" @update="fetchGood(good_id)"></router-view>
    </div>

    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

const kTABS = [
  { name: "ОСНОВНОЕ", id: "general" },
  { name: "ФОТО", id: "photos" },
  { name: "ЗАКАЗЫ", id: "orders" },
];

export default {
  name: "GoodsDetailsView",

  components: {},

  mixins: [viewMixin],

  props: {
    goodId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // Models
      good: {},
      // Modals
      // modals: {
      //   buy: false,
      //   sell: false,
      //   changeBranch: false,
      //   finishService: false,
      // },
      // View
      view: { title: "Товар", subTitle: "Детализация" },
      // Tabs
      tabs: [],
    };
  },

  created() {
    // console.log(">> ", this.$store.getters["auth/getAuthRights"]);
    this.createTabs();
    //
    if (this.goodId !== undefined) {
      this.fetchGood(this.goodId);
    }
  },

  methods: {
    tabIsActive(name) {
      const paths = this.$route.path.split("/");
      return paths[paths.length - 1] == name;
    },
    setTitle() {
      this.view.title = this.good.name + " " + "(" + this.goodId + ")";
      // this.view.subTitle = this.car.car_status;
    },
    // ---
    edit() {
      this.$router.push({ name: "good_edit" });
    },

    createTabs() {
      //
      // console.log(">> ", this.$store.getters["auth/getAuthRights"]);

      this.tabs = kTABS;

      if (!this.checkAuthRole("operations")) {
        this.tabs = this.tabs.filter((item) => item.id !== "transactions");
      }

      if (!this.checkAuthRole("docs.view")) {
        this.tabs = this.tabs.filter((item) => item.id !== "documents");
      }

      if (!this.checkAuthRole("manager")) {
        this.tabs = this.tabs.filter(
          (item) => item.id !== "accidents" && item.id !== "car_fines" && item.id !== "history"
        );
      }

      if (!this.checkAuthRole("photo_reports")) {
        this.tabs = this.tabs.filter((item) => item.id !== "photo_reports");
      }

      if (!this.checkAuthRole("corp_director")) {
        this.tabs = this.tabs.filter((item) => item.id !== "prefs");
      }

      // console.log(">>>", this.tabs);
    },

    // Tabs
    tabLink(name) {
      if (!this.tabIsActive(name)) {
        this.$router.push({ name: `goods_details_${name}`, params: { id: this.goodId } });
      }
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
        this.createTabs();
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
