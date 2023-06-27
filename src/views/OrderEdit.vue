<template>
  <LayoutPage no-vertical-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Back -->
      <BackButton />
      <UISpacer />

      <template v-if="order?.status_id != 6 && order?.id">
        <!-- Всегда? -->
        <!-- <UIButton
          text="Отменить"
          color=""
          icon="red times circle"
          type="basic labeled"
          :disabled="!checkAuthCancelOrder"
          @click="actionCancelOrder(order.id)"
        /> -->
        <UISpacer />
      </template>
      <UIButton text="Сохранить" type="primary" :class="validateSubmit" @click.prevent="actionsSave" />
    </template>
    <!-- /Toolbar -->

    <!-- Form -->
    <form
      class="ui form"
      method="post"
      action
      :class="{ loading: isLoading }"
      style="height: 100%; margin-top: 1rem; margin-bottom: 1rem"
    >
      <!-- Grid -->
      <div class="ui grid" style="height: 100%">
        <!-- fist column -->
        <div class="six wide column" style="background-color: #22242605">
          <div class="one field">
            <!-- Customer -->
            <CUISelectCustomer :customer-id="order.customer_id" @selected="customerSelected" />
          </div>

          <div class="ui hidden divider"></div>

          <div class="two fields">
            <!-- ФИО -->
            <UITextfield v-model="order.customer_fio" label="ФИО получателя" />
            <!-- Номер телефона -->
            <UIInputPhone v-model="order.customer_phone" label="Номер телефона" />
            <!-- Адрес доставки -->
            <!-- <UITextfield v-model="order.delivery_address" label="Адрес доставки" /> -->
          </div>

          <div class="one field">
            <!-- Комментарий -->
            <UITextAria v-model="order.customer_notes" label="Комментарий покупателя" rows="3" />
          </div>

          <div class="ui hidden divider"></div>

          <div class="two fields">
            <!-- Метод оплаты -->
            <UIInputDropdown v-model="order.payment_method_id" label="Метод оплаты" :options="optionsPaymentMethod" />
          </div>

          <div class="ui hidden divider"></div>

          <div class="two fields">
            <!-- Метод доставки -->
            <UIInputDropdown
              v-model="order.delivery_method_id"
              label="Метод доставки"
              :options="optionsDeliveryMethod"
            />
            <!-- Другой метод доставки -->
            <UITextfield
              v-model="order.delivery_method_other"
              :class="{ disabled: order.delivery_method_id != 999 }"
              label="Другой метод доставки"
            />
          </div>

          <div class="one field">
            <!-- Адрес доставки -->
            <UITextAria v-model="order.delivery_address" label="Адрес доставки" rows="5" />
          </div>

          <div class="two fields">
            <!-- Отложенная отправка -->
            <UIInputDate v-model="order.delivery_date" label="Отложить до" />
          </div>

          <div class="ui hidden divider"></div>

          <div class="one field">
            <!-- Комментарий -->
            <UITextAria v-model="order.notes" label="Комментарий сотрудника" rows="5" />
          </div>

          <div class="ui error message"></div>
        </div>

        <!-- second column -->
        <div class="ten wide second column">
          <!-- Список товаров (корзина) -->
          <TKOrderBasketEdit
            v-if="order?.status?.editable == 1"
            v-model="order.basket"
            :order="order"
            @basket="basketChanged"
          />
          <TKOrderBasket v-else :order="order" />
        </div>
      </div>
    </form>
    <!-- /Form -->

    <!------->
  </LayoutPage>
</template>

<script>
import { toRaw } from "vue";

import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";
import { CheckAuthMixin } from "@/mixins/CheckAuthMixin.js";

import TKOrderBasketEdit from "@/components/TKOrderBasketEdit.vue";
import TKOrderBasket from "@/components/TKOrderBasket.vue";

import CUISelectCustomer from "@/components/CUISelectCustomer.vue";

import OrderObject from "@/objects/Order";

export default {
  name: "OrderEdit",

  components: {
    TKOrderBasketEdit,
    TKOrderBasket,
    CUISelectCustomer,
  },

  mixins: [viewMixin, CheckAuthMixin],

  props: {
    orderId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // view
      view: {
        title: "Заказ",
        subTitle: "Редактирование заказа",
      },
      // model data
      // order: {
      //   // company_id: null,
      // },
      order: Object.assign({}, OrderObject),
      // investor: undefined,
      // paramId: null,
      isLoading: false,

      // Delivery methods
      deliveryMethods: [],
      // Payment methods
      paymentMethods: [],
    };
  },

  computed: {
    optionsDeliveryMethod() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.deliveryMethods.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    optionsPaymentMethod() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.paymentMethods.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    // Validate
    validateSubmit() {
      return {
        disabled: false,
        // this.car.branch_id === null ||
        // this.car.branch_id === undefined ||
        // !this.car.model ||
        // !this.car.brand ||
        // this.car.year_of_issue.toString().length != 4,
      };
    },
  },

  created() {
    console.log("[OrderEdit]: Created Params.id: " + this.$route.params);
    // Get ID from params
    // this.paramId = this.$route.params.id === undefined ? null : parseInt(this.$route.params.id);
    this.reset();
    this.setTitle();
  },

  mounted() {
    if (this.orderId) {
      this.fetchBranchesThenItem(this.orderId);
    } else {
      this.fetchPaymentMethods();
      this.fetchDeliveryMethods();
    }
  },

  methods: {
    setTitle() {
      if (this.orderId === null) {
        this.view.title = "Новый заказ";
        this.view.subTitle = "Создание нового заказа";
      } else {
        this.view.title = "Заказ" + " " + this.orderId;
      }
    },
    // ---
    reset() {
      if (this.orderId === null) {
        this.order.status_id = 1;
        this.order.status = { editable: 1 }; // TODO: Подумать
      }
      // item
      // this.investor.id = item.id;
    },
    back() {
      if (this.orderId) {
        this.$router.push({ name: "order_details", id: this.orderId });
      } else {
        this.$router.push({ name: "orders" });
      }
    },
    basketChanged(basket) {
      //
      this.order.basket = structuredClone(toRaw(basket));
    },
    customerSelected(item) {
      // console.warn(item);
      this.order.customer_id = item.id;

      if (this.order.id == null) {
        this.order.customer_fio = item._fio_full;
        this.order.customer_phone = item.phone;
      }
    },
    actionsSave() {
      console.log("[OrderEdit]: SAVE " + JSON.stringify(this.order));

      if (this.order.id == null) {
        console.log("[OrderEdit]: create");
        this.create();
      } else {
        console.log("[OrderEdit]: update");
        this.update();
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

    // Networking
    async fetchBranchesThenItem(order_id) {
      await this.fetchPaymentMethods();
      await this.fetchDeliveryMethods();
      await this.fetchItem(order_id);
    },
    async fetchItem(order_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getOrder(order_id);
        this.order = result;
        // if (this.car.investor_id > 0) {
        //   this.fetchInvestor(this.car.investor_id);
        // }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },

    async fetchDeliveryMethods() {
      this.isLoading = true;
      try {
        this.deliveryMethods = await apiService.getDeliveryMethods();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPaymentMethods() {
      this.isLoading = true;
      try {
        this.paymentMethods = await apiService.getPaymentMethods();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async create() {
      console.log("[OrderEdit]: Create ", this.order);
      this.isLoading = true;

      try {
        let result = await apiService.createOrder(this.order);
        this.$router.push({ name: "order_details", params: { id: result.id } });
      } catch (error) {
        // console.error("!!!! " + error);
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async update() {
      console.log("[OrderEdit]: Update ", this.order);
      this.isLoading = true;
      try {
        await apiService.updateOrder(this.order);
        this.$router.push({ name: "order_details", params: { id: this.order.id } });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async cancelOrder(order_id) {
      this.isLoading = true;

      try {
        await apiService.cancelOrder(order_id);

        this.$UIService.showSuccess(`Заказ отменён!`);
        await this.fetchItem(order_id);
        this.back();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.second.column {
  border-left: 1px solid #80808040;
  padding-left: 1rem !important;
}
</style>
