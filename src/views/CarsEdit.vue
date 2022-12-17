<template>
  <LayoutPage no-vertical-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UIButton text="Назад" icon="left arrow" type="basic labeled" @click="back" />
      <UISpacer />
      <UIButton text="Сохранить" type="basic primary" :class="validateSubmit" @click.prevent="actionsSave" />
    </template>
    <!-- /Toolbar -->

    <!-- Form -->
    <form
      class="ui form"
      method="post"
      action
      :class="{ loading: isLoading }"
      style="height: 100%; margin-top: 1rem; margin-bottom: 1rem"
    >
      <!-- Grid -->
      <div class="ui grid" style="height: 100%">
        <!-- fist column -->
        <div class="twelve wide column">
          <div class="four fields">
            <!-- Марка -->
            <UITextfieldHinted v-model.trim.lazy="car.brand" label="Марка*" hint-name="car_brands" />
            <!-- Модель -->
            <UITextfieldHinted v-model.trim.lazy="car.model" label="Модель*" hint-name="car_models" />
            <!-- Год выпуска -->
            <UIInputNumber v-model.lazy="car.year_of_issue" label="Год выпуска*" />
            <!-- Гос. номер -->
            <UIInputFormated
              v-model.trim.lazy="car.plate_number"
              label="Гос. номер"
              :settings="plate_format"
              :class="validatePlateNumber"
            />
          </div>

          <div class="ui hidden divider"></div>

          <div class="four fields">
            <!-- Пробег -->
            <UIInputNumber v-model.lazy="car.mileage">Пробег</UIInputNumber>
            <!-- Цвет -->
            <UITextfield v-model.trim.lazy="car.color">Цвет</UITextfield>
            <!-- Категория ТС -->
            <UITextfield v-model.trim.lazy="car.vehicle_category">Категория ТС</UITextfield>
            <!-- Производитель -->
            <UITextfield v-model.trim.lazy="car.manufacturer">Производитель (Страна)</UITextfield>
          </div>

          <div class="four fields">
            <!-- Номер кузова -->
            <UITextfield
              v-model.trim.lazy="car.frame_no"
              label="Номер кузова"
              placeholder="Отсутствует"
              :class="validateFrameNo"
            />
            <!-- Номер двигателя -->
            <UITextfield v-model.trim.lazy="car.engine_no" label="Номер двигателя" />
            <!-- VIN  -->
            <UITextfield v-model.trim.lazy="car.vin" label="VIN" placeholder="Отсутствует" :class="validateVIN" />
            <!-- Номер рамы -->
            <UITextfield
              v-model.trim.lazy="car.chassis_no"
              label="Номер рамы"
              placeholder="Отсутствует"
              :class="validateChassisNo"
            />
            <!--  -->
          </div>

          <div class="four fields">
            <!-- Тип транспортного средства по ПТС -->
            <UITextfield v-model.trim.lazy="car.vehicle_type">Тип транспортного средства</UITextfield>
          </div>

          <div class="ui hidden divider"></div>

          <div class="three fields">
            <!-- Номер ПТС -->
            <UIInputFormated v-model.trim.lazy="car.pts_no" label="Номер ПТС" :settings="pts_format" />
            <!-- Номер свидетельства -->
            <UIInputFormated v-model.trim.lazy="car.svid_no" label="Номер свидетельства ТС" />
          </div>

          <div class="ui hidden divider"></div>

          <div class="three fields">
            <!-- Страховая компания -->
            <UITextfield v-model.trim.lazy="car.insurence_company">Страховая компания</UITextfield>
            <!-- Номер страхового свидетельства -->
            <UITextfield v-model.trim.lazy="car.insurence_police_no">Номер страхового свидетельства</UITextfield>
            <!-- Срок страхования -->
            <UIInputDate v-model.lazy="car.insurence_date">Срок страхования до</UIInputDate>
          </div>

          <div class="ui hidden divider"></div>

          <div class="three fields">
            <UITextfield v-model.trim.lazy="car.diag_card_no">Номер диагностической карты</UITextfield>
            <UIInputDate v-model.lazy="car.diag_card_issue_date">Дата выдачи</UIInputDate>
            <UIInputDate v-model.lazy="car.diag_card_valid_date">Срок действия до</UIInputDate>
          </div>

          <div class="ui hidden divider"></div>

          <div class="three fields">
            <!-- Стоимость автомобиля -->
            <UIInputMoney v-model.trim.lazy="car.price" label="Цена продажная*" />
            <!-- Закупочная цена для договора -->
            <UIInputMoney v-model.trim.lazy="car.purchase_price" label="Цена закупочная*" />
            <!-- Цена аренды -->
            <UIInputMoney v-model.trim.lazy="car.rent_price" label="Цена аренды" />
          </div>

          <div class="ui hidden divider"></div>

          <!-- Заметки -->
          <UITextfield v-model.trim.lazy="car.notes">Заметки</UITextfield>

          <!-- <a class="negative ui button">Удалить запись</a> -->
          <div class="ui error message"></div>
        </div>
        <!-- second column -->
        <div class="four wide second column">
          <!-- Select Investor -->
          <UIInputSelect
            text="Инвестор"
            placeholder="Инвестор не выбран"
            :value="selectedInvestor"
            :class="{ disabled: car.ref_car_status != 0 && paramId != null }"
            @button-did-click="browseInvestors"
          />
          <!-- Branch -->
          <UIInputDropdown v-model="car.branch_id" label="Филиал" :options="optionsBranch" :class="validateBranch" />
          <!-- Юр. лицо -->
          <UIInputDropdown
            v-model="car.company_id"
            label="Юр. лицо"
            :options="optionsCompany"
            :class="validateCompany"
          />
        </div>
      </div>
      <br />
      <!-- <input
        @click.prevent="actionsSave"
        name="submit"
        type="submit"
        value="Сохранить"
        class="ui primary submit button"
      />-->
    </form>
    <!-- /Form -->
    <!-- New Investors Browser -->
    <BrowseInvestors
      component="CMInvestorsList"
      :active="modals.browseInvestors"
      @hide="modals.browseInvestors = false"
      @selected="investorSelected"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";

import BrowseInvestors from "@/components/BrowseInvestors.vue";

import { plate_number_regx } from "@/utils/regexps";
import { vin_regx } from "@/utils/regexps";
import { frame_regx } from "@/utils/regexps";

export default {
  name: "CarsEdit",

  components: {
    BrowseInvestors,
  },

  mixins: [viewMixin],

  data() {
    return {
      // view
      view: {
        title: "Автомобиль",
        subTitle: "Редактирование автомобиля",
      },
      // model data
      car: {
        company_id: null,
      },
      investor: undefined,
      paramId: null,
      isLoading: false,
      // Modals
      modals: {
        browseInvestors: false,
      },
      // Branches
      branches: [],
      // Companies
      companies: [],
      // Format
      plate_format: {
        blocks: [6, 3],
        delimiter: " ",
        uppercase: true,
        // numericOnly: false,
      },
      pts_format: {
        blocks: [4, 11],
        delimiter: " ",
        uppercase: true,
        // numericOnly: false,
      },
    };
  },

  computed: {
    selectedInvestor() {
      if (this.investor === undefined) {
        return "";
      } else return this.investor.last_name + " " + this.investor.first_name + " " + this.investor.second_name;
    },
    optionsBranch() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.branches.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    optionsCompany() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.companies.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    // Validate
    validatePlateNumber() {
      var check = plate_number_regx.test(this.car.plate_number);

      return {
        success: this.car.plate_number ? this.car.plate_number.length >= 8 && check : false,
        error: this.car.plate_number ? !check : false,
      };
    },
    validateVIN() {
      var check = vin_regx.test(this.car.vin);

      return {
        success: this.car.vin ? this.car.vin.length >= 8 && check : false,
        error: this.car.vin ? !check : false,
      };
    },
    validateFrameNo() {
      var check = frame_regx.test(this.car.frame_no);

      return {
        success: this.car.frame_no ? this.car.frame_no.length >= 8 && check : false,
        error: this.car.frame_no ? !check : false,
      };
    },
    validateChassisNo() {
      var check = vin_regx.test(this.car.chassis_no);

      return {
        success: this.car.chassis_no ? this.car.chassis_no.length >= 8 && check : false,
        error: this.car.chassis_no ? !check : false,
      };
    },
    validateSubmit() {
      return {
        disabled:
          this.car.branch_id === null ||
          this.car.branch_id === undefined ||
          !this.car.model ||
          !this.car.brand ||
          this.car.year_of_issue.toString().length != 4,
      };
    },
    validateBranch() {
      return {
        success: this.car.branch_id != null && this.car.branch_id >= 0,
        error: this.car.branch_id === null || this.car.branch_id === undefined,
        // disabled: this.paramId != null,
        disabled: this.car.ref_car_status != 0 && this.paramId != null,
      };
    },
    validateCompany() {
      return {
        success: this.car.company_id && this.car.company_id > 0,
        error: !this.car.company_id,
      };
    },
  },

  created() {
    console.log("Created Params.id: " + this.$route.params);
    // Get ID from params
    this.paramId = this.$route.params.id === undefined ? null : parseInt(this.$route.params.id);
  },

  mounted() {
    this.setTitle();
    if (this.paramId) {
      this.fetchBranchesThenItem(this.paramId);
    } else {
      this.fetchBranches();
      this.fetchCompanies();
    }
  },

  methods: {
    setTitle() {
      if (this.paramId === null) {
        this.view.title = "Новый автомобиль";
        this.view.subTitle = "Создание нового автомобиля";
      } else {
        this.view.title = "Автомобиль" + " " + this.paramId;
      }
    },
    // ---
    set() {
      // item
      // this.investor.id = item.id;
    },
    back() {
      if (this.paramId) {
        this.$router.push({ name: "cars_details", id: this.paramId });
      } else {
        this.$router.push({ name: "cars" });
      }
    },
    actionsSave() {
      console.log("[SAVE] " + JSON.stringify(this.car));
      if (this.car.id == null) {
        console.log("create");
        this.create();
      } else {
        console.log("update");
        this.update();
      }
    },
    browseInvestors() {
      this.modals.browseInvestors = true;
    },
    investorSelected(item) {
      this.investor = item;
      this.modals.browseInvestors = false;
      this.car.investor_id = this.investor.id;
    },
    // Networking
    async fetchBranchesThenItem(car_id) {
      await this.fetchBranches();
      await this.fetchCompanies();
      await this.fetchItem(car_id);
    },
    async fetchItem(car_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getCar(car_id);
        this.car = result;
        if (this.car.investor_id > 0) {
          this.fetchInvestor(this.car.investor_id);
        }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
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
    async fetchBranches() {
      this.isLoading = true;
      try {
        let result = await apiService.getBranches();
        this.branches = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCompanies() {
      this.isLoading = true;
      try {
        this.companies = await apiService.getCompanies();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async create() {
      console.log("Create ", this.car);
      this.isLoading = true;
      try {
        let result = await apiService.createCar(this.car);
        this.car = result;
        this.$router.push({ name: "cars_details", params: { id: result.id } });
      } catch (error) {
        console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async update() {
      console.log("Update ", this.car);
      this.isLoading = true;
      try {
        let result = await apiService.updateCar(this.car);
        this.car = result;
        this.$router.push({ name: "cars_details", params: { id: result.id } });
      } catch (error) {
        console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.second.column {
  border-left: 1px solid #80808040;
  padding-left: 1rem !important;
}
</style>
