<template>
  <div>
    <!-- Toolbar -->
    <div class="ui-tool-bar-local">
      <!-- Оплата -->
      <UIButton
        :disabled="order?.status.fixed != 1 || !checkAuthPaymentsDeposit"
        text="Внести оплату"
        icon="ruble sign"
        type="right labeled"
        @click="actionDeposit"
      />
      <UIButton
        :disabled="(order?.status.fixed != 1 && order?.payment_status_id == 0) || !checkAuthPaymentsRefund"
        text="Возврат"
        @click="actionRefund"
      />
      <!-- <UISpacer />
      <UIButton
        :disabled="(order?.status.fixed != 1 && order?.payment_status_id == 0) || !checkAuthPaymentsAcquiring"
        text="Cчёт на оплату"
        @click="actionMakeInvoice"
      /> -->
    </div>
    <div class="ui divider"></div>
    <!-- /Toolbar -->

    <!-- Results -->
    <TKOrderTransactionsResults v-if="order?.id" :key="keys.update" :order-id="order?.id" />

    <!-- Tabs -->
    <div class="ui top pointing secondary menu">
      <div class="item" :class="{ active: secondaryActiveTab == 1 }" @click="secondaryActiveTab = 1">ОПЕРАЦИИ</div>
      <div class="item" :class="{ active: secondaryActiveTab == 2 }" @click="secondaryActiveTab = 2">
        СЧЕТА НА ОПЛАТУ
      </div>
    </div>

    <!-- Operations -->
    <TKOperationsList
      v-if="secondaryActiveTab == 1"
      :key="keys.update"
      operations-type="orders"
      :operations-subject-id="order?.id"
      :show-basis="false"
    />

    <!-- Invoices -->
    <CMPaymentsInvoicesList
      v-else-if="secondaryActiveTab == 2"
      :key="keys.invoices"
      :filter="{ subject_type: 'order', subject_id: order?.id }"
      bordered
      @event-details="handleInvoiceDetails"
    />
    <!-- </keep-alive> -->
    <!--  -->
    <!-- Deposit Modal -->
    <ModalOrderDeposit v-model:active="modals.deposit" :order-id="order?.id" @created="depositCreated" />
    <!-- Refund Modal -->
    <ModalOrderRefund v-model:active="modals.refund" :order-id="order?.id" @created="depositCreated" />
    <!-- Make Invoice -->
    <!-- <ModalOrderMakeInvoice v-model:active="modals.invoice" :order="order" @created="invoiceCreated" /> -->
    <!--  -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

import { useCheckAuth } from "@/composables/checkAuth";
import { useNavigation } from "@/composables/navigation";

import AccessRights from "@/enums/AccessRights";

import TKOperationsList from "@/components/TKOperationsList.vue";
import TKOrderTransactionsResults from "@/components/TKOrderTransactionsResults.vue";
import CMPaymentsInvoicesList from "@/components/CMPaymentsInvoicesList.vue";
import ModalOrderDeposit from "@/components/ModalOrderDeposit.vue";
import ModalOrderRefund from "@/components/ModalOrderRefund.vue";
// import ModalOrderMakeInvoice from "@/components/ModalOrderMakeInvoice.vue";

// name: "TKOrderDetailsTabTransactions",

/// SETUP

const { checkAuthRole } = useCheckAuth();
const { navigateTo } = useNavigation();

/// PROPS

const props = defineProps({
  order: {
    type: Object,
    default: null,
  },
});

/// EMITS

const emit = defineEmits(["update"]);

/// DATA

const secondaryActiveTab = ref(1);

const keys = ref({
  update: 1,
  invoices: 1,
});

const modals = ref({
  deposit: false,
  refund: false,
  invoice: false,
});

/// COMPUTED

const checkAuthPaymentsDeposit = computed(() => {
  return checkAuthRole(AccessRights.PaymentsDeposit);
});

const checkAuthPaymentsRefund = computed(() => {
  return checkAuthRole(AccessRights.PaymentsRefund);
});
const checkAuthPaymentsAcquiring = computed(() => {
  return checkAuthRole(AccessRights.Acquiring);
});

/// FUNCTIONS

function actionDeposit() {
  modals.value.deposit = true;
}

function actionRefund() {
  modals.value.refund = true;
}

function actionMakeInvoice() {
  modals.value.invoice = true;
}

function depositCreated() {
  //
  keys.value.update++;
  emit("update");
}

function handleInvoiceDetails(item) {
  navigateTo.Payments.Details({ invoiceId: item.id });
}
</script>
