<template>
  <div>
    <!-- Accounts -->
    <table class="ui very compact small celled two column table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th colspan="2" class="ui center aligned">АКТИВНЫЙ ИНВЕСТИЦИОННЫЙ ПЛАН</th>
        </tr>
      </thead>
      <!-- Plan exists: -->
      <tbody v-if="plan">
        <tr v-if="plan.payout_amount > 0">
          <td class="blue gray_bg">К выплате</td>
          <td class="blue">
            {{ $filters.money(plan.payout_amount) }} ₽
            <UIButton
              type="basic blue tiny"
              text="ВЫПЛАТИТЬ"
              style="margin-top: -2px; margin-bottom: -2px"
              @click="$parent.$emit('payout', plan.payout_amount)"
            />
          </td>
        </tr>
        <tr>
          <td class="gray_bg">Начальная дата</td>
          <td>{{ $filters.date(plan.date_opened) }}</td>
        </tr>
        <tr>
          <td class="gray_bg">Годовая процентная ставка</td>
          <td>{{ plan.year_percent }} %</td>
        </tr>
        <tr>
          <td class="gray_bg">Длительность</td>
          <td>{{ plan.current_period }} дней</td>
        </tr>
        <tr>
          <td class="gray_bg">Регулярность выплат</td>
          <td>{{ plan.payout_term }} мес.</td>
        </tr>
        <tr>
          <td class="gray_bg">След. дата выплат</td>
          <td>{{ $filters.date(plan.date_next_closing) }}</td>
        </tr>
        <tr>
          <td class="gray_bg">Процент реинвестирования</td>
          <td>{{ plan.reinvest_percent }} %</td>
        </tr>
        <tr>
          <td class="gray_bg">Создал</td>
          <td>{{ plan.user }}</td>
        </tr>
        <tr>
          <td class="gray_bg">Комментарий</td>
          <td>{{ plan.notes }}</td>
        </tr>
      </tbody>

      <!-- No plan: -->
      <tbody v-else>
        <tr>
          <td class="center aligned" style="padding-top: 1rem; padding-bottom: 1rem">
            <div style="color: rgba(40, 40, 40, 0.3); padding-bottom: 1rem; text-align: center; font-size: 1.3rem">
              План не установлен
            </div>
            <UIButton type="basic" text="Создать план" @click="modals.modalNewBilling = true" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- New Invest Billing Modal -->
    <ModalNewBillingPlan
      v-model:active="modals.modalNewBilling"
      :investor-id="investorId"
      @created="billingPlanCreated"
    />
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import ModalNewBillingPlan from "@/components/ModalNewBillingPlan.vue";

export default {
  name: "CMInvestorBillingPlan",

  components: {
    ModalNewBillingPlan,
  },

  props: {
    investorId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      plan: {},
      isLoading: false,
      // Modals
      modals: {
        modalNewBilling: false,
      },
    };
  },

  mounted() {
    this.fetch(this.investorId);
  },

  methods: {
    billingPlanCreated() {
      console.log("billingPlanCreated");
      this.fetch(this.investorId);
    },

    // Network
    async fetch(investor_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestorActiveBillingPlan(investor_id);
        this.plan = result;
      } catch (error) {
        if (error.response.status == 404) {
          this.plan = null;
        } else {
          this.$UIService.showNetworkError(error);
        }
      }
      this.isLoading = false;
    },
  },
};
</script>
