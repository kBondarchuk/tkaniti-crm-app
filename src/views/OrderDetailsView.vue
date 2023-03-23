<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('orders')" />
      <!--  -->
      <UISpacer />
      <!--  -->
      <!-- Откатить -->
      <!-- Если не оплачен -->
      <UIButton
        v-if="![0, 6].includes(order?.status_id)"
        type="basic"
        text="Откатить"
        :class="{ disabled: order?.payment_status_id != 0 || [0, 1].includes(order?.status_id) }"
        :disabled="!checkAuthRevertOrder"
        @click="actionRevertStatus"
      />
      <!-- Когда Новый -->
      <UIButton
        v-if="order?.status_id == 0"
        text="Взять в работу"
        icon="thumbs up"
        type="right labeled"
        :class="{ disabled: !(order?.basket.length > 0) }"
        :disabled="!checkAuthForwardOrder"
        @click="actionSetStatus(1)"
      />
      <!-- Когда Проверен -->
      <UIButton
        v-if="order?.status_id == 1"
        text="Утвердить заказ"
        :disabled="!checkAuthForwardOrder"
        @click="actionSetStatus(2)"
      />
      <!-- icon="box open" type="right labeled"-->
      <!-- Когда В подготовке -->
      <UIButton
        v-if="order?.status_id == 2"
        text="В подготовку"
        icon="box"
        type="right labeled"
        :disabled="!checkAuthForwardOrder"
        @click="actionSetStatus(3)"
      />
      <!-- Когда К отправке -->
      <UIButton
        v-if="order?.status_id == 3"
        text="Отправлен"
        icon="truck"
        type="right labeled"
        :disabled="!checkAuthForwardOrder"
        @click="actionSetStatus(4)"
      />
      <!-- Когда Отправлен -->
      <UIButton
        v-if="order?.status_id == 4"
        text="Заказ получен"
        icon="grin stars"
        type="right labeled"
        :disabled="!checkAuthForwardOrder"
        @click="actionSetStatus(5)"
      />
      <!--  -->

      <template v-if="checkAuthForwardOrder">
        <UISpacer />
        <UIButton text="Внести номер посылки" type="basic" @click="actionEditParcelNumber" />
      </template>

      <UISpacer />
      <!-- Всегда? -->
      <UIButton
        v-if="order?.status_id != 6"
        text="Отменить"
        color=""
        icon="red times circle"
        type="basic labeled"
        :disabled="!checkAuthCancelOrder"
        @click="actionCancelOrder"
      />
      <!--  -->
      <UIButton type="basic labeled" text="Изменить" icon="edit" :class="{ disabled: !validateEdit }" @click="edit" />
      <!--  -->
    </template>
    <!-- /Toolbar -->

    <!-- Tabs -->
    <UIDetailsTabs :tabs="tabs" @tab-select="tabLink" />

    <!-- Pages -->
    <div class="ui active tab" style="padding: 0 1.5em 1.5em 1.5em">
      <router-view :order="order" @update="refetchOrder()"></router-view>
    </div>

    <!-- Parcel Modal -->
    <ModalParcelNumberEdit v-model:active="modals.parcel" :order-id="order?.id" @created="refetchOrder()" />
    <!--  -->

    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";

import { viewMixin } from "@/mixins/ViewMixin.js";
import { CheckAuthMixin } from "@/mixins/CheckAuthMixin.js";
import { TabsMixin } from "@/mixins/TabsMixin.js";

import { OrderStatusEnum } from "@/enums/index";

import ModalParcelNumberEdit from "@/components/ModalParcelNumberEdit.vue";

const kTABS = [
  { name: "ОСНОВНОЕ", id: "general" },
  { name: "РАСЧЕТЫ", id: "operations" },
  { name: "ИСТОРИЯ", id: "history" },
];

export default {
  name: "OrderDetailsView",

  components: {
    ModalParcelNumberEdit,
  },

  mixins: [viewMixin, CheckAuthMixin, TabsMixin],

  props: {
    orderId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // Model
      order: null,
      // View
      view: { title: "Заказ", subTitle: "Детализация заказа" },
      // Tabs
      tabs: [],
      // Modals
      modals: {
        parcel: false,
      },
    };
  },

  computed: {
    validateEdit() {
      //
      return this.checkAuthEditOrder && [1, 2, 3].includes(this.order?.status_id);
    },
  },

  created() {
    // console.log(">> ", this.$store.getters["auth/getAuthRights"]);
    this.createTabs(kTABS);
    //
    if (this.orderId !== undefined) {
      this.fetchOrder(this.orderId);
    }
  },

  methods: {
    setTitle() {
      this.view.title = "Заказ " + this.orderId + " ";
      // this.view.subTitle = this.car.car_status;
    },
    // ---
    edit() {
      this.$router.push({ name: "order_edit" });
    },

    // Tabs
    tabLink(name) {
      this.$router.push({ name: `order_details_${name}`, params: { id: this.orderId } });
    },
    // Actions
    actionSetStatus(status) {
      var text;
      switch (status) {
        case 1:
          text = "Вы действительно хотите редактировать заказ?";
          break;
        case 2:
          text = "Вы действительно хотите утвердить заказ?";
          break;
        case 3:
          text = "Вы действительно хотите отправить заказ на подготовку?";
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
    actionRevertStatus() {
      //
      if (this.order?.status_id == OrderStatusEnum.New) return;
      if (this.order?.status_id == OrderStatusEnum.Check) return;
      if (this.order?.status_id == OrderStatusEnum.Canceled) return;

      const text = "Вы действительно хотите откатить заказ на предыдущую стадию?";
      var confirmed = confirm(text);
      if (confirmed) {
        this.setOrderPreviousStatus(this.orderId);
      }
    },
    actionCancelOrder() {
      //
      const text = "Вы действительно хотите отменить заказ?";
      var confirmed = confirm(text);
      if (confirmed) {
        this.cancelOrder(this.orderId);
      }
    },
    actionEditParcelNumber() {
      this.modals.parcel = true;
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
        this.createTabs(kTABS);
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
    async setOrderPreviousStatus(order_id) {
      this.isLoading = true;

      try {
        await apiService.setOrderPreviousStatus(order_id);

        this.$UIService.showSuccess(`Заказ сменил статус!`);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }

      this.fetchOrder(order_id);
    },
    async cancelOrder(order_id) {
      this.isLoading = true;

      try {
        await apiService.cancelOrder(order_id);

        this.$UIService.showSuccess(`Заказ отменён!`);
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
