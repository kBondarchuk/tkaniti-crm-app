<template>
  <!-- Grid -->
  <div class="ui grid">
    <!-- fist column -->
    <div class="seven wide column">
      <!-- Table -->
      <table class="ui very compact small celled table" :class="{ loading: isLoading }">
        <tbody>
          <tr>
            <td class="gray_bg">ФИО</td>
            <td>{{ investor.last_name + " " + investor.first_name + " " + investor.second_name }}</td>
          </tr>
          <tr>
            <td class="gray_bg">Дата создания</td>
            <td>{{ $filters.date(investor.date_created) }}</td>
          </tr>
          <tr>
            <td v-if="investor.notes" colspan="2">{{ investor.notes }}</td>
            <td v-else colspan="2">&mdash;</td>
          </tr>
        </tbody>
      </table>
      <!-- Billing plans -->
      <CMInvestorBillingPlan :investor-id="investorId" />
      <!-- <CMBillingPlansList :investor-id="this.investorId" /> -->
      <!-- Accounts -->
      <!-- Investments -->
      <CMInvestorAccountsInvestments :investor-id="investorId" />
      <!-- Operations -->
      <CMInvestorAccounts :investor-id="investorId" />
      <!--  -->
    </div>
    <!-- second column -->
    <div class="nine wide second column">
      <!-- Leasing Contracts Results -->
      <CMInvestorLeasingContractsResults :investor-id="investorId" />
      <!-- Rent Contracts Results -->
      <CMInvestorRentContractsResults :investor-id="investorId" />
      <!-- Sales -->
      <CMSalesTotalsList :investor-id="investorId" />
      <!-- Expenses -->
      <CMExpensesTotalsList :investor-id="investorId" />
      <!--  -->
    </div>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMInvestorAccounts from "@/components/CMInvestorAccounts.vue";
import CMInvestorAccountsInvestments from "@/components/CMInvestorAccountsInvestments.vue";
import CMInvestorLeasingContractsResults from "@/components/CMInvestorLeasingContractsResults.vue";
import CMInvestorRentContractsResults from "@/components/CMInvestorRentContractsResults.vue";
import CMExpensesTotalsList from "@/components/CMExpensesTotalsList.vue";
import CMSalesTotalsList from "@/components/CMSalesTotalsList.vue";
import CMInvestorBillingPlan from "@/components/CMInvestorBillingPlan.vue";

export default {
  name: "CMInvestorDetails",

  components: {
    CMInvestorAccounts,
    CMInvestorAccountsInvestments,
    CMInvestorLeasingContractsResults,
    CMInvestorRentContractsResults,
    CMExpensesTotalsList,
    CMSalesTotalsList,
    CMInvestorBillingPlan,
  },

  props: {
    investorId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      investor: {},
      isLoading: false,
    };
  },

  mounted() {
    this.fetchInvestor(this.investorId);
  },

  methods: {
    // Network
    async fetchInvestor(investor_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestor(investor_id);
        this.investor = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
