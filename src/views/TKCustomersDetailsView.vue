<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton text="Назад" icon="left arrow" type="basic labeled" color="white" @click="back('customers')" />
      <UISpacer />
      <!--  -->
      <UIButton :disabled="!checkAuthEditCustomer" type="basic labeled" icon="edit" text="Изменить" @click="edit" />
    </template>
    <!-- /Toolbar -->
    <!-- Tabs -->
    <UIDetailsTabs :tabs="tabs" @tab-select="tabLink" />

    <!-- Pages -->
    <div class="ui active tab" style="padding: 0 1.5em 1.5em 1.5em">
      <router-view :customer="customer" @update="fetchCustomer()"></router-view>
    </div>

    <!-- <div class="ui top tabular menu"> -->
    <!-- <div class="item" :class="{ active: tabsComponent == 1 }" @click="tabSelect(1)">ОСНОВНОЕ</div> -->
    <!-- <div class="item" :class="{ active: tabsComponent == 5 }" @click="tabSelect(5)">ОПЕРАЦИИ</div>
      <div class="item" :class="{ active: tabsComponent == 2 }" @click="tabSelect(2)">ДОКУМЕНТЫ</div>
      <div class="item" :class="{ active: tabsComponent == 3 }" @click="tabSelect(3)">ЛИЧНЫЙ КАБИНЕТ</div>
      <div class="item" :class="{ active: tabsComponent == 4 }" @click="tabSelect(4)">ИСТОРИЯ</div> -->
    <!-- </div> -->
    <!-- Pages -->
    <!-- Page 1: General -->
    <!-- <div class="ui tab" :class="{ active: tabsComponent == 1 }">
       <LayoutTwoColumns> -->
    <!-- First column -->
    <!-- <TKCustomerDetails :key="keys.details" :customer-id="paramId" /> -->
    <!-- second column -->
    <!-- </LayoutTwoColumns> -->
    <!-- </div> -->

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
  { name: "ЗАКАЗЫ", id: "orders", access: AccessRightsEnum.OrdersView },
];

export default {
  name: "TKCustomersDetailsView",

  mixins: [viewMixin, CheckAuthMixin, TabsMixin],

  props: {
    customerId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      customer: null,
      paramId: null,
      // UI
      view: {
        title: "Клиент",
        subTitle: "Детализация",
      },
      tabsComponent: 1,
      // Tabs
      tabs: [],
      // Keys
      keys: { details: 0, history: 0, transactions: 0 },
      // Modals
      modals: {
        bonus: false,
        password: false,
      },
    };
  },

  created() {
    // console.log("Created Params.id: " + this.$route.params.id);
    this.createTabs(kTABS);

    if (this.customerId !== undefined) {
      this.fetchCustomer(this.customerId);
    }
  },

  methods: {
    setTitle() {
      this.view.title = "Клиент " + this.customerId;

      if (this.customer === null) return;

      this.view.title =
        this.customer?.last_name +
        " " +
        this.customer?.first_name +
        " " +
        this.customer?.second_name +
        " " +
        "(" +
        this.customerId +
        ")";
    },
    // ---
    reload() {
      console.log("Reload Params.id: " + this.$route.params.id);

      // Get ID from params
      if (this.customerId) {
        // this.setTitle(this.customerId);
        this.fetchCustomer(this.customerId);
      }
    },
    edit() {
      this.$router.push({ name: "customers_edit" });
    },

    // Tabs
    tabLink(name) {
      this.$router.push({ name: `customers_details_${name}`, params: { id: this.customerId } });
    },

    // Network
    async fetchCustomer(customer_id) {
      this.isLoading = true;
      try {
        this.customer = await apiService.getCustomer(customer_id);
        this.setTitle();
        this.createTabs(kTABS);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.eight.wide.second.column {
  padding-left: 0;
}
</style>
