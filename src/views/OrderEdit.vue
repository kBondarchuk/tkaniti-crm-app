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
          <div class="three fields">
            <!-- ФИО -->
            <UITextfield v-model="order.customer_fio" label="ФИО заказчика" />
            <!-- Номер телефона -->
            <UIInputPhone v-model="order.customer_phone" label="Номер телефона" />
            <!-- Адрес доставки -->
            <!-- <UITextfield v-model="order.delivery_address" label="Адрес доставки" /> -->
          </div>

          <div class="ui hidden divider"></div>

          <div class="three fields">
            <!-- Метод доставки -->
            <UIInputDropdown
              v-model="order.delivery_method_id"
              label="Метод доставки"
              :options="optionsDeliveryMethod"
            />
            <!-- Другой метод доставки -->
            <UITextfield
              v-if="order.delivery_method_id == 999"
              v-model="order.delivery_method_other"
              label="Другой метод доставки"
            />
          </div>

          <div class="three fields">
            <!-- Цена -->
            <!-- <UITextfield v-model="order.total_price" label="Стоимость" /> -->
            <!-- Адрес доставки -->
            <UITextAria v-model="order.delivery_address" label="Адрес доставки" rows="5" />
            <!-- Комментарий -->
            <UITextAria v-model="order.notes" label="Комментарий" rows="5" />
          </div>

          <!-- <div class="ui hidden divider"></div> -->

          <!-- <a class="negative ui button">Удалить запись</a> -->
          <div class="ui error message"></div>
        </div>

        <!-- second column -->
        <div class="four wide second column">
          <!-- Метод оплаты -->
          <UIInputDropdown v-model="order.payment_method_id" label="Метод оплаты" :options="optionsPaymentMethod" />
          <!-- Остаток -->
          <!-- <UIInputMoney v-model="order.good_quantity" label="Количество" /> -->
          <!-- Цена -->
          <!-- <UIInputMoney v-model="order.total_price" label="Стоимость" /> -->
          <!-- Select Investor -->
          <!-- <UIInputSelect
            text="Инвестор"
            placeholder="Инвестор не выбран"
            :value="selectedInvestor"
            :class="{ disabled: car.ref_car_status != 0 && paramId != null }"
            @button-did-click="browseInvestors"
          /> -->
          <!-- Branch -->
          <!-- <UIInputDropdown v-model="car.branch_id" label="Филиал" :options="optionsBranch" :class="validateBranch" /> -->
          <!-- Юр. лицо -->
          <!-- <UIInputDropdown
            v-model="car.company_id"
            label="Юр. лицо"
            :options="optionsCompany"
            :class="validateCompany"
          /> -->
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
    <!-- <BrowseInvestors
      component="CMInvestorsList"
      :active="modals.browseInvestors"
      @hide="modals.browseInvestors = false"
      @selected="investorSelected"
    /> -->
    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";

// import BrowseInvestors from "@/components/BrowseInvestors.vue";

import UITextAria from "@/components/UITextAria.vue";

export default {
  name: "OrderEdit",

  components: {},

  mixins: [viewMixin],

  data() {
    return {
      // view
      view: {
        title: "Заказ",
        subTitle: "Редактирование заказа",
      },
      // model data
      order: {
        // company_id: null,
      },
      investor: undefined,
      paramId: null,
      isLoading: false,
      // Modals
      modals: {
        browseInvestors: false,
      },
      // Delivery methods
      deliveryMethods: [],
      // Payment methods
      paymentMethods: [],
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
    optionsDeliveryMethod() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.deliveryMethods.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    optionsPaymentMethod() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.paymentMethods.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
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
        // this.car.branch_id === null ||
        // this.car.branch_id === undefined ||
        // !this.car.model ||
        // !this.car.brand ||
        // this.car.year_of_issue.toString().length != 4,
      };
    },
    // validateBranch() {
    //   return {
    //     success: this.car.branch_id != null && this.car.branch_id >= 0,
    //     error: this.car.branch_id === null || this.car.branch_id === undefined,
    //     // disabled: this.paramId != null,
    //     disabled: this.car.ref_car_status != 0 && this.paramId != null,
    //   };
    // },
    // validateCompany() {
    //   return {
    //     success: this.car.company_id && this.car.company_id > 0,
    //     error: !this.car.company_id,
    //   };
    // },
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
      this.fetchPaymentMethods();
      this.fetchDeliveryMethods();
    }
  },

  methods: {
    setTitle() {
      if (this.paramId === null) {
        this.view.title = "Новый заказ";
        this.view.subTitle = "Создание нового заказа";
      } else {
        this.view.title = "Заказ" + " " + this.paramId;
      }
    },
    // ---
    set() {
      // item
      // this.investor.id = item.id;
    },
    back() {
      if (this.paramId) {
        this.$router.push({ name: "order_details", id: this.paramId });
      } else {
        this.$router.push({ name: "order" });
      }
    },
    actionsSave() {
      console.log("[SAVE] " + JSON.stringify(this.order));
      if (this.order.id == null) {
        console.log("create");
        this.create();
      } else {
        console.log("update");
        this.update();
      }
    },

    // Networking
    async fetchBranchesThenItem(car_id) {
      await this.fetchPaymentMethods();
      await this.fetchDeliveryMethods();
      await this.fetchItem(car_id);
    },
    async fetchItem(order_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getOrder(order_id);
        this.order = result;
        // if (this.car.investor_id > 0) {
        //   this.fetchInvestor(this.car.investor_id);
        // }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },

    async fetchDeliveryMethods() {
      this.isLoading = true;
      try {
        this.deliveryMethods = await apiService.getDeliveryMethods();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPaymentMethods() {
      this.isLoading = true;
      try {
        this.paymentMethods = await apiService.getPaymentMethods();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async create() {
      console.log("[OrderEdit]: Create ", this.order);
      this.isLoading = true;
      try {
        // let result = await apiService.createGood(this.order);
        this.order = result;
        this.$router.push({ name: "order_details", params: { id: result.id } });
      } catch (error) {
        console.error("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async update() {
      console.log("[OrderEdit]: Update ", this.order);
      this.isLoading = true;
      try {
        await apiService.updateOrder(this.order);
        this.$router.push({ name: "order_details", params: { id: this.order.id } });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
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
