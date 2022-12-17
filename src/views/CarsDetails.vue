<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('cars')" />

      <!--  -->
      <UISpacer />
      <!--  -->
      <UIButton
        v-if="(car.ref_car_status == 3 || car.ref_car_status == 9) && checkAuthRole('manager')"
        text="Выдать"
        :class="{ disabled: car.ref_car_status != 3 }"
        @click="actionSetStatus(9)"
      />
      <UIButton
        v-if="car.ref_car_status != 0 && car.ref_car_status != 4 && checkAuthRole('manager')"
        type="right labeled"
        text="Продать"
        icon="right chevron"
        :class="{ disabled: car.ref_car_status != 1 }"
        @click="actionSell"
      />
      <UIButton
        v-if="car.ref_car_status == 0 && checkAuthRole('manager')"
        type="right labeled"
        text="Купить"
        icon="right chevron"
        :class="{ disabled: car.ref_car_status != 0 || !car.investor_id > 0 }"
        @click="actionBuy"
      />
      <UIButton
        v-if="car.ref_car_status == 4 && checkAuthRole('manager')"
        text="В черновик"
        :class="{ disabled: car.ref_car_status != 4 && checkAuthRole('director') }"
        @click="actionSetStatus(0)"
      />
      <!-- <UIButton
        icon="right chevron"
        type="right labeled "
        @click="actionChangeBranch"
        :class="{ disabled: ![0, 1].includes(this.car.ref_car_status) }"
        >Изменить филиал</UIButton
      > -->
      <!--  -->
      <UISpacer />
      <!-- Выкуп -->
      <UIButton
        v-if="checkAuthRole('manager')"
        type="green"
        text="Договор выкупа"
        icon=""
        :class="{ disabled: car.ref_car_status != 1 || !checkAuthRole('contracts.create') }"
        @click="createContract"
      />
      <!-- Прокат -->
      <UIButton
        v-if="checkAuthRole('manager')"
        type="blue"
        text="Договор аренды"
        icon=""
        :class="{ disabled: car.ref_car_status != 1 || !checkAuthRole('contracts.create') }"
        @click="createRentContract"
      />
      <!--  -->
      <UISpacer />
      <!-- Statuses -->
      <!-- <div v-if="checkAuthRole('manager')" class="ui compact buttons">
        <button
          class="ui button"
          :class="{ disabled: car.ref_car_status < 5 || car.ref_car_status == 9 }"
          @click="actionSetStatus(1)"
        >
          В гараж
        </button>
        <button
          class="ui button"
          :class="{ disabled: car.ref_car_status != 1 && car.ref_car_status != 6 }"
          @click="actionSetStatus(5)"
        >
          В ремонт
        </button>
        <button
          class="ui button"
          :class="{ disabled: car.ref_car_status != 1 && car.ref_car_status != 5 }"
          @click="actionSetStatus(6)"
        >
          В аренду
        </button>
      </div> -->

      <!-- В ремонт -->
      <UIButton
        v-if="car.ref_car_status == 1"
        :class="{ disabled: car.ref_car_status != 1 && car.ref_car_status != 6 }"
        text="В ремонт"
        @click="actionSetStatus(5)"
      />
      <!-- Из ремонта -->
      <UIButton v-if="car.ref_car_status == 5" text="Завершить обслуживание" @click="modals.finishService = true" />
      <UISpacer />
      <!--  -->
      <UIButton
        v-if="checkAuthRole('manager')"
        type="basic labeled"
        text="Изменить"
        icon="edit"
        :class="{ disabled: !checkAuthRole('cars.edit') }"
        @click="edit"
      />
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
      <router-view :car="car" @update="fetchCar(car_id)"></router-view>
    </div>

    <!-- Modals -->
    <FormCarBuy
      :active="modals.buy"
      :car-id="car_id"
      :purchase-price="car.purchase_price"
      @hide="modals.buy = false"
      @saved="buyDone"
    />
    <!------->
    <FormCarSell :active="modals.sell" :car-id="car_id" @hide="modals.sell = false" @saved="sellDone" />
    <!------->
    <FormCarChangeBranch
      :active="modals.changeBranch"
      :car-id="car_id"
      :current-branch="car.branch_id"
      @hide="modals.changeBranch = false"
      @saved="changeBranchDone"
    />
    <!--  -->
    <ModalFinishCarService v-model:active="modals.finishService" @approved="actionSetStatus(1)" />
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import FormCarBuy from "@/components/FormCarBuy.vue";
import FormCarSell from "@/components/FormCarSell.vue";
import FormCarChangeBranch from "@/components/FormCarChangeBranch.vue";
import ModalFinishCarService from "@/components/ModalFinishCarService.vue";

const kTABS = [
  { name: "ОСНОВНОЕ", id: "general" },
  { name: "ОПЕРАЦИИ", id: "transactions" },
  { name: "ИТОГИ", id: "totals" },
  { name: "ДТП", id: "accidents" },
  { name: "ШТРАФЫ", id: "car_fines" },
  { name: "ФОТО", id: "photos" },
  { name: "ДОКУМЕНТЫ", id: "documents" },
  { name: "ФОТО-ОТЧЕТЫ", id: "photo_reports" },
  { name: "ИСТОРИЯ", id: "history" },
  { name: "НАСТРОЙКИ", id: "prefs" },
];

export default {
  name: "CarsDetails",
  components: {
    FormCarBuy,
    FormCarSell,
    FormCarChangeBranch,
    ModalFinishCarService,
  },
  mixins: [viewMixin],

  props: {
    car_id: {
      type: Number,
    },
  },

  data() {
    return {
      // View
      view: { title: "Автомобиль", subTitle: "Детализация" },
      // Models
      car: {},
      // Modals
      modals: {
        buy: false,
        sell: false,
        changeBranch: false,
        finishService: false,
      },
      // Tabs
      tabs: [],
    };
  },

  created() {
    // console.log(">> ", this.$store.getters["auth/getAuthRights"]);

    //
    this.createTabs();
  },

  mounted() {
    // console.log(">> MOUNTED");

    if (this.car_id !== undefined) {
      this.fetchCar(this.car_id);
    }
  },

  methods: {
    tabIsActive(name) {
      const paths = this.$route.path.split("/");
      return paths[paths.length - 1] == name;
    },
    setTitle() {
      this.view.title =
        this.car.brand +
        " " +
        this.car.model +
        " " +
        this.car.year_of_issue +
        " [" +
        this.$filters.plate(this.car.plate_number).replace(" ", "|") +
        "] " +
        "(" +
        this.car_id +
        ")";
      this.view.subTitle = this.car.car_status;
    },
    // ---
    edit() {
      this.$router.push({ name: "cars_edit" });
    },
    createContract() {
      if (this.car_id) {
        this.$router.push({
          name: "new_contract",
          query: { car_id: this.car_id },
        });
      }
    },
    createRentContract() {
      if (this.car_id) {
        this.$router.push({
          name: "new_contract_rent",
          query: { car_id: this.car_id },
        });
      }
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
        this.$router.push({ name: `cars_details_${name}`, params: { id: this.car_id } });
      }
    },
    // Actions
    actionBuy() {
      this.modals.buy = true;
      // this.fetchBuyCar(this.car_id);
    },
    actionSell() {
      this.modals.sell = true;
    },
    actionTransfer() {
      var confirmed = confirm("Вы действительно хотите выдать автомобиль?");
      if (confirmed) {
        this.fetchSetStatus(this.car_id, 9);
      }
    },
    actionSetStatus(status) {
      this.fetchSetStatus(this.car_id, status);
    },
    actionChangeBranch() {
      this.modals.changeBranch = true;
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
    changeBranchDone() {
      console.log("changeBranch done!");
      this.fetchCar(this.car_id);
      this.keys.history++;
    },

    // Networking
    async fetchCar(car_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getCar(car_id);
        this.car = result;
        this.setTitle();
        this.createTabs();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchSetStatus(car_id, status) {
      this.isLoading = true;
      try {
        await apiService.setCarStatus(car_id, status);
        this.fetchCar(this.car_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
