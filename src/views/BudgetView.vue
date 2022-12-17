<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Request Type Filter   -->
      <UIInputDropdown v-model.number="requestTypeHelperValue" :options="typeFilterOptions" />
      <!--  -->
      <!-- <UISpacer /> -->
      <!-- Statuses -->
      <div v-if="checkAuthRole('manager')" class="ui compact basic buttons">
        <button
          class="ui button"
          :class="{ active: viewOption == 0 }"
          style="padding-top: 7px; padding-bottom: 7px"
          @click.prevent="viewOption = 0"
        >
          Документы
        </button>
        <button
          class="ui button"
          :class="{ active: viewOption == 1 }"
          style="padding-top: 7px; padding-bottom: 7px"
          @click.prevent="viewOption = 1"
        >
          Содержимое
        </button>
      </div>
      <!-- <button class="ui compact basic button" :class="{ active: viewOption == 1 }" @click.prevent="viewOption = 1">
        Содержимое
      </button> -->
      <UISpacer />
      <!--  -->
      <UIButton
        icon="minus"
        type="right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        text="Авансовый отчет"
        @click="actionCreateRequest('advance_report')"
      />
      <UIButton
        icon="minus"
        type="right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        text="Заявка на оплату"
        @click="actionCreateRequest('expense')"
      />

      <UIButton
        icon="plus"
        type="right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        text="Заявка на продажу"
        @click="actionCreateRequest('income')"
      />
    </template>
    <!-- /Toolbar -->
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>
    <!-- List -->
    <CMBudgetRequestsList
      v-if="viewOption == 0"
      :key="key"
      :filter-status="menuSelectedId"
      :filter-type="filter.request_type"
      :header-sticked-at="42"
      @event-details="handleDetails"
    />
    <CMBudgetRequestsItemsList
      v-if="viewOption == 1"
      :key="key"
      :filter-status="menuSelectedId"
      :filter-type="filter.request_type"
      :header-sticked-at="42"
      @event-details="handleDetails"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMBudgetRequestsList from "@/components/CMBudgetRequestsList.vue";
import CMBudgetRequestsItemsList from "@/components/CMBudgetRequestsItemsList.vue";

const _budget_status_state = "budget.list.status";
const _budget_view_state = "budget.list.view_option";
const _budget_filter_type_state = "budget.list.type";
const _budget_filter_type_value_state = "budget.list.type_value";

export default {
  name: "BudgetView",

  components: {
    CMBudgetRequestsList,
    CMBudgetRequestsItemsList,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Бюджетные заявки", subTitle: "Список заявок на расход и приход" },
      // Filters
      filter: {
        date1: "",
        date2: "",
        request_type: null,
      },
      viewOption: 0, // 0 - documents, 1 - items
      menu: [
        { id: null, name: "Все", icon: "folder" },
        { id: 0, name: "Черновик", icon: "edit" },
        { id: 1, name: "Согласование", icon: "hourglass half", label: "" },
        { id: 2, name: "Отклонена", icon: "times circle" },
        { id: 3, name: "Исправление", icon: "edit" },
        { id: 4, name: "Согласована", icon: "thumbs up" },
        { id: 5, name: "Исполнена", icon: "check double" },
      ],
      typeFilterOptions: [
        { name: "Все", value: 0 },
        { name: "Оплаты", value: 1 },
        { name: "Продажи", value: 2 },
        { name: "Авансовые отчёты", value: 3 },
      ],
      requestTypeHelperValue: 0,
      menuSelectedId: null,
      // Modals
      modals: {
        expense: false,
      },
      // Keys
      key: 0,
    };
  },

  watch: {
    menuSelectedId: {
      immediate: false,
      handler(newValue) {
        // save
        localStorage.setItem(_budget_status_state, newValue);
        // fetch count
        this.fetchRequestCount();
      },
    },
    viewOption: {
      immediate: false,
      handler(newValue) {
        // save
        localStorage.setItem(_budget_view_state, newValue);
      },
    },
    requestTypeHelperValue: {
      immediate: false,
      handler(newValue) {
        this.typeDropDownChanged(newValue);
      },
    },
  },
  mounted() {
    // Load saved params
    // this.menuSelectedId = JSON.parse(localStorage.getItem(_budget_status_state));
    // this.viewOption = JSON.parse(localStorage.getItem(_budget_view_state));
    // this.fetchRequestCount();
  },
  created() {
    // Load saved params
    this.menuSelectedId = JSON.parse(localStorage.getItem(_budget_status_state));
    this.requestTypeHelperValue = JSON.parse(localStorage.getItem(_budget_filter_type_state)) || 0;
    this.filter.request_type = localStorage.getItem(_budget_filter_type_value_state);
    this.viewOption = JSON.parse(localStorage.getItem(_budget_view_state)) || 0;
    console.log(">>> created load requestTypeHelperValue: ", this.requestTypeHelperValue);
  },

  methods: {
    handleDetails(request_id) {
      console.log("row clicked (request_id): " + request_id);

      // if (item.request_type == "advance_report") {
      this.$router.push({
        name: "budget_request_details",
        params: { request_id: request_id },
      });
      // } else {
      //   this.$router.push({
      //     name: "budget_request_details",
      //     params: { request_id: item.id },
      //   });
      // }
    },
    typeDropDownChanged(value) {
      console.log(">>> typeDropDownChanged: ", value);

      switch (value) {
        case 0: // All
          this.filter.request_type = null;
          break;
        case 1: // expenses
          this.filter.request_type = "expense";
          break;
        case 2: // Income
          this.filter.request_type = "income";
          break;
        case 3: // АО
          this.filter.request_type = "advance_report";
          break;
      }
      // save
      localStorage.setItem(_budget_filter_type_state, this.requestTypeHelperValue);
      if (this.filter.request_type == null) {
        // remove
        localStorage.removeItem(_budget_filter_type_value_state);
      } else {
        localStorage.setItem(_budget_filter_type_value_state, this.filter.request_type);
      }
      this.fetchRequestCount();
    },
    // Util
    combineMenu(counts) {
      this.menu
        .filter((item) => {
          return item.id >= 0;
        })
        .forEach((menuItem) => {
          var result = counts.find((obj) => {
            return obj.status == menuItem.id;
          });
          if (result) {
            //* this.$set(menuItem, "label", result.count);
            menuItem["label"] = result.count;
          } else {
            //* this.$set(menuItem, "label", "");
            menuItem["label"] = "";
          }
        });
    },
    // Route to New Budget request
    // income / expense
    actionCreateRequest(request_type) {
      console.log(request_type);

      // if (request_type === "advance_report") {
      this.$router.push({
        name: "budget_request_new2",
        params: { request_type: request_type },
      });
      // } else {
      // this.$router.push({
      //   name: "budget_request_new",
      //   params: { request_type: request_type },
      // });
      // }
    },

    // Networking
    async fetchRequestCount() {
      try {
        let result = await apiService.getBudgetRequestsCount(this.filter.request_type);
        // console.log(result);

        this.combineMenu(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
  },
};
</script>
