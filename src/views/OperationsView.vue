<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <!-- Filter -->
      <!-- Investor  -->
      <UIInputDropdown v-model.number="filter.helper_value" :options="options" @update:model-value="dropDownChanged" />

      <!-- Select Car -->
      <UIInputSelect
        v-if="filter.helper_value == 4"
        placeholder="Автомобиль не выбран"
        :value="selectedCar"
        style="padding-left: 1em; min-width: 22em"
        @button-did-click="browseCars"
      />

      <!-- Select Investor -->
      <UIInputSelect
        v-if="filter.helper_value == 6"
        placeholder="Инвестор не выбран"
        :value="selectedInvestor"
        style="padding-left: 1em; min-width: 22em"
        @button-did-click="browseInvestors"
      />

      <!-- Select Customer -->
      <UIInputSelect
        v-if="filter.helper_value == 5"
        placeholder="Клиент не выбран"
        :value="selectedCustomer"
        style="padding-left: 1em; min-width: 22em"
        @button-did-click="browseCustomers"
      />

      <!-- Clear button -->
      <UIButton v-if="[4, 5, 6].includes(filter.helper_value)" icon="close" @click="clearSelection" />
      <!--  -->
      <!-- <UIButton icon="plus" type="right labeled right floated" @click="actionExpense" style="margin-top: 1px"
        >Внести затраты</UIButton
      > -->
      <!-- <UIButton
        :icon="{ 'border none': showTotals, 'border all': !showTotals }"
        type="right labeled compact basic"
        @click="showTotals = !showTotals"
      >
        <span v-if="showTotals">Скрыть итоги</span>
        <span v-else>Показать итоги</span>
      </UIButton> -->
      <!-- -->
    </template>
    <!-- /Toolbar -->

    <!-- Grid -->
    <div class="ui grid">
      <!-- Fist Column -->
      <div
        :class="{ 'twelve wide column': showTotals, 'sixteen wide column': !showTotals }"
        style="transition: all 0.2s; transition-timing-function: ease-in"
      >
        <!-- List -->
        <CMOperationsList
          :operations-type="filter.operations_type"
          :operations-subject-id="filter.operations_subject_id"
          :show-general="filter.show_general"
          :show-car="filter.show_car"
          :show-investor="filter.show_investors"
          :show-branch="false"
          :show-double-amount="
            ['investors', 'cars', 'customers', 'contracts', 'rent_contracts'].includes(filter.operations_type)
          "
          :show-subjects="
            !['cars', 'customers', 'contracts', 'rent_contracts', 'investors', 'expenses', 'sales'].includes(
              filter.operations_type
            )
          "
          :show-object="
            ['cars', 'customers', 'contracts', 'rent_contracts', 'investors', 'expenses', 'sales'].includes(
              filter.operations_type
            )
          "
        />
      </div>
      <!-- Second Column -->
      <!-- <div class="four wide column" v-if="showTotals">
        -- Totals --
        <CMExpensesTotalsList
          :car-id="filter.car_id"
          :show-general="filter.show_general"
          :group-branches="true"
          :key="key + '-totals'"
        />
      </div> -->
    </div>
    <!-- Cars Browser -->
    <BrowseCars
      :active="modals.browseCars"
      :filter-status="[0, 1, 2, 3, 4, 5, 6]"
      @hide="modals.browseCars = false"
      @selected="carSelected"
    />
    <!------->
    <!-- Investors Browser -->
    <BrowseInvestors
      :active="modals.browseInvestors"
      @hide="modals.browseInvestors = false"
      @selected="investorSelected"
    />
    <!------->
    <!-- Customers Browser -->
    <BrowseCustomers
      :active="modals.browseCustomers"
      @hide="modals.browseCustomers = false"
      @selected="customerSelected"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import LayoutPage from "@/components/LayoutPage.vue";
import CMOperationsList from "@/components/CMOperationsList.vue";
import BrowseCars from "@/components/BrowseCars.vue";
import BrowseInvestors from "@/components/BrowseInvestors.vue";
import BrowseCustomers from "@/components/BrowseCustomers.vue";

export default {
  name: "OperationsView",

  components: {
    LayoutPage,
    // UIButton,
    CMOperationsList,
    // CMExpensesTotalsList,
    // FormExpense,
    // UIInputDropdown,
    // UIInputNumber,
    // UIInputSelect,
    BrowseCars,
    BrowseInvestors,
    BrowseCustomers,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Финансовые операции", subTitle: "Просмотр всех операций" },
      // menu: [
      //   { id: 1, name: "Затраты", icon: "" },
      //   { id: 2, name: "Счета", icon: "" },
      // ],
      menuSelectedId: 1,
      showTotals: false,
      // Data
      filter: {
        helper_value: 0,
        operations_type: null,
        operations_subject_id: null,
        show_car: true,
        show_investors: true,
        show_general: false,
      },
      car: undefined,
      investor: undefined,
      customer: undefined,
      options: [],
      // Modals
      modals: {
        browseCars: false,
        browseInvestors: false,
        browseCustomers: false,
      },
    };
  },

  computed: {
    selectedCar() {
      if (this.car === undefined) {
        return "";
      } else
        return (
          this.car.brand + " " + this.car.model + " " + this.car.year_of_issue + " [" + this.car.plate_number + "]"
        );
    },
    selectedInvestor() {
      if (this.investor === undefined) {
        return "";
      } else return this.investor.last_name + " " + this.investor.first_name + " " + this.investor.second_name;
    },
    selectedCustomer() {
      if (this.customer === undefined) {
        return "";
      } else return this.customer.last_name + " " + this.customer.first_name + " " + this.customer.second_name;
    },
  },

  created() {
    this.options = [
      { name: "Все операции", value: 0, type: null },
      { name: "Все расходы", value: 1, type: "expenses" },
      { name: "Все продажи", value: 2, type: "sales" },
      { name: "Операции с договорами", value: 3, type: "contracts" },
      { name: "Операции с договорами аренды", value: 8, type: "rent_contracts" },
      { name: "Операции с автомобилями", value: 4, type: "cars" },
      { name: "Операции с клиентами", value: 5, type: "customers" },
      { name: "Операции с ивесторами", value: 6, type: "investors" },
      { name: "Операции с филиалами", value: 7, type: "branches" },
    ];
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
    dropDownChanged(value) {
      const selected = this.options.find((x) => x.value === value);
      this.filter.operations_type = selected.type;
      this.filter.operations_subject_id = null;
    },
    browseCars() {
      this.modals.browseCars = true;
    },
    carSelected(item) {
      this.car = item;
      this.filter.operations_subject_id = item.id;
      this.modals.browseCars = false;
    },
    browseInvestors() {
      this.modals.browseInvestors = true;
    },
    investorSelected(item) {
      this.investor = item;
      this.filter.operations_subject_id = item.id;
      this.modals.browseInvestors = false;
    },
    browseCustomers() {
      this.modals.browseCustomers = true;
    },
    customerSelected(item) {
      this.customer = item;
      this.filter.operations_subject_id = item.id;
      this.modals.browseCustomers = false;
    },
    clearSelection() {
      this.car = undefined;
      this.investor = undefined;
      this.customer = undefined;

      this.filter.operations_subject_id = null;
    },
    resetFilter() {
      this.car = undefined;
      this.investor = undefined;
      this.customer = undefined;
    },
  },
  // mounted() {
  //   if (!this.checkAuthRole("director")) {
  //     this.options = [{ name: "Затраты на автомобиль", value: 2 }];
  //     this.filter.helper_value = 2;
  //     this.filter.car_id = null;
  //   } else {
  //     this.options = [
  //       { name: "Общие затраты", value: 0 },
  //       { name: "Все затраты", value: 1 },
  //       { name: "Затраты на автомобиль", value: 2 },
  //     ];
  //   }
  // },
};
</script>
