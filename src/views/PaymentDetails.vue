<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <!-- Back -->
      <YBackButton to="payments_invoices" />

      <UISpacer />
      <!-- Кассовый чек -->
      <!-- <UIButton
        text="Обновить чек"
        icon="refresh"
        type="basic labeled"
        :class="{ disabled: !invoice.receipt_id }"
        @click="refreshReceiptStatus"
      /> -->
      <!-- Эквайринг -->
      <UIButton
        v-if="invoice.payment_acq"
        text="Обновить статус оплаты"
        :class="{ 'disabled loading': loadingRefresh['acq'] }"
        icon="refresh"
        type="basic labeled"
        @click="refreshAcqPaymentStatus"
      />
      <!-- СБП -->
      <UIButton
        v-if="invoice.payment_sbp"
        text="Обновить статус оплаты"
        icon="refresh"
        type="basic labeled"
        @click="refreshSbpPaymentStatus"
      />
      <!-- Зачислить -->
      <UIButton
        :class="{ disabled: invoice.status != 1 || invoice.cleared != 0 }"
        text="Зачислить платёж"
        icon="check"
        type="basic labeled"
        @click="depositOrder"
      />
    </template>
    <!-- /Toolbar -->
    <!-- Grid -->
    <div class="ui grid">
      <!-- fist column -->
      <div class="eight wide column">
        <!-- Table -->
        <CMPaymentsInvoiceDetails :key="transaction_key" :invoice="invoice" :is-loading="isLoading" />

        <!-- /Table -->
      </div>
      <!-- second column -->
      <div class="eight wide second column">
        <!-- Платеж СБП -->
        <CMPaymentsSbpOrderDetails
          v-if="invoice?.payment_method == 'sbp' && invoice?.payment_sbp"
          :key="transaction_key"
          :order="invoice.payment_sbp ?? {}"
          :is-loading="isLoading"
        />

        <!-- Платеж Эквайринга -->
        <CMPaymentsAcqOrderDetails
          v-if="invoice?.payment_method == 'acq' && invoice?.payment_acq"
          :key="transaction_key"
          :order="invoice.payment_acq ?? {}"
          :is-loading="loadingRefresh['acq']"
        />

        <!-- Чек -->
        <!-- <CMPaymentsReceiptDetails :key="transaction_key" :receipt="invoice.receipt ?? {}" :is-loading="isLoading" /> -->

        <!-- Описание ошибки -->
        <!-- <template v-if="receiptStatus?.Description">
          <div class="ui segment">{{ receiptStatus?.StatusMessage }}<br />{{ receiptStatus?.Description }}</div>
        </template> -->
        <!-- Ссылка на чек -->
        <!-- <template v-if="receiptStatus?.Device?.OfdReceiptUrl">
          <a class="ui button compact" :href="receiptStatus?.Device.OfdReceiptUrl" target="_blank">Смотреть чек</a>
        </template> -->
        <!--  -->
      </div>
    </div>
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";

import { useView } from "@/composables/view";

import CMPaymentsInvoiceDetails from "@/components/CMPaymentsInvoiceDetails.vue";
// import CMPaymentsReceiptDetails from "@/components/CMPaymentsReceiptDetails.vue";
import CMPaymentsSbpOrderDetails from "@/components/CMPaymentsSbpOrderDetails.vue";
import CMPaymentsAcqOrderDetails from "@/components/CMPaymentsAcqOrderDetails.vue";

export default {
  name: "PaymentDetails",

  components: {
    CMPaymentsInvoiceDetails,
    // CMPaymentsReceiptDetails,
    CMPaymentsSbpOrderDetails,
    CMPaymentsAcqOrderDetails,
  },

  props: {
    invoiceId: {
      type: Number,
      default: null,
    },
  },

  setup() {
    const { view } = useView("PaymentDetails");

    view.title = "Платежная операция";
    view.subTitle = "Детализация";

    return { view };
  },

  data() {
    return {
      isLoading: false,
      invoice: {},
      receiptStatus: null,
      // Loading
      loadingRefresh: {
        acq: false,
        sbp: false,
      },
      // Keys
      transaction_key: 0,
    };
  },

  mounted() {
    this.setTitle();
    if (this.invoiceId != null) {
      // console.log("->");
      this.fetchInvoice(this.invoiceId);
    }
  },

  methods: {
    // UI
    setTitle() {
      this.view.title = this.view.title + " " + this.invoiceId;
    },

    // Actions
    refreshReceiptStatus() {
      console.log("refreshReceiptStatus", this.invoice.receipt_id);
      this.fetchOrderStatus("ofd", this.invoice.receipt_id);
    },
    refreshAcqPaymentStatus() {
      console.log("refreshAcqPaymentStatus", this.invoice.payment_acq.orderId);
      if (this.invoice.payment_acq) {
        this.fetchOrderStatus("acq", this.invoice.payment_acq.orderId);
      }
    },
    refreshSbpPaymentStatus() {
      console.log("refreshSbpPaymentStatus", this.invoice.payment_sbp?.number);
      if (this.invoice.payment_sbp) {
        this.fetchOrderStatus("sbp", this.invoice.payment_sbp.number);
      }
    },
    depositOrder() {
      console.log("depositOrder", this.invoice.invoice_number);
      this.fetchDepositByInvoice(this.invoice.id);
    },

    // Networking
    async fetchInvoice(invoiceId) {
      this.isLoading = true;
      try {
        this.invoice = await apiService.getInvoice(invoiceId);
        this.transaction_key++;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchOrderStatus(paymentMethod, orderId) {
      this.loadingRefresh[paymentMethod] = true;
      try {
        await apiService.refreshPaymentOrderStatus(paymentMethod, orderId);
        this.fetchInvoice(this.invoiceId);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.loadingRefresh[paymentMethod] = false;
    },
    async fetchDepositByInvoice(invoiceId) {
      this.isLoading = true;
      try {
        await apiService.depositInvoice(invoiceId);
        this.fetchInvoice(this.invoiceId);
        this.$UIService.showSuccess("", "Платёж учтён по договору " + this.invoice.subject_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
