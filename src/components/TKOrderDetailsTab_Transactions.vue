<template>
  <div>
    <!-- Toolbar -->
    <div class="ui-tool-bar-local">
      <!-- Оплата -->
      <UIButton
        :disabled="order?.status_id < OrderStatusEnum.Payment || !checkAuthPaymentsDeposit"
        text="Внести оплату"
        icon="ruble sign"
        type="right labeled"
        @click="actionDeposit"
      />
      <UIButton
        :disabled="order?.status_id < OrderStatusEnum.Payment || !checkAuthPaymentsRefund"
        text="Возврат"
        @click="actionRefund"
      />
    </div>
    <div class="ui divider"></div>
    <!-- /Toolbar -->

    <!-- Results -->
    <TKOrderTransactionsResults v-if="order?.id" :key="keys.update" :order-id="order?.id" />

    <!-- Operations -->
    <TKOperationsList
      :key="keys.update"
      operations-type="orders"
      :operations-subject-id="order?.id"
      :show-basis="false"
    />
    <!--  -->
    <!-- Deposit Modal -->
    <ModalOrderDeposit v-model:active="modals.deposit" :order-id="order?.id" @created="depositCreated" />
    <!-- Refund Modal -->
    <ModalOrderRefund v-model:active="modals.refund" :order-id="order?.id" @created="depositCreated" />
    <!--  -->
  </div>
</template>

<script>
import { CheckAuthMixin } from "@/mixins/CheckAuthMixin.js";

import TKOperationsList from "@/components/TKOperationsList.vue";
import TKOrderTransactionsResults from "@/components/TKOrderTransactionsResults.vue";
import ModalOrderDeposit from "@/components/ModalOrderDeposit.vue";
import ModalOrderRefund from "@/components/ModalOrderRefund.vue";

import { OrderStatusEnum } from "@/enums/index";

export default {
  name: "TKOrderDetailsTabTransactions",

  components: {
    TKOperationsList,
    TKOrderTransactionsResults,
    ModalOrderDeposit,
    ModalOrderRefund,
  },

  mixins: [CheckAuthMixin],

  props: {
    order: {
      type: Object,
      default: null,
    },
  },

  emits: ["update"],

  data() {
    return {
      keys: {
        update: 1,
      },
      modals: {
        deposit: false,
        refund: false,
      },
      OrderStatusEnum,
    };
  },

  // computed: {
  //   checkAuthPaymentsDeposit() {
  //     return this.checkAuthRole(AccessRightsEnum.PaymentsDeposit);
  //   },
  //   checkAuthPaymentsRefund() {
  //     return this.checkAuthRole(AccessRightsEnum.PaymentsRefund);
  //   },
  // },

  methods: {
    actionDeposit() {
      this.modals.deposit = true;
      //
    },
    actionRefund() {
      this.modals.refund = true;
      //
    },
    depositCreated() {
      //
      this.keys.update++;
      this.$emit("update");
    },
  },
};
</script>
