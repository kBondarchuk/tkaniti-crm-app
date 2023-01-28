<template>
  <div>
    <!-- Toolbar -->
    <div class="ui-tool-bar-local">
      <!-- <UIButton
        type="right labeled"
        text="Внести расход"
        icon="right chevron"
        :class="{ disabled: car.ref_car_status != 1 && car.ref_car_status != 2 && car.ref_car_status < 5 }"
        @click="actionNewExpense"
      /> -->
      <!-- Оплата -->
      <UIButton
        :disabled="order?.status_id < 1"
        text="Внести оплату"
        icon="ruble sign"
        type="right labeled"
        @click="actionDeposit"
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
  </div>
</template>

<script>
import TKOperationsList from "@/components/TKOperationsList.vue";
import TKOrderTransactionsResults from "@/components/TKOrderTransactionsResults.vue";
import ModalOrderDeposit from "@/components/ModalOrderDeposit.vue";

export default {
  name: "TKOrderDetailsTabTransactions",

  components: {
    TKOperationsList,
    TKOrderTransactionsResults,
    ModalOrderDeposit,
  },

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
      },
    };
  },

  methods: {
    actionDeposit() {
      this.modals.deposit = true;
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
