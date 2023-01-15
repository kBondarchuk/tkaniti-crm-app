<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <!-- Filter -->
      <!-- Investor  -->
      <UIInputDropdown
        v-model.number="filter.helper_value"
        :options="options"
        @input="dropDownChanged"
      ></UIInputDropdown>
      <!-- Select Car -->
      <UIInputSelect
        v-if="filter.helper_value == 2"
        placeholder="Автомобиль не выбран"
        :value="selectedCar"
        style="padding-left: 1em; min-width: 22em"
        @button-did-click="browseCars"
      ></UIInputSelect>

      <!-- Clear button -->
      <UIButton v-if="filter.helper_value == 2 && car" icon="close" @click="clearCar" />
      <!--  -->
      <!-- <UIButton icon="plus" type="right labeled right floated" @click="actionExpense" style="margin-top: 1px"
        >Внести затраты</UIButton
      > -->
      <UISpacer />
      <UIButton
        :icon="{ 'border none': showTotals, 'border all': !showTotals }"
        type="right labeled compact basic"
        @click="showTotals = !showTotals"
      >
        <span v-if="showTotals">Скрыть итоги</span>
        <span v-else>Показать итоги</span>
      </UIButton>
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
        <CMSalesList
          :key="key"
          :car-id="filter.car_id"
          :show-general="filter.show_general"
          :show-car="filter.show_car"
          :show-investor="filter.show_investors"
          :show-branch="true"
        />
      </div>
      <!-- Second Column -->
      <div v-if="showTotals" class="four wide column">
        <!-- Totals -->
        <CMSalesTotalsList
          :key="key + '-totals'"
          :car-id="filter.car_id"
          :show-general="filter.show_general"
          :group-branches="true"
        />
      </div>
    </div>
    <!-- New Expense Modal -->
    <!-- <FormExpense
      :active="modals.expense"
      :car-id="filter.car_id"
      @hide="modals.expense = false"
      @saved="expenseCreated"
    ></FormExpense> -->
    <!------->
    <!-- New Cars Browser -->
    <BrowseCars
      :active="modals.browseCars"
      :filter-status="[0, 1, 2, 3, 4, 5, 6]"
      @hide="modals.browseCars = false"
      @selected="carSelected"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import CMSalesList from "@/components/CMSalesList.vue";
import CMSalesTotalsList from "@/components/CMSalesTotalsList.vue";
// import FormExpense from "@/components/FormExpense.vue";
import BrowseCars from "@/components/BrowseCars.vue";

export default {
  name: "IncomeView",
  components: {
    CMSalesList,
    CMSalesTotalsList,
    BrowseCars,
  },
  mixins: [viewMixin],
  data() {
    return {
      view: { title: "Поступления", subTitle: "Просмотр поступлений от продаж" },
      // menu: [
      //   { id: 1, name: "Затраты", icon: "" },
      //   { id: 2, name: "Счета", icon: "" },
      // ],
      menuSelectedId: 1,
      showTotals: true,
      // Data
      filter: {
        helper_value: 1,
        car_id: null,
        investor_id: 1,
        show_car: true,
        show_investors: true,
        show_general: false,
      },
      car: undefined,
      options: [],
      // Modals
      modals: {
        expense: false,
        browseCars: false,
      },
      // Keys
      key: 0,
    };
  },

  computed: {
    selectedCar() {
      if (this.car === undefined) {
        return "";
      } else
        return (
          this.car.brand + " " + this.car.model + " " + this.car.year_of_issue + " [" + this.car.plate_number + "]"
          //  +
          // this.car.car_status +
          // ">"
        );
    },
  },
  created() {
    if (!this.checkAuthRole("director")) {
      this.options = [{ name: "Поступления на автомобиль", value: 2 }];
      this.filter.helper_value = 2;
      this.filter.car_id = null;
      this.filter.show_general = false;
    } else {
      this.filter.helper_value = 2;
      this.filter.car_id = null;
      this.filter.show_general = false;
      this.options = [
        // { name: "Все поступления", value: 1 },
        // { name: "Общие поступления", value: 0 },
        { name: "Поступления на автомобиль", value: 2 },
      ];
    }
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
    actionExpense() {
      this.modals.expense = true;
    },
    expenseCreated() {
      this.key++;
    },
    dropDownChanged(value) {
      switch (value) {
        case 0: // General expenses
          this.filter.show_general = true;
          this.filter.show_car = false;
          this.filter.car_id = null;
          break;
        case 1: // All expenses
          this.filter.show_general = false;
          this.filter.show_car = true;
          this.filter.car_id = null;
          break;
        case 2: // Car expenses
          this.filter.show_general = false;
          this.filter.show_car = true;
          this.filter.car_id = 0;
          break;
      }
    },
    browseCars() {
      this.modals.browseCars = true;
    },
    carSelected(item) {
      this.car = item;
      this.filter.car_id = item.id;
      this.modals.browseCars = false;
    },
    clearCar() {
      this.car = undefined;
      this.filter.car_id = null;
    },
  },
};
</script>
