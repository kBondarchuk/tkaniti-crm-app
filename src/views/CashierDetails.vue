<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton icon="left arrow" type="basic labeled" @click="back">Назад к списку</UIButton>
      <UISpacer />
      <UIButton icon="refresh" type="basic labeled" @click="getStatus">Обновить статус</UIButton>
      <UIButton
        icon="check"
        type="basic labeled"
        :class="{ disabled: transaction.orderStatus != 2 || transaction.cleared != 0 }"
        @click="depositOrder"
      >
        Зачислить платёж
      </UIButton>
    </template>
    <!-- /Toolbar -->
    <!-- Grid -->
    <div class="ui grid">
      <!-- fist column -->
      <div class="eight wide column">
        <!-- Table -->
        <CMAcquiringTransactionsDetails :key="transaction_key" :transaction="transaction" :is-loading="isLoading" />

        <!-- /Table -->
      </div>
      <!-- second column -->
      <div class="eight wide second column">
        <!-- Table -->
        <!-- <CMCustomersContractsList :id="paramId" /> -->
        <!-- /Table -->
      </div>
    </div>
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";
import LayoutPage from "@/components/LayoutPage.vue";
import CMAcquiringTransactionsDetails from "@/components/CMAcquiringTransactionsDetails.vue";

export default {
  name: "CashierDetails",
  components: {
    LayoutPage,
    CMAcquiringTransactionsDetails,
  },
  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Платежная операция", subTitle: "Детализация" },
      isLoading: false,
      transaction: {},
      // Params
      paramId: null,
      // Keys
      transaction_key: 0,
    };
  },
  created() {
    console.log("Created Params.id: " + this.$route.params.id);
    // Get ID from params
    this.paramId = this.$route.params.id === undefined ? null : parseInt(this.$route.params.id);
  },
  mounted() {
    this.setTitle();
    if (this.paramId != null) {
      console.log("->");
      this.fetchItem(this.paramId);
    }
  },
  methods: {
    setTitle() {
      this.view.title = this.view.title + " " + this.paramId;
    },
    async fetchItem(transaction_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getAcquiringTransaction(transaction_id);
        this.transaction = result;
        this.transaction_key++;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchOrderStatus(orderId) {
      this.isLoading = true;
      try {
        await apiService.getPaygateGetOrderStatus(orderId);
        this.fetchItem(this.paramId);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchDepositOrder(orderId) {
      this.isLoading = true;
      try {
        await apiService.depositAcquiringTransaction(orderId);
        this.fetchItem(this.paramId);
        this.$UIService.showSuccess("", "Платёж учтён по договору " + this.transaction.contract_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    // ---
    // set(item) {
    //   // this.investor.id = item.id;
    // },
    back() {
      this.$router.push({ name: "cashier" });
    },
    getStatus() {
      console.log("getStatus", this.transaction.orderId);
      this.fetchOrderStatus(this.transaction.orderId);
    },
    depositOrder() {
      console.log("depositOrder", this.transaction.orderId);
      this.fetchDepositOrder(this.transaction.orderId);
    },
  },
};
</script>
