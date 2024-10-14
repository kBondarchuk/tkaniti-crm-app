<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Back -->
      <YBackButton to="customers" />
      <UISpacer />
      <!-- Edit -->
      <UIButton :disabled="!accessCustomerEdit" type="basic labeled" icon="edit" text="Изменить" @click="edit" />
    </template>
    <!-- /Toolbar -->

    <!-- Tabs -->
    <YDetailsTabs :tabs="tabs" />

    <!-- Pages -->
    <div class="ui active tab" style="padding: 0 1.5em 1.5em 1.5em">
      <router-view :customer="customer" @update="reload()"></router-view>
    </div>

    <!--  -->
  </LayoutPage>
</template>

<script setup>
import apiService from "@/services/api.service.js";

import { watchEffect, ref, reactive, computed } from "vue";

import { useView } from "@/composables/view";
import { useDetailsTabs } from "@/composables/detailsTabs";
import { useNavigation } from "@/composables/navigation";
import YDetailsTabs from "@/components/YDetailsTabs.vue";

import AccessRights from "@/enums/AccessRights";

const kTABS = [
  { name: "ОСНОВНОЕ", id: "general" },
  { name: "ЗАКАЗЫ", id: "orders", access: AccessRights.OrdersView },
  { name: "НАСТРОЙКИ", id: "options" },
];

// name: "TKCustomersDetailsView",

/// PROPS

const props = defineProps({
  customerId: {
    type: Number,
    default: null,
  },
});

/// SETUP

const viewId = "CustomersDetails";
const { tabs } = useDetailsTabs(kTABS);
const { view, checkAuthRole } = useView(viewId, {
  title: "Клиент",
  subTitle: "Детализация",
});
const { navigateTo } = useNavigation();

// setup() {
//   const { view, checkAuthRole } = useView("CustomersDetailsView");

//   view.title = "Клиент";
//   view.subTitle = "Детализация";

//   const { tabs } = useDetailsTabs(kTABS);

//   return { tabs, view, checkAuthRole };
// },

/// DATA

const customer = ref({});
// Modals
const modals = reactive({
  bonus: false,
  password: false,
});

/// COMPUTED

// Access Rights
const accessCustomerEdit = computed(() => {
  return checkAuthRole(AccessRights.Customers.Edit);
});

/// WATCH

watchEffect(async () => {
  console.warn("watchEffect", props.customerId);
  if (props.customerId) {
    customer.value = await apiService.getCustomer(props.customerId);
    // console.warn("getCustomer", customer.value);
    setTitle();
  }
});

/// FUNCTIONS

function edit() {
  navigateTo.Customers.Edit({ customerId: props.customerId });
}

function setTitle() {
  view.title = "Клиент " + props.customerId;

  if (Object.keys(customer.value).length > 0)
    view.title = customer.value._fio_full + " " + "(" + props.customerId + ")";
}

// methods: {
//   setTitle() {
//     this.view.title = "Клиент " + this.customerId;

//     if (this.customer === null) return;

//     this.view.title = this.customer?._fio_full + " " + "(" + this.customerId + ")";
//   },
// ---
function reload() {
  if (props.customerId) {
    this.fetchCustomer(props.customerId);
  }
}

// Network
//     async fetchCustomer(customer_id) {
//       this.isLoading = true;
//       try {
//         this.customer = await apiService.getCustomer(customer_id);
//         this.setTitle();
//       } catch (error) {
//         this.$UIService.showNetworkError(error);
//       }
//       this.isLoading = false;
//     },
//   },
// };
</script>

<style scoped>
.eight.wide.second.column {
  padding-left: 0;
}
</style>
