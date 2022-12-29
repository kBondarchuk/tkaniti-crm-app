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
      action
      :class="{ loading: isLoading }"
      style="height: 100%; margin-top: 1rem; margin-bottom: 1rem"
    >
      <!-- Grid -->
      <div class="ui grid" style="height: 100%">
        <!-- fist column -->
        <div class="twelve wide column">
          <!--  -->
          <div class="three fields" :class="{ disabled: !isEditable }">
            <!-- ФИО -->
            <UITextfield v-model="customer.last_name" label="Фамилия" />
            <UITextfield v-model="customer.first_name" label="Имя" />
            <UITextfield v-model="customer.second_name" label="Отчество" />
            <!--  -->
          </div>

          <div class="three fields">
            <!-- Дата рождения -->
            <UIInputDateBirth v-model="customer.date_of_birth" label="Дата рождения" placeholder="дд.мм.гггг" />
            <!-- Пол -->
            <UIInputDropdown
              v-model="customer.gender"
              label="Пол"
              :options="[
                { name: 'Не выбран', value: null },
                { name: 'Мужской', value: 1 },
                { name: 'Женский', value: 2 },
              ]"
            />
          </div>

          <div class="three fields">
            <!-- Телефон -->
            <UIInputPhone v-model.lazy="customer.phone" label="Телефон" />
            <!-- Email -->
            <UITextfield v-model.trim.lazy="customer.email" label="Email" />
          </div>

          <div class="two fields">
            <UITextAria v-model.trim.lazy="customer.notes" label="Заметки" rows="3" />
          </div>

          <!-- Адрес -->
          <!-- <UITextfield v-model.trim.lazy="customer.contact_address" label="Адрес" /> -->

          <!--  -->
          <div class="ui error message"></div>
        </div>
        <!-- second column -->
        <div class="four wide second column">
          <!-- Branch -->
        </div>
      </div>
    </form>
    <!-- /Form -->
    <!-- New Customers Browser -->
    <!-- <BrowseCustomers
      component="CMCustomersList"
      :active="modals.browseCustomers"
      @hide="modals.browseCustomers = false"
      @selected="referrerSelected"
    /> -->
    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";

import CustomerObject from "@/objects/Customer";
// import BrowseCustomers from "@/components/BrowseCustomers.vue";

export default {
  name: "CMCustomersEditView",

  components: {
    // BrowseCustomers,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Клиент", subTitle: "Редактирование клиента" },
      customer: Object.assign({}, CustomerObject),
      paramId: null,
      isLoading: false,
      // Modals
      // modals: {
      //   browseCustomers: false,
      // },
    };
  },

  computed: {
    // Validate
    validateSubmit() {
      return {
        disabled: !this.customer.first_name || !this.customer.last_name,
      };
    },
    validateBranch() {
      return {
        success: this.customer.branch_id != null && this.customer.branch_id >= 0,
        error: this.customer.branch_id === null || this.customer.branch_id === undefined,
      };
    },
    isEditable() {
      return this.checkAuthRole("customers") || !this.customer.id > 0;
    },
  },

  created() {
    console.log("[Customers Edit]: Created Params.id: " + this.$route.params.id);
    // Get ID from params
    this.paramId = this.$route.params.id === undefined ? null : parseInt(this.$route.params.id);
  },

  mounted() {
    this.setTitle();
    if (this.paramId) {
      this.fetchItem(this.paramId);
    }
  },

  methods: {
    setTitle() {
      if (this.paramId === null) {
        this.view.title = "Новый клиент";
        this.view.subTitle = "Создание нового клиента";
      } else {
        this.view.title = "Клиент" + " " + this.paramId;
      }
    },
    //
    // browseCustomers() {
    //   this.modals.browseCustomers = true;
    // },
    // ---
    fillAddress() {
      //* this.$set(this.customer, "address_fact_region", this.customer.address_reg_region || null);
      //* this.$set(this.customer, "address_fact_area", this.customer.address_reg_area || null);
      //* this.$set(this.customer, "address_fact_city_type", this.customer.address_reg_city_type || null);
      //* this.$set(this.customer, "address_fact_city", this.customer.address_reg_city || null);
      //* this.$set(this.customer, "address_fact", this.customer.address_reg || null);
      this.customer["address_fact_region"] = this.customer.address_reg_region || null;
      this.customer["address_fact_area"] = this.customer.address_reg_area || null;
      this.customer["address_fact_city_type"] = this.customer.address_reg_city_type || null;
      this.customer["address_fact_city"] = this.customer.address_reg_city || null;
      this.customer["address_fact"] = this.customer.address_reg || null;
    },
    back() {
      if (this.paramId) {
        this.$router.push({ name: "customers_details", id: this.paramId });
      } else {
        this.$router.push({ name: "customers" });
      }
    },
    actionsSave() {
      console.log("[SAVE] ", JSON.stringify(this.customer));
      if (this.customer.id == null) {
        console.log("create");
        this.create();
      } else {
        console.log("update");
        this.update();
      }
    },
    // Networking
    async fetchItem(customer_id) {
      this.isLoading = true;
      try {
        this.customer = await apiService.getCustomer(customer_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async create() {
      console.log("Create ", this.customer);
      this.isLoading = true;
      try {
        let result = await apiService.createCustomer(this.customer);
        // this.customer = result;
        console.log(result);

        this.$router.push({
          name: "customers_details",
          params: { id: result.id },
        });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async update() {
      console.log("Update ", this.customer);
      this.isLoading = true;
      try {
        await apiService.updateCustomer(this.customer);
        this.$router.push({
          name: "customers_details",
          params: { id: this.customer.id },
        });
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
/* fix */
.ui.form .fields .fields {
  margin-bottom: 1em;
}
.second.column {
  border-left: 1px solid #80808040;
  padding-left: 1rem !important;
}
</style>
