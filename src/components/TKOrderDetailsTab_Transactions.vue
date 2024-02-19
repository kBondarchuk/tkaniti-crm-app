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
      <UISpacer />
      <UIButton
        :disabled="(order?.status.fixed != 1 && order?.payment_status_id == 0) || !checkAuthPaymentsAcquiring"
        text="Cчёт на оплату"
        @click="actionMakeInvoice"
      />
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
    <ModalOrderMakeInvoice v-model:active="modals.invoice" :order="order" @created="invoiceCreated" />
    <!--  -->
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

import { useCheckAuth } from "@/composables/checkAuth";
import AccessRightsEnum from "@/enums/AccessRights";

import TKOperationsList from "@/components/TKOperationsList.vue";
import TKOrderTransactionsResults from "@/components/TKOrderTransactionsResults.vue";
import CMPaymentsInvoicesList from "@/components/CMPaymentsInvoicesList.vue";
import ModalOrderDeposit from "@/components/ModalOrderDeposit.vue";
import ModalOrderRefund from "@/components/ModalOrderRefund.vue";
import ModalOrderMakeInvoice from "@/components/ModalOrderMakeInvoice.vue";

import { OrderStatusEnum } from "@/enums/index";

export default {
  name: "TKOrderDetailsTabTransactions",

  components: {
    TKOperationsList,
    TKOrderTransactionsResults,
    CMPaymentsInvoicesList,
    ModalOrderDeposit,
    ModalOrderRefund,
    ModalOrderMakeInvoice,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
  },

  emits: ["update"],

  setup() {
    const { checkAuthRole } = useCheckAuth();

    const checkAuthPaymentsDeposit = computed(() => {
      return checkAuthRole(AccessRightsEnum.PaymentsDeposit);
    });

    const checkAuthPaymentsRefund = computed(() => {
      return checkAuthRole(AccessRightsEnum.PaymentsRefund);
    });
    const checkAuthPaymentsAcquiring = computed(() => {
      return checkAuthRole(AccessRightsEnum.Acquiring);
    });

    return { checkAuthPaymentsDeposit, checkAuthPaymentsRefund, checkAuthPaymentsAcquiring };
  },

  data() {
    return {
      keys: {
        update: 1,
        invoices: 1,
      },
      secondaryActiveTab: 1,
      modals: {
        deposit: false,
        refund: false,
        invoice: false,
      },
      OrderStatusEnum,
    };
  },

  methods: {
    actionDeposit() {
      this.modals.deposit = true;
      //
    },
    actionRefund() {
      this.modals.refund = true;
      //
    },
    actionMakeInvoice() {
      this.modals.invoice = true;
      //
    },
    depositCreated() {
      //
      this.keys.update++;
      this.$emit("update");
    },
    invoiceCreated() {
      //
      this.keys.invoices++;
      this.$emit("update");
    },
    handleInvoiceDetails(item) {
      this.$router.push({
        name: "payments_invoice_details",
        params: { id: item.id },
      });
    },
  },
};
</script>
