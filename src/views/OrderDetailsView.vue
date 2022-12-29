<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('orders')" />
      <!--  -->
      <UISpacer />
      <!--  -->
      <!-- Когда Новый -->
      <UIButton
        v-if="order.status_id == 0"
        text="Подтвердить"
        icon="thumbs up"
        type="right labeled"
        :class="{ disabled: !(order.basket.length > 0) }"
        @click="actionSetStatus(1)"
      />
      <!-- Когда Проверен -->
      <UIButton
        v-if="order.status_id == 1"
        text="В подготовку"
        icon="box open"
        type="right labeled"
        @click="actionSetStatus(2)"
      />
      <!-- Когда В подготовке -->
      <UIButton
        v-if="order.status_id == 2"
        text="К отправке"
        icon="box"
        type="right labeled"
        @click="actionSetStatus(3)"
      />
      <!-- Когда К отправке -->
      <UIButton
        v-if="order.status_id == 3"
        text="Отправлен"
        icon="truck"
        type="right labeled"
        @click="actionSetStatus(4)"
      />
      <!-- Когда Отправлен -->
      <UIButton
        v-if="order.status_id == 4"
        text="Заказ получен"
        icon="grin stars"
        type="right labeled"
        @click="actionSetStatus(5)"
      />
      <!--  -->

      <UISpacer />
      <!-- Всегда? -->
      <UIButton
        v-if="order.status_id != 6"
        text="Отменить"
        color=""
        icon="red times circle"
        type="basic labeled"
        @click="actionSetStatus(6)"
      />
      <!--  -->
      <UIButton type="basic labeled" text="Изменить" icon="edit" :class="{ disabled: !validateEdit }" @click="edit" />
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
      <router-view :order="order" @update="refetchOrder()"></router-view>
    </div>

    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

const kTABS = [
  { name: "ОСНОВНОЕ", id: "general" },
  { name: "РАСЧЕТЫ", id: "operations" },
  { name: "ИСТОРИЯ", id: "history" },
];

export default {
  name: "OrderDetailsView",

  components: {},

  mixins: [viewMixin],

  props: {
    orderId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // Models
      order: {},
      // Modals
      // modals: {
      //   buy: false,
      //   sell: false,
      //   changeBranch: false,
      //   finishService: false,
      // },
      // View
      view: { title: "Заказ", subTitle: "Детализация заказа" },
      // Tabs
      tabs: [],
    };
  },

  computed: {
    validateEdit() {
      //
      return this.checkAuthRole("cars.edit") && [0, 1, 2, 3, 4, 5].includes(this.order.status_id);
    },
  },

  created() {
    // console.log(">> ", this.$store.getters["auth/getAuthRights"]);
    this.createTabs();
    //
    if (this.orderId !== undefined) {
      this.fetchOrder(this.orderId);
    }
  },

  methods: {
    tabIsActive(name) {
      const paths = this.$route.path.split("/");
      return paths[paths.length - 1] == name;
    },
    setTitle() {
      this.view.title = "Заказ " + this.orderId + " ";
      // this.view.subTitle = this.car.car_status;
    },
    // ---
    edit() {
      this.$router.push({ name: "order_edit" });
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
        this.$router.push({ name: `order_details_${name}`, params: { id: this.orderId } });
      }
    },
    // Actions
    actionSetStatus(status) {
      var text;
      switch (status) {
        case 1:
          text = "Вы действительно хотите подтвердить заказ?";
          break;
        case 2:
          text = "Вы действительно хотите отправить заказ на подготовку?";
          break;
        case 3:
          text = "Вы действительно хотите отправить заказ на отправку?";
          break;
        case 4:
          text = "Заказ отправлен?";
          break;
        case 5:
          text = "Отметить заказ как полученный покупателем?";
          break;
        case 6:
          text = "Вы действительно хотите отменить заказ?";
          break;

        default:
          break;
      }
      var confirmed = confirm(text);
      if (confirmed) {
        this.postSetStatus(this.orderId, status);
      }
    },
    // Events
    refetchOrder() {
      this.fetchOrder(this.orderId);
    },

    // Networking
    async fetchOrder(order_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getOrder(order_id);
        this.order = result;
        console.warn(result);

        this.setTitle();
        this.createTabs();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async postSetStatus(order_id, status) {
      this.isLoading = true;

      try {
        await apiService.setOrderStatus(order_id, status);

        this.$UIService.showSuccess(`Заказ сменил статус!`);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }

      this.fetchOrder(order_id);
    },
  },
};
</script>
