<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('investors')" />
      <UISpacer />
      <UIButton text="Новая инвестиция" icon="plus" type="labeled" @click="modals.investment = true" />
      <UIButton text="Возврат инвестиции" icon="minus" type="labeled" @click="modals.withdraw = true" />
      <UIButton text="Проценты" icon="percent" type="labeled" @click="modals.handleInterest = true" />
    </template>
    <!-- /Toolbar -->

    <!-- Tabs -->
    <div class="ui top tabular menu" style="padding-top: 1em; padding-left: 1.5em; margin-bottom: 0">
      <div class="item" :class="{ active: tabsComponent == tabs[0] }" @click="tabSelect(0)">СВОДКА</div>
      <div class="item" :class="{ active: tabsComponent == tabs[1] }" @click="tabSelect(1)">ОПЕРАЦИИ</div>
    </div>
    <!-- Tab component -->
    <div class="ui bottom attached active tab" style="padding: 1em 1.5em 1.5em 1.5em">
      <component
        :is="tabsComponent"
        :key="updateKey"
        :investor-id="investor_id"
        operations-type="investors"
        :operations-subject-id="investor_id"
        :show-basis="true"
        :show-investor="false"
        :show-branch="true"
        @payout="doPayout"
      />
    </div>

    <!-- New Investment Modal -->
    <FormInvestment v-model:active="modals.investment" :investor-id="investor.id" @created="refresh" />
    <!-- New Withdraw Modal -->
    <FormWithdraw v-model:active="modals.withdraw" :investor-id="investor.id" @created="refresh" />
    <!-- New Withdraw Interest Modal -->
    <ModalHandleInterest v-model:active="modals.handleInterest" :investor-id="investor.id" @created="refresh" />
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMInvestorDetails from "@/components/CMInvestorDetails.vue";
import CMOperationsList from "@/components/CMOperationsList.vue";
import FormInvestment from "@/components/FormInvestment.vue";
import FormWithdraw from "@/components/FormWithdraw.vue";
import ModalHandleInterest from "@/components/ModalHandleInterest.vue";

export default {
  name: "InvestorsDetails",

  components: {
    CMOperationsList,
    CMInvestorDetails,
    FormInvestment,
    FormWithdraw,
    ModalHandleInterest,
  },

  mixins: [viewMixin],

  props: {
    investor_id: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      investor: {},
      // Modals
      modals: {
        investment: false,
        withdraw: false,
        handleInterest: false,
      },
      // View
      view: {
        title: "Инвестор",
        subTitle: "Детализация, инвестиции, затраты",
      },
      isLoading: false,
      tabsComponent: "CMInvestorDetails",
      tabs: ["CMInvestorDetails", "CMOperationsList"],
      // Keys
      updateKey: 0,
    };
  },
  mounted() {
    if (this.investor_id !== undefined) {
      this.fetchInvestor(this.investor_id);
    }
  },

  methods: {
    // Tabs
    tabSelect(id) {
      // console.log("tab: " + id);
      this.tabsComponent = this.tabs[id];
    },
    setTitle() {
      this.view.title = "Инвестор " + this.investor_id;

      if (Object.keys(this.investor).length > 0)
        // eslint-disable-next-line prettier/prettier
        this.view.title = this.investor.last_name + " " + this.investor.first_name + " " + this.investor.second_name + " " + "(" + this.investor_id + ")";
    },
    refresh() {
      this.updateKey++;
    },
    doPayout(amount) {
      // console.log("doPayout: ");
      var confirmed = confirm(`Вы действительно выплатить ${amount} рублей накопленных процентов инвестору?`);
      if (confirmed) {
        this.postInterestWithdrawPlanned(this.investor_id, "");
      }
    },

    // Network
    async fetchInvestor(investor_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestor(investor_id);
        this.investor = result;
        this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async postInterestWithdrawPlanned(investor_id, notes) {
      this.isLoading = true;
      try {
        await apiService.investorWithdrawInterestPlanned(investor_id, { notes: notes });
        this.refresh();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.ui.tab.segment {
  padding: 0;
}
.ten.wide.second.column {
  padding-left: 0;
}
</style>
