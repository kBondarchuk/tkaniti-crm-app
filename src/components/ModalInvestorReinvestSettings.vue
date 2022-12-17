<template>
  <!-- New Modal -->
  <UIModal
    :modal_id="$options.name"
    :title="title"
    :subtitle="subtitle"
    :active="active"
    approve-button-text="Сохранить"
    :is-approvable="!formDisabled"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <!-- <div class="ui sub header">Вводные данные</div> -->
    <table style="width: 100%">
      <tr>
        <td>Следующая дата реинвестирования / выплат:</td>
        <td v-if="plan" class="text-bold">{{ $filters.date(plan.date_next_closing) }}</td>
      </tr>
      <tr>
        <td>Прогнозируемая сумма дохода:</td>
        <td class="text-bold">{{ $filters.money(plan_amount) }} &#8381;</td>
      </tr>
    </table>
    <br />

    <form
      class="ui form"
      :name="$options.name"
      :class="{ loading: isLoading, error: formDisabled }"
      @submit.prevent="modalApproved"
    >
      <!--  -->
      <div class="ui sub header">Процент реинвестирования</div>

      <!-- <div class="three fields"> -->
      <UIInputMoney
        v-model="new_reinvest_percent"
        :disabled="isLoading || formDisabled"
        name="percent"
        style="margin-bottom: 0"
      />
      <!-- </div> -->
      <UISlider v-model="new_reinvest_percent" :disabled="formDisabled" />
      <!--  -->
      <div class="two fields">
        <UIInputMoney :value="amount_reinvest" label="Сумма реинвестирования" disabled />
        <UIInputMoney :value="amount_payout" label="Сумма выплаты" disabled />
      </div>
      <!--  -->
      <!-- <UITextfield v-model.trim.lazy="payload.notes" :disabled="isLoading" name="notes" label="Комментарий" /> -->
      <!-- error -->
      <!-- v-if="!this.plan" -->
      <div class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>Не найден активный инвестиционный план!</p>
      </div>
      <!--  -->
      <div v-if="plan" class="ui message">
        <!-- <div class="header">Прогноз</div> -->
        <p style="min-height: 5em">
          В соответсвии с установленным процентом реинвестирования,
          <strong>{{ $filters.date(plan.date_next_closing) }}</strong>
          <span v-if="amount_reinvest > 0">
            будет реинвестировано
            <span class="text-bold">{{ $filters.money(amount_reinvest) }} ₽</span>
          </span>

          <span v-if="amount_payout > 0 && amount_reinvest > 0"> <br />и </span>

          <span v-if="amount_payout > 0">
            будет выплачено <span class="text-bold">{{ $filters.money(amount_payout) }} ₽</span>
          </span>
        </p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden>Submit</button>
    </form>
  </UIModal>
  <!-- /New Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";
import UISlider from "@/components/UISlider.vue";

// let _payloadObject = {
//   percent: "50.0",
//   notes: "",
// };

export default {
  name: "ModalInvestorReinvestSettings",

  components: {
    UIModal,
    UISlider,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    investorId: {
      type: Number,
      default: null,
    },
  },

  emits: ["update:active", "hide", "created"],

  data() {
    return {
      plan: {},
      stats: {},
      // payload: Object.assign({}, _payloadObject),
      new_reinvest_percent: 0,
      plan_amount: "0",
      // View
      title: "Настройки реинвестирования",
      subtitle: "Установите желаемый процент реинвестирования",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    amount_reinvest() {
      return Number((this.plan_amount / 100) * this.new_reinvest_percent).toFixed(2);
    },
    amount_payout() {
      return this.plan_amount - this.amount_reinvest;
    },
    formDisabled() {
      return this.plan === null;
    },
  },

  methods: {
    // Modal
    // setTitle(text) {
    //   this.title = "Выплата процентов инвестору " + text;
    // },
    reset() {
      // this.payload = Object.assign({}, _payloadObject);
      // this.setTitle("");
      this.api_error = "";
    },
    didShow() {
      // console.log("didShow: " + modal_id);
      this.reset();
      this.fetchActiveBillingPlan(this.investorId);
      this.fetchInterestStats(this.investorId);
    },
    modalApproved() {
      this.postReinvestPercent();
    },
    modalCancel() {
      // console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("update:active", false);
      this.$emit("hide");
    },
    doneModal() {
      // show success
      // if (this.actionType == "reinvest") {
      //   this.$UIService.showSuccess("Проценты реинвестированы!");
      // } else if (this.actionType == "withdraw") {
      //   this.$UIService.showSuccess("Проценты выплачены!");
      // }
      this.$UIService.showSuccess("Процент реинвестирования установлен!");

      // new created
      this.$emit("created");
      // close modal
      this.$emit("update:active", false);
    },

    // Networking
    async postReinvestPercent() {
      this.isLoading = true;
      try {
        await apiService.investorSetReinvestPercent(this.investorId, this.new_reinvest_percent);
        this.doneModal();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchActiveBillingPlan(investor_id) {
      this.isLoading = true;
      try {
        this.plan = await apiService.getInvestorActiveBillingPlan(investor_id);

        this.new_reinvest_percent = this.plan.reinvest_percent;
        // this.plan = null; // await apiService.getInvestorActiveBillingPlan(investor_id);
      } catch (error) {
        if (error.response.status == 404) {
          this.plan = null;
        } else {
          this.$UIService.showNetworkError(error);
        }
      }
      this.isLoading = false;
    },
    async fetchInterestStats(investor_id) {
      this.isLoading = true;
      try {
        this.stats = await apiService.getInvestorsInterestStats(investor_id);
        this.plan_amount = this.stats.interest_result_plan;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
form :deep(input#percent) {
  text-align: center;
  /* border: 0; */
  width: 10%;
  /* margin-left: auto;
  margin-right: auto;
  display: block; */
}
</style>
