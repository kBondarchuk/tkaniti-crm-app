<template>
  <!-- New Billing Modal -->
  <Teleport to="body">
    <UIModal
      :modal_id="$options.name"
      :title="title"
      :active="active"
      @cancel="modalCancel"
      @approve="modalApproved"
      @did-show="didShow"
    >
      <form class="ui form" :name="$options.name" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
        <!--  -->
        <div class="two fields">
          <!--  -->
          <UIInputDate v-model.lazy="billing_plan.date_opened" :disabled="isLoading" label="Первый день" />
          <!--  -->
          <UIInputMoney
            v-model.lazy="billing_plan.year_percent"
            :disabled="isLoading"
            label="Годовая процентная ставка"
          />
        </div>
        <!--  -->
        <div class="two fields">
          <UIInputNumber
            v-model.lazy="billing_plan.payout_term"
            :disabled="isLoading"
            label="Периодичность выплат, мес"
          />
        </div>
        <!--  -->
        <UITextfield v-model.lazy="billing_plan.notes" :disabled="isLoading" name="second_name" label="Комментарий" />
        <!-- error -->
        <div v-if="api_error" class="ui error message">
          <div class="header">Произошла ошибка</div>
          <p>{{ api_error }}</p>
        </div>
        <!-- submit button -->
        <button type="submit" hidden>Submit</button>
      </form>
    </UIModal>
  </Teleport>

  <!-- /New Investor Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

let _billingObject = {
  // id: null,
  // investor_id: null,
  date_opened: "",
  year_percent: "",
  payout_term: 3,
  notes: "",
  // not editable
  billing_type: 1,
  status: 1,
};

export default {
  name: "ModalNewBillingPlan",

  components: {},

  // model: {
  //   prop: "active",
  //   event: "hide",
  // },

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

  emits: ["update:active", "created"],

  data() {
    return {
      billing_plan: Object.assign({}, _billingObject),
      title: "Новый план биллинга",
      isLoading: false,
      api_error: "",
    };
  },

  methods: {
    // Modal
    // setTitle(text) {
    //   this.title = "Инвестиция " + text;
    // },
    reset() {
      // this.setTitle("(новая)");
      this.billing_plan = Object.assign({}, _billingObject);
      // this.billing.investor_id = this.investor_id;
      this.api_error = "";
    },
    didShow() {
      this.reset();
      // this.fetch();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.create();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.reset();
      this.$emit("update:active");
    },
    closeModal() {
      // new created
      this.$emit("created");
      // close modal
      this.$emit("update:active");
    },
    // Item
    // set(item) {
    //   this.investment.id = item.id;
    //   this.investment.investor_id = item.investor_id;
    //   this.investment.date = item.date;
    //   this.investment.amount = item.amount;
    //   this.investment.notes = item.notes;
    // },
    // fetch() {
    //   if (this.investment_id != null) {
    //     this.isLoading = true;
    //     this.$store.dispatch("investments/fetchItem", this.investment_id).then(() => {
    //       console.log(this.$store.getters["investments/selectedItem"]);
    //       this.set(this.$store.getters["investments/selectedItem"]);
    //       // Title
    //       this.setTitle(this.investment.id);
    //       // State
    //       this.isLoading = false;
    //     });
    //   }
    // },
    async create() {
      this.isLoading = true;

      try {
        await apiService.createInvestorBillingPlan(this.investorId, this.billing_plan);

        // console.log(result);
        this.$UIService.showSuccess(null, "Создан план биллинга");

        // close modal
        this.closeModal();
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
