<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Request Type Filter   -->
      <!-- <UIInputDropdown v-model.number="requestTypeHelperValue" :options="typeFilterOptions" /> -->
      <!--  -->
      <UISpacer />
      <!--  -->
      <UIButton
        text="Выдача под отчёт"
        icon="plus"
        type="right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="actionCreateRequest()"
      />
      <!--  -->
      <!-- <UIButton
        icon="plus"
        type="right labeled"
        text="Авансовый отчёт"
        @click="actionCreateReport()"
        :class="{ disabled: !checkAuthRole('budget.create') }"
      /> -->
      <!-- <UIButton
        icon="plus"
        type="right labeled"
        text="Авансовый отчёт"
        @click="actionCreateRequest('income')"
        :class="{ disabled: !checkAuthRole('budget.create') }"
      /> -->
    </template>
    <!-- /Toolbar -->
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>
    <!-- List -->
    <CMAdvanceRequestsList
      :key="key"
      :filter-status="menuSelectedId"
      :filter-type="filter.type_id"
      :header-sticked-at="42"
      @event-details="handleDetails"
    />
    <!--  -->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMAdvanceRequestsList from "@/components/CMAdvanceRequestsList.vue";
// import FormBudgetRequest from "@/components/FormBudgetRequest.vue";

export default {
  name: "AdvanceView",

  components: {
    CMAdvanceRequestsList,
    // UIInputDropdown,
    // FormBudgetRequest,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Деньги под отчёт", subTitle: "Список заявок" },
      // Filters
      filter: {
        date1: "",
        date2: "",
        type_id: 0,
      },
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
        { name: "Все документы", value: 0 },
        { name: "Заявки на получение", value: 1 },
        { name: "Авансовые отчёты", value: 2 },
      ],
      requestTypeHelperValue: 1,
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
      handler() {
        // fetch count
        this.fetchRequestCount();
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
    this.fetchRequestCount();
  },

  methods: {
    handleDetails(item) {
      console.log("row clicked: " + item.id);
      this.$router.push({
        name: "advance_request_details",
        params: { request_id: item.id },
      });
    },
    typeDropDownChanged(value) {
      switch (value) {
        case 0: // All
          this.filter.type_id = null;
          break;
        case 1: // Выдача
          this.filter.type_id = 0;
          break;
        case 2: // АО
          this.filter.type_id = 1;
          break;
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
    // Route to New advance request
    // income / expense
    actionCreateRequest() {
      this.$router.push({
        name: "advance_request_new",
        params: { type_id: 0 },
      });
    },
    actionCreateReport() {
      this.$router.push({
        name: "advance_request_new",
        params: { type_id: 1 },
      });
    },

    // Networking
    async fetchRequestCount() {
      try {
        let result = await apiService.getAdvanceRequestsCount(this.filter.type_id);
        // console.log(result);

        this.combineMenu(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
  },
};
</script>
