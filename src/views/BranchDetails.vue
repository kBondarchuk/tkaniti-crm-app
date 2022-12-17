<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton icon="left arrow" type="basic labeled" color="white" @click="back('branches')">Назад</UIButton>
      <UISpacer />
      <!-- <UIButton icon="plus" type="labeled" @click="newInvestment">Инвестиция</UIButton>
      <UIButton icon="minus" type="labeled" @click="newWithdraw">Выплата</UIButton> -->
    </template>
    <!-- /Toolbar -->

    <!-- Tabs -->
    <div class="ui top tabular menu">
      <div class="item" :class="{ active: tabsComponent == tabs[0] }" @click="tabSelect(0)">СВОДКА</div>
      <div class="item" :class="{ active: tabsComponent == tabs[1] }" @click="tabSelect(1)">ОПЕРАЦИИ</div>
      <!-- <div class="item" :class="{ active: tabsComponent == tabs[2] }" @click="tabSelect(2)">ЗАТРАТЫ</div> -->
      <!-- <div class="item" :class="{ active: tabsComponent == tabs[2] }" @click="tabSelect(2)">ДОГОВОРЫ</div> -->
    </div>
    <!-- Tab component -->
    <div class="ui bottom attached active tab">
      <!-- :branch-id="branch_id" -->
      <component
        :is="tabsComponent"
        :branch-id="branch_id"
        operations-type="branches"
        :operations-subject-id="branch_id"
        :show-subjects="true"
        :show-basis="true"
        :show-investor="false"
        :show-branch="true"
        no-border
      />
    </div>

    <!-- New Investment Modal -->
    <!-- <FormInvestment
      :investor_id="investor.id"
      :active="modals.modalInvestment"
      @hide="modals.modalInvestment = false"
      @created="refetchInvestments"
      @saved="refetchInvestments"
    ></FormInvestment> -->
    <!------->
    <!-- New Withdraw Modal -->
    <!-- <FormWithdraw
      :investor_id="investor.id"
      :investment_id="modals.investment_id"
      :active="modals.modalWithdraw"
      @hide="modals.modalWithdraw = false"
      @created="refetchInvestments"
      @saved="refetchInvestments"
    /> -->
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMOperationsList from "@/components/CMOperationsList.vue";
// import FormInvestment from "@/components/FormInvestment.vue";
// import FormWithdraw from "@/components/FormWithdraw.vue";
import CMBranchDetails from "@/components/CMBranchDetails.vue";

export default {
  name: "BranchDetails",

  components: {
    CMOperationsList,
    CMBranchDetails,
  },

  mixins: [viewMixin],

  props: {
    branch_id: {
      type: Number,
    },
  },

  data() {
    return {
      branch: {},
      // Modals
      modals: {
        investment_id: null,
        modalInvestment: false,
        modalWithdraw: false,
      },
      // View
      view: {
        title: "Филиал",
        subTitle: "Детализация",
      },
      isLoading: false,
      tabsComponent: "CMBranchDetails",
      tabs: ["CMBranchDetails", "CMOperationsList"],
    };
  },
  mounted() {
    if (this.branch_id !== undefined) {
      this.fetchItem(this.branch_id);
    }
  },

  methods: {
    // Tabs
    tabSelect(id) {
      // console.log("tab: " + id);
      this.tabsComponent = this.tabs[id];
    },
    // Modal
    modalInvestmentCreate() {
      this.modals.investment_id = null;
      this.modals["modalInvestment"] = true;
    },
    modalWithdrawCreate() {
      this.modals.modalWithdraw = true;
    },
    handleEdit(investment_id) {
      this.modals.investment_id = investment_id;
      this.modals["modalInvestment"] = true;
    },
    newInvestment() {
      console.log("New investment: " + this.branch_id);
      this.modalInvestmentCreate();
    },
    newWithdraw() {
      console.log("New withdraw: " + this.branch_id);
      this.modalWithdrawCreate();
    },

    setTitle() {
      this.view.title = "Филиал " + this.branch_id;

      if (Object.keys(this.branch).length > 0) {
        this.view.title = this.branch.name + " " + "(" + this.branch_id + ")";
      }
    },

    // Network
    async fetchItem(branch_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getBranch(branch_id);
        this.branch = result;
        this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },

    refetchInvestments() {
      // this.$store.dispatch("investments/fetchAll", this.branch);
      // this.fetchItem();
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
