<template>
  <Teleport to="body">
    <!-- New params Modal -->
    <UIModal
      modal_id="modalCarDtpEdit"
      :title="title"
      :subtitle="selectedItem ? selectedItem.car : ''"
      :active="active"
      :approve-by-enter="false"
      :delete-button="params.id > 0"
      approve-button-text="Сохранить"
      scrolling-content
      @cancel="modalCancel"
      @delete="modalDelete"
      @approve="modalApproved"
      @did-show="didShow"
    >
      <form v-if="!showPhoto" class="ui error form" :class="{ loading: isLoading }" @submit.prevent>
        <!-- Select Car -->
        <!-- <UITransition mode="out-in" appear :duration="150"> -->
        <UIInputSelect
          v-if="!carId && !selectedItem"
          label="Автомобиль"
          placeholder="Автомобиль не выбран"
          :value="selectedCar"
          @button-did-click="modals.browseCars = true"
        />
        <!-- </UITransition> -->
        <div class="two fields">
          <UIInputDate v-model.lazy="params.date">Дата ДТП</UIInputDate>
          <UIInputDate v-model.lazy="params.inspection_date">Дата осмотра</UIInputDate>
        </div>
        <UITextfield v-model.lazy="params.driver">Водитель</UITextfield>
        <div class="two fields">
          <UITextfield v-model.lazy="params.culprit">Виновник</UITextfield>
          <UIInputPhone v-model.lazy="params.culprit_phone">Телефон виновника</UIInputPhone>
        </div>
        <div class="two fields">
          <UIInputDate v-model.lazy="params.payout_date">Дата выплат</UIInputDate>
          <UIInputMoney v-model.lazy="params.payout_amount">Сумма выплат</UIInputMoney>
        </div>
        <div class="two fields">
          <UIInputDate v-model.lazy="params.client_payout_date">Дата выплаты клиенту</UIInputDate>
          <UIInputMoney v-model.lazy="params.client_payout_amount">Выплата клиенту</UIInputMoney>
        </div>
        <UITextAria v-model.lazy="params.description">Описание повреждений</UITextAria>
        <!-- error -->
        <div v-if="api_error" class="ui error message">
          <div class="header">Произошла ошибка</div>
          <p>{{ api_error }}</p>
        </div>
      </form>
      <!-- Photos -->
      <template v-if="showPhoto">
        <CMPhotoGallery v-if="params.photo_album_uuid" :album-uuid="params.photo_album_uuid" />
        <div v-else>Загрузка фото станет доступной после сохранения ДТП</div>
      </template>
      <!-- Add photo -->
      <UIButton type="basic" style="margin-top: 1.5rem" @click="showPhoto = !showPhoto">
        <span v-if="showPhoto">Скрыть фото</span>
        <span v-else>Показать фото</span>
      </UIButton>
      <!-- New Cars Browser -->
      <BrowseCars
        :active="modals.browseCars"
        :filter-status="[1, 2, 3, 4, 5, 6]"
        @hide="modals.browseCars = false"
        @selected="carSelected"
      />
    </UIModal>
    <!-- /Modal -->
  </Teleport>
</template>

<script>
import apiService from "@/services/api.service.js";

import CMPhotoGallery from "@/components/CMPhotoGallery.vue";
import BrowseCars from "@/components/BrowseCars.vue";

const _dtpObject = {
  id: null,
  car_id: null,
  date: "",
  inspection_date: "",
  driver: "",
  payout_amount: "",
  payout_date: "",
  client_payout_amount: "",
  client_payout_date: "",
  culprit: "",
  culprit_phone: "",
  description: "",
  photo_album_uuid: "",
};

export default {
  name: "FormCarDtpEdit",

  components: {
    CMPhotoGallery,
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

  emits: ["hide", "didChange", "hide"],

  data() {
    return {
      params: Object.assign({}, _dtpObject),
      // params: {
      //   car_id: this.carId,
      //   date: "",
      //   inspection_date: "",
      //   driver: "",
      //   payout_amount: null,
      //   payout_date: "",
      //   culprit: "",
      //   culprit_phone: "",
      //   description: "",
      //   photo_album_uuid: "",
      // },
      title: "Регистрация ДТП",
      isLoading: false,
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
    // currentCompany() {
    //   return this.selectedItem || _budgetItemObject;
    // },
    selectedCar() {
      if (!this.car) {
        return "";
      } else return this.car._car_name;
    },
  },

  methods: {
    // addPhoto() {
    //   console.log("addPhoto");
    //   this.modals.addPhoto = true;
    // },
    // addPhotoDone() {
    //   console.log("addPhotoDone");
    //   // this.fetchPhotos(this.albumUuid);
    // },
    carSelected(item) {
      console.log("++++", item);

      this.car = item;
      // this.fillCar(item);
      this.params.car_id = item.id;
      this.modals.browseCars = false;
    },
    // Modal
    reset() {
      this.car = {};

      // this.params.car_id = this.carId || this.selectedItem.car_id;
      // this.params.id = this.selectedItem.id;
      // this.params.date = this.selectedItem.date;
      // this.params.inspection_date = this.selectedItem.inspection_date;
      // this.params.driver = this.selectedItem.driver;
      // this.params.payout_amount = this.selectedItem.payout_amount;
      // this.params.payout_date = this.selectedItem.payout_date;
      // this.params.culprit = this.selectedItem.culprit;
      // this.params.culprit_phone = this.selectedItem.culprit_phone;
      // this.params.description = this.selectedItem.description;
      // this.params.photo_album_uuid = this.selectedItem.photo_album_uuid;

      this.api_error = "";

      if (this.selectedItem) {
        this.params = Object.assign({}, this.selectedItem);
        this.title = "Изменение записи ДТП";
      } else {
        this.params = Object.assign({}, _dtpObject);
        this.params.car_id = this.carId;
        this.title = "Регистрация ДТП";
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
      var confirmed = confirm("Вы действительно хотите удалить запись о ДТП?");
      if (confirmed) {
        this.delete();
      }
    },
    async save() {
      this.isLoading = true;

      if (!this.params.payout_amount) {
        this.params.payout_amount = null;
      }

      try {
        await apiService.createDTP(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "ДТП автомобиля " + this.carId + " зарегистрировано.");

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

      if (!this.params.payout_amount) {
        this.params.payout_amount = null;
      }

      try {
        await apiService.updateDTP(this.params);

        // console.log(result);
        this.$UIService.showSuccess(null, "ДТП автомобиля " + this.carId + " изменён.");

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
        let result = await apiService.deleteDTP(this.params.id);

        console.log(result);
        this.$UIService.showInfo(null, "ДТП автомобиля " + this.carId + " удалено.");

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
  },
};
</script>
