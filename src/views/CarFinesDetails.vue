<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('car_fines')" />

      <!--  -->

      <!--  -->

      <!--  -->
      <UISpacer />
      <!--  -->
      <!-- <UIButton
        type="basic labeled"
        text="Изменить"
        icon="edit"
        @click="edit"
        :class="{ disabled: !checkAuthRole('cars.edit') }"
        v-if="checkAuthRole('manager')"
      /> -->

      <UIButton
        v-if="checkAuthRole('manager')"
        text="Оплатить штраф"
        :class="{ loading: isPaymentLoading, disabled: isPaymentLoading || fine.payed_amount != null }"
        @click="actionDoPayment"
      />
    </template>
    <!-- /Toolbar -->

    <!-- Details -->
    <CMFineDetails :fine="fine" />
    <!-- /Details -->

    <!-- Modals -->

    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMFineDetails from "@/components/CMFineDetails.vue";

export default {
  name: "CarFinesDetails",

  components: {
    CMFineDetails,
  },

  mixins: [viewMixin],

  props: {
    fine_id: {
      type: Number,
      default: null,
    },
  },

  emits: ["didChange", "hide"],

  data() {
    return {
      // View
      view: { title: "Штраф", subTitle: "Детализация" },
      isPaymentLoading: false,
      isLoading: false,
      // Models
      fine: {},
      // Modals
      // modals: {
      //   buy: false,
      //   sell: false,
      //   changeBranch: false,
      // },
      // Tabs
      tabs: [],
    };
  },

  // created() {
  //   // console.log(">> ", this.$store.getters["auth/getAuthRights"]);
  //   //
  //   // this.createTabs();
  // },

  mounted() {
    console.log(">> MOUNTED ", this.fine_id);

    if (this.fine_id !== undefined) {
      this.fetchFine(this.fine_id);
    }
  },

  methods: {
    tabIsActive(name) {
      const paths = this.$route.path.split("/");
      return paths[paths.length - 1] == name;
    },
    setTitle() {
      this.view.title =
        "Штраф " +
        this.fine.decree_number +
        " от " +
        this.$filters.date(this.fine.decree_date) +
        " (" +
        this.fine.id +
        ")";
      // this.view.subTitle = "Обновлено " + this.$filters.date(this.fine.gibdd_updated_ts);
      this.view.subTitle = this.fine.car;
    },
    // ---
    // edit() {
    //   this.$router.push({ name: "cars_edit" });
    // },

    // Actions
    actionDoPayment() {
      var confirmed = confirm("Вы действительно хотите оплатить данный штраф?");
      if (confirmed) {
        this.payFine();
      }
    },
    // actionSell() {
    //   this.modals.sell = true;
    // },
    // actionTransfer() {
    //   var confirmed = confirm("Вы действительно хотите выдать автомобиль?");
    //   if (confirmed) {
    //     this.fetchSetStatus(this.car_id, 9);
    //   }
    // },
    // actionSetStatus(status) {
    //   this.fetchSetStatus(this.car_id, status);
    // },
    // actionChangeBranch() {
    //   this.modals.changeBranch = true;
    // },

    // Events
    // buyDone(new_request_id) {
    //   if (new_request_id === null) return;

    //   this.$router.push({
    //     name: "budget_request_details",
    //     params: { request_id: new_request_id },
    //   });
    // },

    // Networking
    async fetchFine(fine_id) {
      this.isLoading = true;
      try {
        this.fine = await apiService.getCarFine(fine_id);

        this.setTitle();
        // this.createTabs();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async save() {
      this.isLoading = true;

      if (!this.params.amount) {
        this.params.amount = null;
      }

      try {
        await apiService.createCarFine(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Штраф для автомобиля " + this.carId + " зарегистрирован.");

        // saved
        this.$emit("didChange");
        // close modal
        this.$emit("hide");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async update() {
      this.isLoading = true;

      if (!this.params.amount) {
        this.params.amount = null;
      }

      try {
        await apiService.updateCarFine(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "Штраф для автомобиля " + this.carId + " изменён.");

        // saved
        this.$emit("didChange");
        // close modal
        this.$emit("hide");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async delete() {
      this.isLoading = true;

      try {
        let result = await apiService.deleteCarFine(this.params.id);

        console.log(result);
        this.$UIService.showInfo(null, "Штраф для автомобиля " + this.carId + " удалён.");

        // saved
        this.$emit("didChange");
        // close modal
        this.$emit("hide");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async payFine() {
      if (this.isPaymentLoading) return;
      if (!this.fine.id) return;

      this.isPaymentLoading = true;

      console.log("Штраф ", this.fine.id);

      try {
        let result = await apiService.payCarFine(this.fine.id);

        console.log("Pay result: ", result);

        this.$UIService.showSuccess(null, "Штраф оплачен на сумму  " + result["payment_amount"]);

        if (result["charge_result"] == 1) {
          this.$UIService.showSuccess(null, "Сумма оплаты начислена на договор " + this.fine.contract_id);
        }

        this.fetchFine(this.fine_id);
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isPaymentLoading = false;
    },
  },
};
</script>
