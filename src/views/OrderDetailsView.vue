<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <!-- Back -->
      <BackButton to="orders" />
      <!--  -->
      <UISpacer />
      <!--  -->
      <!-- Откатить -->
      <!-- Если не оплачен -->
      <UIButton
        v-if="order?.status.previous_status_id != null"
        type="labeled basic"
        text="Откатить"
        icon="undo"
        :disabled="!checkAuthRevertOrder"
        @click="actionRevertStatus(order?.status.previous_status_id)"
      />
      <!-- :class="{ disabled: order?.payment_status_id != 0 }" -->

      <!-- Actions -->
      <UIButton
        v-if="actions[order?.status.next_status_id]?.id == order?.status.next_status_id"
        :text="actions[order?.status.next_status_id]?.text"
        :icon="actions[order?.status.next_status_id]?.icon"
        type=" labeled"
        :disabled="!checkAuthForwardOrder"
        @click="actionSetNextStatus(order?.status.next_status_id)"
      />

      <UISpacer />
      <template v-if="checkAuthForwardOrder && order?.status.need_payment == 1">
        <UIButton text="Внести номер посылки" type="basic" @click="actionEditParcelNumber" />
      </template>

      <UISpacer />

      <!-- Клон заказа -->
      <UIButton text="Клонировать" icon="clone" type="labeled" :disabled="!orderId" @click="cloneOrder" />
      <!-- Cancel -->
      <UIButton
        v-if="order?.status.cancel_status_id != null"
        text="Удалить заказ"
        color="red"
        icon="times"
        type="labeled"
        :disabled="!checkAuthCancelOrder"
        @click="actionCancelOrder"
      />
      <!--  -->
      <!-- <UIButton type="basic labeled" text="Изменить" icon="edit" :class="{ disabled: !validateEdit }" @click="edit" /> -->
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

const kActions = [
  {
    id: 0,
  },
  {
    id: 1,
    text: "Взять в работу",
    icon: "right arrow",
  },
  {
    id: 2,
    text: "Утвердить заказ",
    icon: "thumbs up",
  },
  {
    id: 3,
    text: "В подготовку",
    icon: "box",
  },
  {
    id: 4,
    text: "Отправлен",
    icon: "truck",
  },
  {
    id: 5,
    text: "Заказ получен",
    icon: "grin stars",
  },
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
      // UI
      actions: kActions,
    };
  },

  computed: {
    validateEdit() {
      //
      return this.checkAuthEditOrder && this.order?.status.editable == 1;
    },
  },

  watch: {
    orderId(newValue, oldValue) {
      this.fetchOrder(newValue);
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
    actionSetNextStatus(status) {
      var text;
      switch (status) {
        case 1:
          text = "Вы действительно хотите взять заказ в работу?";
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
        this.setOrderNextStatus(this.orderId, status);
      }
    },
    actionRevertStatus(status) {
      //
      // if (this.order?.status_id == OrderStatusEnum.New) return;
      // if (this.order?.status_id == OrderStatusEnum.Check) return;
      // if (this.order?.status_id == OrderStatusEnum.Canceled) return;

      const text = "Вы действительно хотите откатить заказ на предыдущую стадию?";
      var confirmed = confirm(text);
      if (confirmed) {
        this.setOrderPreviousStatus(this.orderId, status);
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
    cloneOrder() {
      const text = "Будет создана копия этого заказа.";
      var confirmed = confirm(text);
      if (confirmed) {
        this.fetchCloneOrder(this.orderId);
      }
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
    async setOrderNextStatus(order_id, status) {
      this.isLoading = true;

      try {
        await apiService.setOrderNextStatus(order_id, status);

        this.$UIService.showSuccess(`Заказ переведен на следующую стадию!`);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }

      this.fetchOrder(order_id);
    },
    async setOrderPreviousStatus(order_id, status) {
      this.isLoading = true;

      try {
        await apiService.setOrderPreviousStatus(order_id, status);

        this.$UIService.showSuccess(`Заказ возвращён на предыдущую стадию!`);
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
    async fetchCloneOrder(order_id) {
      this.isLoading = true;

      try {
        let result = await apiService.cloneOrder(order_id);
        console.warn(result);
        this.$router.push({ name: "order_details", params: { id: result.id } });

        this.$UIService.showSuccess(`Создан новый заказ!`);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }

      // this.fetchOrder(order_id);
    },
  },
};
</script>
