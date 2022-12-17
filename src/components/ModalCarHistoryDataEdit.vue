<template>
  <!-- New params Modal -->
  <UIModal
    modal_id="modalCarHistoryDataEdit"
    approve-button-text="Сохранить"
    :title="title"
    :active="active"
    :delete-button="isEditMode"
    @cancel="modalCancel"
    @approve="modalApproved"
    @delete="modalDelete"
    @did-show="didShow"
    @did-hide="didHide"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <div class="two fields">
        <UIInputDate v-model.lazy="params.date" :disabled="isLoading">Дата</UIInputDate>
        <UIInputNumber v-model.lazy="params.odometr" :disabled="isLoading">Пробег</UIInputNumber>
      </div>
      <!-- Last mileage -->
      <div v-if="history.length" class="ui message">
        <div class="header">Последняя запись о пробеге</div>
        <p>
          {{ $filters.date(history[0].dt, 0) }} &mdash; <strong>{{ $filters.number(history[0].odometr) }}</strong> ({{
            history[0].user
          }})
        </p>
      </div>
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <div class="header">Произошла ошибка</div>
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden>Submit</button>
    </form>
  </UIModal>
  <!-- /New Investor Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";
import { getCurrentDate } from "@/utils/utils.js";

import UIModal from "@/components/UIModal.vue";
import UIInputNumber from "@/components/UIInputNumber.vue";
import UIInputDate from "@/components/UIInputDate.vue";

export default {
  name: "ModalCarHistoryDataEdit",

  components: {
    UIModal,
    UIInputNumber,
    UIInputDate,
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

  emits: ["saved", "hide"],

  data() {
    return {
      params: {
        id: null,
        odometr: null,
        date: "",
      },
      result_id: null,
      history: [],
      title: "Внесение данных пробега",
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    isEditMode() {
      return this.selectedItem && this.selectedItem.id > 0;
    },
  },

  methods: {
    // Modal

    reset() {
      this.params.id = null;
      this.params.date = getCurrentDate();
      this.params.odometr = null;
      this.api_error = "";
      this.result_id = null;
    },

    setTitle() {
      if (this.isEditMode) {
        this.params.id = this.selectedItem.id;
        this.params.date = this.selectedItem.dt;
        this.params.odometr = this.selectedItem.odometr;

        this.title = "Изменение данных о пробеге";
      } else {
        this.title = "Внесение данных о пробеге";
      }
    },
    didShow() {
      // modal_id
      console.log("didShow: " + this.selectedItem);
      this.reset();
      this.setTitle();
      this.getCarDataHistory();
    },
    didHide() {
      this.$emit("saved", this.result_id);
    },

    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      this.save();
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    modalDelete(modal_id) {
      console.log("delete: " + modal_id);
      this.isLoading = false;
      // this.$emit("hide");
      var confirmed = confirm("Вы действительно хотите удалить эту запись?");
      if (confirmed) {
        this.delete();
      }
    },
    save() {
      if (this.isEditMode) {
        this.update();
      } else {
        this.create();
      }
    },

    // Networking
    async create() {
      this.isLoading = true;
      try {
        let result = await apiService.addCarDataHistory({
          car_id: this.carId,
          date: this.params.date,
          odometr: this.params.odometr,
        });
        this.result_id = result.id;
        // console.log(result);
        this.$UIService.showSuccess(null, `Пробег добавлен`);

        // close modal
        this.$emit("hide");
        // saved
        // this.$emit("saved");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async update() {
      this.isLoading = true;
      try {
        let result = await apiService.updateCarDataHistory(this.selectedItem.id, {
          car_id: this.carId,
          date: this.params.date,
          odometr: this.params.odometr,
        });
        this.result_id = result.id;
        // console.log(result);
        this.$UIService.showSuccess(null, `Пробег добавлен.`);

        // close modal
        this.$emit("hide");
        // saved
        // this.$emit("saved");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async delete() {
      this.isLoading = true;
      try {
        await apiService.deleteCarDataHistory(this.selectedItem.id, this.carId);
        this.$UIService.showSuccess(null, `Запись о пробеге удалёна`);

        // close modal
        this.$emit("hide");
        // saved
        // this.$emit("saved");
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async getCarDataHistory() {
      this.isLoading = true;
      try {
        this.history = await apiService.getCarDataHistory(this.carId);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
