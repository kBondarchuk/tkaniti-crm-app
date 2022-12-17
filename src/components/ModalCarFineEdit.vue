<template>
  <!-- New params Modal -->
  <UIModal
    modal_id="modalCarFineEdit"
    :title="title"
    :subtitle="subtitle"
    :active="active"
    :approve-by-enter="false"
    :delete-button="params.id > 0 && params.charged != 1"
    approve-button-text="Сохранить"
    size="small"
    @cancel="modalCancel"
    @delete="modalDelete"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui form" :class="{ loading: isLoading }" @submit.prevent>
      <!-- Status -->
      <div class="three fields">
        <div class="field">
          <label>Статус оплаты</label>
          <CMFinePayStatus :payed="params.payed" />
        </div>
        <div class="field">
          <label>Статус начисления</label>
          <CMFineChargeStatus :charged="params.charged" />
        </div>
      </div>

      <!-- Select Car -->
      <UIInputSelect
        v-if="!carId"
        label="Автомобиль"
        placeholder="Автомобиль не выбран"
        :value="selectedCar"
        :class="{ disabled: selectedItem }"
        @button-did-click="modals.browseCars = true"
      />
      <!-- v-if="!carId && !selectedItem" -->
      <!--  -->
      <div class="three fields">
        <UITextfield v-model.trim.lazy="params.decree_number" label="Номер постановления" />
        <UIInputDate v-model.trim.lazy="params.decree_date" label="Дата постановления" />
        <UIInputDate v-model.trim.lazy="params.decree_due_date" label="Срок постановления" />
      </div>

      <div class="three fields">
        <UIInputMoney
          v-model.trim.lazy="params.amount"
          label="Сумма штрафа"
          :class="{ disabled: params.charged == 1 }"
        />

        <UIInputMoney
          v-model.trim.lazy="params.discount_amount"
          label="Сумма со скидкой"
          :class="{ disabled: params.charged == 1 }"
        />
        <UIInputDate v-model.trim.lazy="params.discount_date" label="Скидка до" />
      </div>
      <!--  -->
      <UITextAria v-model.trim.lazy="params.notes" :rows="5">Описание нарушения</UITextAria>
      <!--  -->
      <div class="three fields">
        <div class="field">
          <label>Дата нарушения</label>
          <div>{{ $filters.date(params.offense_datetime) }}</div>
        </div>
        <!--  -->
        <div class="field">
          <UIButton
            text="Оплатить штраф"
            :class="{ loading: isPaymentLoading, disabled: isPaymentLoading || params.payed_amount != null }"
            @click="payFine"
          />
          <!-- <UIButton
            text="Оплатить и начислить"
            @click="payFine"
            :class="{
              loading: isPaymentLoading,
              disabled: isPaymentLoading || params.payed_amount != null || params.charged != 0,
            }"
          /> -->
        </div>
        <!--  -->
      </div>
      <!--  -->
      <div>{{ $filters.money(params.payed_amount) }} | {{ params.payed_commission }} | {{ params.payed_ts }}</div>

      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
    </form>

    <!-- New Cars Browser -->
    <BrowseCars
      :active="modals.browseCars"
      :filter-status="[1, 2, 3, 4, 5, 6]"
      @hide="modals.browseCars = false"
      @selected="carSelected"
    />
    <!--  -->
  </UIModal>
  <!-- /New Investor Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";
import UITextAria from "@/components/UITextAria.vue";
import UIInputSelect from "@/components/UIInputSelect.vue";
import CMFinePayStatus from "@/components/CMFinePayStatus.vue";
import CMFineChargeStatus from "@/components/CMFineChargeStatus.vue";
import BrowseCars from "@/components/BrowseCars.vue";

let _carFineObject = {
  car_id: null,
  contract_id: null,
  decree_date: "",
  decree_number: "",
  amount: "",
  charged: null,
  payed: null,
  payed_amount: null,
  payed_commission: null,
  notes: "",
  decree_due_date: "",
  discount_amount: null,
  discount_date: "",
  created_ts: "",
  updated_ts: "",
};

export default {
  name: "ModalCarFineEdit",
  components: {
    UIModal,
    UITextAria,
    UIInputSelect,
    CMFinePayStatus,
    CMFineChargeStatus,
    BrowseCars,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    carId: {
      type: Number,
      default: null,
    },
    selectedItem: {
      type: Object,
      default: null,
    },
  },

  emits: ["didChange", "hide"],

  data() {
    return {
      params: Object.assign({}, _carFineObject),
      title: "Внесение штрафа",
      isLoading: false,
      isPaymentLoading: false,
      api_error: "",
      showPhoto: false,
      car: {},
      // modals
      modals: {
        browseCars: false,
      },
    };
  },

  computed: {
    // payStatus() {
    //   if (this.params.payed == 1) {
    //     return "Оплачен";
    //   } else if (this.params.payed == 0) {
    //     return "Не оплачен";
    //   } else {
    //     return "Не определён";
    //   }
    // },
    // fineStatus() {
    //   if (this.params.charged == 1) {
    //     return "Начислен на договор";
    //   } else if (this.params.charged == -1) {
    //     return "Нет договора для начисления штрафа";
    //   } else if (this.params.charged == 0) {
    //     return "Ожидание начисления";
    //   } else {
    //     return null;
    //   }
    // },
    selectedCar() {
      if (!this.car) {
        return "";
      } else return this.car._car_name;
    },
    subtitle() {
      return "Обновлено " + this.$filters.date(this.params.updated_ts);
    },
  },

  methods: {
    // Modal
    carSelected(item) {
      console.log("++++", item);

      this.car = item;
      // this.fillCar(item);
      this.params.car_id = item.id;
      this.modals.browseCars = false;
    },
    reset() {
      this.car = {};
      this.api_error = "";

      if (!this.selectedItem) {
        this.title = "Внесение штрафа";
        this.params = Object.assign({}, _carFineObject);
        this.params.car_id = this.carId;
      } else {
        Object.assign(this.params, this.selectedItem);
        this.title = "Изменение штрафа";
        this.car._car_name = this.selectedItem.car;
      }
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      // this.fetch();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      if (!this.params.id) {
        console.log("Saving..");
        this.save();
      } else {
        console.log("Updating..");
        this.update();
      }
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    modalDelete(modal_id) {
      console.log("delete: " + modal_id);
      // this.$emit("hide");
      var confirmed = confirm("Вы действительно хотите удалить запись о штрафе?");
      if (confirmed) {
        this.delete();
      }
    },

    // Network
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
      if (!this.params.id) return;

      this.isPaymentLoading = true;

      console.log(this.params.id);

      try {
        let result = await apiService.payCarFine(this.params.id);

        console.log("Pay result: ", result);

        this.$UIService.showSuccess(null, "Штраф оплачен на сумму  " + result["payment_amount"]);

        if (result["charge_result"] == 1) {
          this.$UIService.showSuccess(null, "Сумма оплаты начислена на договор " + this.params.contract_id);
        }

        // saved
        // this.$emit("didChange");
        // close modal
        // this.$emit("hide");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isPaymentLoading = false;
    },
  },
};
</script>
