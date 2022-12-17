<template>
  <!-- Page 2: Transactions -->
  <div>
    <div v-if="checkAuthRole('manager')" class="ui-tool-bar-local">
      <!-- Toolbar -->
      <UIButton
        type="right labeled"
        text="Депозит"
        color="blue"
        icon="right chevron"
        :class="{ disabled: disabled }"
        @click="actionDeposit"
      />
      <UIButton
        type="right labeled"
        text="Отключить пеню"
        color="orange"
        icon="right chevron"
        :class="{ disabled: disabled }"
        @click="actionPenalty"
      />
      <UIButton
        type="right labeled"
        text="Корректировка пени"
        icon="right chevron"
        :class="{ disabled: disabled }"
        style="display: none"
        @click="actionPenalty"
      />
      <!--  -->
      <UISpacer />
      <!--  -->
      <UIButton
        text="Оплатить штрафы"
        :class="{ disabled: disabled || isPaymentLoading, loading: isPaymentLoading }"
        @click="actionPayCarFines"
      />
      <!--  -->
      <UISpacer />
      <!--  -->
      <UIButton
        v-if="checkAuthRole('manager')"
        type="right labeled"
        text="Реструктуризация"
        icon="right chevron"
        :class="{ disabled: disabledForRestruct }"
        @click="actionRestruct"
      />
      <UIButton
        v-if="checkAuthRole('manager')"
        type="right labeled"
        text="Досрочное погашение"
        icon="right chevron"
        :class="{ disabled: disabledForRestruct }"
        @click="actionPayForward"
      />
    </div>

    <div v-if="checkAuthRole('manager')" class="ui divider"></div>

    <CMTransactionsResults :key="keys.update" :contract_id="contract.id" />

    <div v-if="checkAuthRole('operations')" style="margin-top: 1.5em">
      <div class="ui top pointing secondary menu">
        <div class="item" :class="{ active: secondaryActiveTab == 1 }" @click="secondaryActiveTab = 1">ОПЕРАЦИИ</div>
        <div class="item" :class="{ active: secondaryActiveTab == 2 }" @click="secondaryActiveTab = 2">
          ГРАФИК РАСЧЁТОВ
        </div>
        <div class="item" :class="{ active: secondaryActiveTab == 3 }" @click="secondaryActiveTab = 3">БУХ ОТЧЁТ</div>
      </div>
      <!-- Operations -->
      <keep-alive>
        <CMOperationsList
          v-if="secondaryActiveTab == 1"
          :key="'operations' + keys.update"
          operations-type="contracts"
          :operations-subject-id="contract.id"
          :show-basis="false"
          :show-branch="false"
        />
        <!-- Graph -->
        <CMAccountsGraph
          v-else-if="secondaryActiveTab == 2"
          :key="'accounts' + keys.update"
          :contract-id="contract.id"
        />
        <!-- Deposit Graph -->
        <CMDepositGraph v-else-if="secondaryActiveTab == 3" :key="'deposit' + keys.update" :contract-id="contract.id" />
      </keep-alive>
    </div>

    <!-- Deposit Modal -->
    <FormDeposit
      :active="modals.deposit"
      :contract-id="contract.id"
      @hide="modals.deposit = false"
      @saved="depositCreated"
    />
    <!-- Penalty Modal -->
    <FormPenalty
      :active="modals.penalty"
      :contract-id="contract.id"
      @hide="modals.penalty = false"
      @saved="penaltyCreated"
    />
    <!-- PayForward Modal -->
    <FormPayForward
      :active="modals.payForward"
      :contract-id="contract.id"
      :contract_daily_payment="contract.daily_payment"
      :contract_total_to_pay="contract.daily_payment"
      @hide="modals.payForward = false"
      @saved="payForwardCreated"
    />
    <!-- Restruct Modal -->
    <FormRestruct
      :active="modals.restruct"
      :contract-id="contract.id"
      @hide="modals.restruct = false"
      @saved="restructCreated"
    />
    <!------->
  </div>
  <!-- /Page 2 -->
</template>

<script>
import apiService from "@/services/api.service.js";

import CMTransactionsResults from "@/components/CMTransactionsResults.vue";
import CMOperationsList from "@/components/CMOperationsList.vue";
import CMAccountsGraph from "@/components/CMAccountsGraph.vue";
import CMDepositGraph from "@/components/CMDepositGraph.vue";
import FormDeposit from "@/components/FormDeposit.vue";
import FormPenalty from "@/components/FormPenalty.vue";
import FormPayForward from "@/components/FormPayForward.vue";
import FormRestruct from "@/components/FormRestruct.vue";

export default {
  name: "CMContractDetailsTabAccounts",

  components: {
    CMTransactionsResults,
    CMOperationsList,
    CMAccountsGraph,
    CMDepositGraph,
    FormDeposit,
    FormPenalty,
    FormPayForward,
    FormRestruct,
  },

  props: {
    contract: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["needRefetch"],

  data() {
    return {
      secondaryActiveTab: 1,
      isPaymentLoading: false,
      // Modals
      modals: {
        deposit: false,
        penalty: false,
        payForward: false,
        restruct: false,
      },
      // Keys
      keys: { update: 0 },
    };
  },

  computed: {
    disabledForRestruct() {
      // Deleted Or Closed
      return this.contract.status != 1 || !this.checkAuthRole("contracts.restruct");
    },
  },

  methods: {
    // Actions
    actionDeposit() {
      this.modals.deposit = true;
    },
    actionPenalty() {
      this.modals.penalty = true;
    },
    actionPayForward() {
      this.modals.payForward = true;
    },
    actionRestruct() {
      this.modals.restruct = true;
    },
    actionPayCarFines() {
      // this.modals.payCarFines = true;
      var confirmed = confirm(
        "Вы действительно хотите оплатить все штрафы ГИБДД по договору и начислить сумму оплаты на данный договор?"
      );
      if (confirmed) {
        this.payFines();
      }
    },
    // Events
    depositCreated() {
      this.keys.update++;
    },
    penaltyCreated() {
      this.requestRefetch();
    },
    payForwardCreated() {
      this.requestRefetch();
    },
    restructCreated() {
      this.requestRefetch();
    },
    //
    requestRefetch() {
      this.$emit("needRefetch");
    },
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },

    // Networking
    async payFines() {
      this.isPaymentLoading = true;

      console.log("Договор ", this.contract.id);

      try {
        let result = await apiService.payCarFinesForContract(this.contract.id);

        console.log("Pay result: ", result);

        //   'found' => $foundFines,
        //   'payedCount' => $payedCount,
        //   'chargedCount' => $chargedCount,

        this.$UIService.showSuccess(null, "Найдено штрафов " + result["found"]);
        this.$UIService.showSuccess(null, "Оплачено штрафов " + result["payedCount"]);
        this.$UIService.showSuccess(null, "Начислено штрафов " + result["chargedCount"]);

        // if (result["charge_result"] == 1) {
        //   this.$UIService.showSuccess(null, "Сумма оплаты начислена на договор " + this.fine.contract_id);
        // }
        // Refresh
        this.keys.update++;
        //
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isPaymentLoading = false;
    },
  },
};
</script>
