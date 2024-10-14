<template>
  <LayoutPage no-paddings back-button="orders" :view-id="_viewId">
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
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
    </template>

    <!-- Tabs -->
    <YDetailsTabs :tabs="tabs" />

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

import { useView } from "@/composables/view";
import { useDetailsTabs } from "@/composables/detailsTabs";
import { useNavigation } from "@/composables/navigation";

import { OrderStatusEnum } from "@/enums/index";
import AccessRights from "@/enums/AccessRights";

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
    text: "Заказ собран",
    icon: "box",
  },
  {
    id: 4,
    text: "Заказ отправлен",
    icon: "truck",
  },
  {
    id: 5,
    text: "Заказ получен",
    icon: "grin stars",
  },
];

const kTitles = [
  {
    id: OrderStatusEnum.New,
    text: "Новый заказ",
  },
  {
    id: OrderStatusEnum.Check,
    text: "Проверка заказа",
  },
  {
    id: OrderStatusEnum.Payment,
    text: "Ожидание оплаты заказа",
  },
  {
    id: OrderStatusEnum.Picking,
    text: "Комплектация заказа",
  },
  {
    id: OrderStatusEnum.ReadyToShip,
    text: "Заказ готов к отправке",
  },
  {
    id: OrderStatusEnum.Shipped,
    text: "Заказ отправлен",
  },
];

export default {
  name: "OrderDetailsView",

  components: {
    ModalParcelNumberEdit,
  },

  props: {
    orderId: {
      type: Number,
      default: null,
    },
  },

  setup(props) {
    /// SETUP

    const _viewId = "OrderDetailsView";
    const { view, checkAuthRole } = useView(_viewId, {
      title: "Заказ",
      subTitle: "Детализация заказа",
    });

    const { tabs } = useDetailsTabs(kTABS);
    const { navigateTo } = useNavigation();

    /// FUNCTION
    // function edit() {
    //   navigateTo.Orders.Edit({ orderId: props.orderId });
    // }

    return { view, tabs, checkAuthRole, navigateTo, _viewId };
  },

  data() {
    return {
      // Model
      order: null,
      // Modals
      modals: {
        parcel: false,
      },
      // UI
      actions: kActions,
      titles: kTitles,
    };
  },

  computed: {
    // Auth
    checkAuthRevertOrder() {
      return this.checkAuthRole(AccessRights.OrdersRevert);
    },
    checkAuthForwardOrder() {
      return this.checkAuthRole(AccessRights.OrdersForward);
    },
    checkAuthCancelOrder() {
      return this.checkAuthRole(AccessRights.OrdersCancel);
    },

    // Validate
    validateEdit() {
      return this.checkAuthEditOrder && this.order?.status.editable == 1;
    },
  },

  watch: {
    orderId(newValue, oldValue) {
      this.fetchOrder(newValue);
    },
  },

  created() {
    if (this.orderId !== undefined) {
      this.fetchOrder(this.orderId);
    }
  },

  methods: {
    setTitle() {
      this.view.title = "Заказ " + this.orderId + " ";
      this.view.subTitle = this.titles.find((item) => item.id == this.order?.status_id)?.text ?? "Работа с заказом";
    },
    // ---

    // Actions
    actionSetNextStatus(status) {
      var text;
      switch (status) {
        case OrderStatusEnum.Check:
          text = "Вы действительно хотите взять заказ в работу?";
          break;
        case OrderStatusEnum.Payment:
          text = "Вы действительно хотите утвердить заказ?";
          break;
        case OrderStatusEnum.ReadyToShip:
          text = "Заказ готов к отправке?";
          break;
        case OrderStatusEnum.Shipped:
          text = "Заказ отправлен?";
          break;
        case OrderStatusEnum.Received:
          text = "Отметить заказ как полученный покупателем?";
          break;
        case OrderStatusEnum.Canceled:
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
        // this.createTabs(kTABS);
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
        this.navigateTo.Orders.Details({ orderId: result.id });

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
