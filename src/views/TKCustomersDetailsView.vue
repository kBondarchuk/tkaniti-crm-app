<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton text="Назад" icon="left arrow" type="basic labeled" color="white" @click="back('customers')" />
      <UISpacer />
      <!--  -->
      <!-- <UIButton icon="right chevron" type="basic right labeled" @click="actionPasswordModal">
        Установить пароль в ЛК
      </UIButton>
      <UIButton icon="right chevron" type="basic right labeled" @click="actionBonusModal">Начислить премию</UIButton> -->
      <!--  -->
      <!-- <UISpacer /> -->
      <UIButton
        v-if="checkAuthRole('manager')"
        type="basic labeled"
        icon="edit"
        text="Изменить"
        :class="{ disabled: !checkAuthRole('customers.edit') }"
        @click="edit"
      />
    </template>
    <!-- /Toolbar -->
    <!-- Tabs -->
    <div class="ui top tabular menu">
      <div class="item" :class="{ active: tabsComponent == 1 }" @click="tabSelect(1)">ОСНОВНОЕ</div>
      <!-- <div class="item" :class="{ active: tabsComponent == 5 }" @click="tabSelect(5)">ОПЕРАЦИИ</div>
      <div class="item" :class="{ active: tabsComponent == 2 }" @click="tabSelect(2)">ДОКУМЕНТЫ</div>
      <div class="item" :class="{ active: tabsComponent == 3 }" @click="tabSelect(3)">ЛИЧНЫЙ КАБИНЕТ</div>
      <div class="item" :class="{ active: tabsComponent == 4 }" @click="tabSelect(4)">ИСТОРИЯ</div> -->
    </div>
    <!-- Pages -->
    <!-- Page 1: General -->
    <div class="ui tab" :class="{ active: tabsComponent == 1 }">
      <!-- Grid -->
      <LayoutTwoColumns>
        <!-- First column -->
        <TKCustomerDetails :key="keys.details" :customer-id="paramId" />
        <!-- second column -->
      </LayoutTwoColumns>
    </div>

    <!-- Page 2: Documents -->
    <div class="ui tab" :class="{ active: tabsComponent == 2 }">
      <!-- Documents -->
      <!-- <CMDocuments v-if="tabsComponent == 2" :folder-uuid="customer.folder_uuid" type="customer" /> -->
    </div>
    <!-- Page 3: LK -->
    <div class="ui tab" :class="{ active: tabsComponent == 3 }">
      <!-- Grid -->
      <div class="ui grid">
        <!-- fist column -->
        <div class="eight wide column">
          <!-- CMCustomerLKInfo -->
          <!-- <CMCustomerLKInfo v-if="tabsComponent == 3" :customer_id="paramId" /> -->
        </div>
      </div>
    </div>
    <!-- Page 4: History -->
    <div v-if="tabsComponent == 4" class="ui tab" :class="{ active: tabsComponent == 4 }">
      <!-- Live Schedule -->
      <!-- <CMCustomerHistoryList v-if="paramId" :key="keys.history" :customer_id="paramId" style="max-width: 50%" /> -->
      <!-- /Live Schedule -->
    </div>
    <!-- Page 5: Transactions -->
    <div v-if="tabsComponent == 5" class="ui tab" :class="{ active: tabsComponent == 5 }">
      <!-- <CMOperationsList
        :key="keys.transactions + '-list'"
        operations-type="customers"
        :operations-subject-id="paramId"
        :show-basis="false"
        :show-branch="false"
      /> -->
    </div>
    <!-- Bonus Modal -->
    <!-- <FormBonus
      :active="modals.bonus"
      :customer_id="paramId"
      @hide="modals.bonus = false"
      @saved="bonusCreated"
    ></FormBonus> -->
    <!------->
    <!-- Bonus Modal -->
    <!-- <FormPassword
      :active="modals.password"
      :customer_id="paramId"
      @hide="modals.password = false"
      @saved="passwordCreated"
    ></FormPassword> -->
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import TKCustomerDetails from "@/components/TKCustomerDetails.vue";
// import CMCustomersContractsList from "@/components/CMCustomersContractsList.vue";
// import FormBonus from "@/components/FormBonus.vue";
// import FormPassword from "@/components/FormPassword.vue";
// import CMDocuments from "@/components/CMDocuments.vue";
// import CMCustomerLKInfo from "@/components/CMCustomerLKInfo.vue";
// import CMCustomerHistoryList from "@/components/CMCustomerHistoryList.vue";
// import CMOperationsList from "@/components/CMOperationsList.vue";
// import CMWarningsList from "@/components/CMWarningsList.vue";

export default {
  name: "TKCustomersDetailsView",
  components: {
    TKCustomerDetails,
    // CMCustomersContractsList,
    // FormBonus,
    // FormPassword,
    // CMDocuments,
    // CMCustomerLKInfo,
    // CMCustomerHistoryList,
    // CMOperationsList,
    // CMWarningsList,
  },
  mixins: [viewMixin],

  data() {
    return {
      customer: {},
      paramId: null,
      // UI
      view: {
        title: "Клиент",
        subTitle: "Детализация, список договоров",
      },
      tabsComponent: 1,
      // Keys
      keys: { details: 0, history: 0, transactions: 0 },
      // Modals
      modals: {
        bonus: false,
        password: false,
      },
    };
  },
  watch: {
    $route(to) {
      // to, from
      if (to.name == "customers_details") {
        this.paramId = this.$route.params.id === undefined ? null : parseInt(this.$route.params.id);
        this.reload();
      }
    },
  },
  created() {
    console.log("Created Params.id: " + this.$route.params.id);
    this.paramId = this.$route.params.id === undefined ? null : parseInt(this.$route.params.id);
  },

  mounted() {
    this.reload();
  },
  methods: {
    setTitle() {
      this.view.title = "Клиент " + this.paramId;

      if (Object.keys(this.customer).length > 0)
        // eslint-disable-next-line prettier/prettier
        this.view.title = this.customer.last_name + " " + this.customer.first_name + " " + this.customer.second_name + " " + "(" + this.paramId + ")";
    },
    // Tabs
    tabSelect(id) {
      this.tabsComponent = id;
    },
    // Modals
    actionBonusModal() {
      console.log("bonusCreated");
      this.modals.bonus = true;
    },
    bonusCreated() {
      console.log("bonusCreated");
      this.keys.details++;
    },
    actionPasswordModal() {
      console.log("passwordForm");
      this.modals.password = true;
    },
    passwordCreated() {
      console.log("passwordCreated");
      this.keys.history++;
    },
    // ---
    reload() {
      console.log("Reload Params.id: " + this.$route.params.id);

      // Get ID from params
      if (this.paramId) {
        this.setTitle(this.paramId);
        this.fetchItem(this.paramId);
      }
    },
    // back() {
    //   this.$router.push({ name: "customers" });
    // },
    edit() {
      this.$router.push({ name: "customers_edit" });
    },

    // Network
    async fetchItem(customer_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getCustomer(customer_id);
        this.customer = result;
        this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.eight.wide.second.column {
  padding-left: 0;
}
</style>
