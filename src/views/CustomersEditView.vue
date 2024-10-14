<template>
  <LayoutPage no-vertical-paddings back-button="customers" view-id="CustomersEditView">
    <!-- Toolbar -->
    <template #toolbar>
      <UISpacer />
      <!-- Save -->
      <UIButton
        text="Сохранить"
        type="primary"
        :class="validateSubmit"
        :disabled="!checkAuthNewCustomer"
        @click.prevent="actionsSave"
      />
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
          <div class="three fields">
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
            <!-- Адрес -->
            <UITextAria v-model="customer.address_fact" label="Адрес" rows="4" />
          </div>

          <div class="two fields">
            <UITextAria v-model="customer.notes" label="Заметки" rows="3" />
          </div>

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
  </LayoutPage>
</template>

<script>
import { ref, computed, watch } from "vue";

import apiService from "@/services/api.service.js";
import { useView } from "@/composables/view";
import { useNavigation } from "@/composables/navigation";

import AccessRights from "@/enums/AccessRights";

import CustomerObject from "@/objects/Customer";
import Alerts from "@/utils/alerts";

export default {
  name: "CMCustomersEditView",

  /// PROPS

  props: {
    customerId: {
      type: Number,
      default: null,
    },
  },

  setup() {
    /// SETUP

    const { view, checkAuthRole } = useView("CustomersEditView", {
      title: "Клиент",
      subTitle: "Редактирование клиента",
    });
    const { navigateTo } = useNavigation();

    /// COMPUTED

    const checkAuthNewCustomer = computed(() => {
      return checkAuthRole(AccessRights.Customers.Edit);
    });

    /// FUNCTIONS

    function gotoCustomerDetails(customerId) {
      navigateTo.Customers.Details({ customerId: customerId }, true);
    }

    return { view, checkAuthRole, checkAuthNewCustomer, gotoCustomerDetails };
  },

  data() {
    return {
      customer: Object.assign({}, CustomerObject),
      isLoading: false,
    };
  },

  computed: {
    // Validate
    validateSubmit() {
      return {
        disabled: !this.customer.first_name || !this.customer.last_name,
      };
    },
  },

  mounted() {
    this.setTitle();
    if (this.customerId) {
      this.fetchItem(this.customerId);
    }
  },

  methods: {
    setTitle() {
      if (this.customerId === null) {
        this.view.title = "Новый клиент";
        this.view.subTitle = "Создание нового клиента";
      } else {
        this.view.title = "Клиент" + " " + this.customerId;
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
        Alerts.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async create() {
      console.log("Create ", this.customer);
      this.isLoading = true;
      try {
        let result = await apiService.createCustomer(this.customer);
        console.log(result);

        this.gotoCustomerDetails(result.id);
      } catch (error) {
        Alerts.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async update() {
      console.log("Update ", this.customer);
      this.isLoading = true;
      try {
        await apiService.updateCustomer(this.customer);
        this.gotoCustomerDetails(this.customer.id);
      } catch (error) {
        Alerts.showNetworkError(error);
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
