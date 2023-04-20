<template>
  <LayoutPage no-vertical-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UIButton text="Назад" icon="left arrow" type="basic labeled" @click="back" />
      <UISpacer />
      <UIButton text="Сохранить" type="primary" :class="validateSubmit" @click.prevent="actionsSave" />
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
          <div class="three fields">
            <!-- Бренд -->
            <UITextfield v-model.trim.lazy="good.brand" label="Бренд" />
            <!-- Наименование -->
            <UITextfield v-model.trim.lazy="good.name" label="Наименование" />
            <!-- Код -->
            <UITextfield v-model.trim.lazy="good.code" label="Артикул" />
          </div>

          <div class="fields">
            <!-- Ширина -->
            <UIInputNumber v-model="good.width" label="Ширина, см" class="two wide field" />
            <!-- Состав -->
            <UITextfield v-model.trim.lazy="good.sostav" label="Состав" class="six wide field" />
          </div>

          <div class="two fields">
            <!-- Цена -->
            <UITextAria v-model="good.description" label="Описание" />
            <!-- Комментарий -->
            <UITextAria
              v-model="good.notes"
              label="Комментарий"
              placeholder="Для внутреннего использования. Не публикуется."
            />
          </div>

          <div class="ui hidden divider"></div>

          <!-- <a class="negative ui button">Удалить запись</a> -->
          <div class="ui error message"></div>
        </div>
        <!-- second column -->
        <div class="four wide second column">
          <!-- Единицы измерения -->
          <UIInputDropdown
            v-model="good.measure_id"
            label="Единицы измерения"
            :options="optionsMeasures"
            :disabled="isEditMode"
          />
          <!-- :class="validateCompany" -->
          <!-- Остаток -->
          <UIInputMoney
            :key="'ost' + decimalScale"
            v-model="good.quantity"
            label="Исходный остаток"
            :disabled="!good.measure_id"
            :decimal-scale="decimalScale"
          />

          <!-- Цена -->
          <UIInputMoney v-model="good.price" label="Цена" />
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

    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";

import GoodObject from "@/objects/Good";

export default {
  name: "GoodEditView",

  components: {},

  mixins: [viewMixin],

  props: {
    goodId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // model data
      good: Object.assign({}, GoodObject),
      measures: [],
      // view
      view: {
        title: "Товар",
        subTitle: "Редактирование товара",
      },
      isLoading: false,
    };
  },

  computed: {
    isEditMode() {
      return this.goodId ? true : false;
    },
    selectedInvestor() {
      if (this.investor === undefined) {
        return "";
      } else return this.investor.last_name + " " + this.investor.first_name + " " + this.investor.second_name;
    },
    optionsMeasures() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.measures.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    measureFraction() {
      const self = this;
      const _item = this.measures.find((item) => item.id == self.good.measure_id);
      return _item?.system_fraction;
    },
    decimalScale() {
      // if (this.measureFraction == 0) return 0;
      // if (this.measureFraction == 1) return 1;
      // if (this.measureFraction == 2) return 2;
      // if (this.measureFraction == 3) return 3;
      return this.measureFraction;
    },
    // Validate
    // validatePlateNumber() {
    //   var check = plate_number_regx.test(this.car.plate_number);

    //   return {
    //     success: this.car.plate_number ? this.car.plate_number.length >= 8 && check : false,
    //     error: this.car.plate_number ? !check : false,
    //   };
    // },
    // validateVIN() {
    //   var check = vin_regx.test(this.car.vin);

    //   return {
    //     success: this.car.vin ? this.car.vin.length >= 8 && check : false,
    //     error: this.car.vin ? !check : false,
    //   };
    // },
    // validateFrameNo() {
    //   var check = frame_regx.test(this.car.frame_no);

    //   return {
    //     success: this.car.frame_no ? this.car.frame_no.length >= 8 && check : false,
    //     error: this.car.frame_no ? !check : false,
    //   };
    // },
    // validateChassisNo() {
    //   var check = vin_regx.test(this.car.chassis_no);

    //   return {
    //     success: this.car.chassis_no ? this.car.chassis_no.length >= 8 && check : false,
    //     error: this.car.chassis_no ? !check : false,
    //   };
    // },
    validateSubmit() {
      return {
        disabled: false,
      };
    },
  },

  async created() {
    console.log("Created Params.id: " + this.$route.params);
    this.reset();
    this.setTitle();

    if (this.goodId) {
      this.fetchBranchesThenItem(this.goodId);
    } else {
      await this.fetchMeasures();
    }
  },

  methods: {
    setTitle() {
      if (this.goodId === null) {
        this.view.title = "Новый товар";
        this.view.subTitle = "Создание нового товара";
      } else {
        this.view.title = "Товар" + " " + this.goodId;
      }
    },
    // ---
    reset() {
      if (this.goodId === null) {
        this.good.name = "Ткань ";
      }
    },
    back() {
      if (this.goodId) {
        this.$router.push({ name: "goods_details", id: this.goodId });
      } else {
        this.$router.push({ name: "goods" });
      }
    },
    actionsSave() {
      console.log("[SAVE] " + JSON.stringify(this.good));
      if (this.good.id == null) {
        console.log("create");
        this.create();
      } else {
        console.log("update");
        this.update();
      }
    },

    // Networking
    async fetchBranchesThenItem(car_id) {
      // await this.fetchBranches();
      await this.fetchMeasures();
      await this.fetchItem(car_id);
    },
    async fetchItem(good_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getGood(good_id);
        this.good = result;
        // if (this.car.investor_id > 0) {
        //   this.fetchInvestor(this.car.investor_id);
        // }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },

    async fetchMeasures() {
      this.isLoading = true;
      try {
        this.measures = await apiService.getMeasures();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async create() {
      console.log("Create ", this.good);
      this.isLoading = true;
      try {
        let result = await apiService.createGood(this.good);
        this.good = result;
        this.$router.push({ name: "goods_details", params: { id: result.id } });
      } catch (error) {
        console.error("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async update() {
      console.log("Update ", this.good);
      this.isLoading = true;
      try {
        let result = await apiService.updateGood(this.good.id, this.good);
        this.good = result;
        this.$router.push({ name: "goods_details", params: { id: result.id } });
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
