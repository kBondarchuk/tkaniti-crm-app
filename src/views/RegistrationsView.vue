<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!--  -->
      <UIButton icon="plus" type="labeled" style="visibility: hidden">x</UIButton>
      <!-- <UIButton
        icon="plus"
        type="right labeled right floated"
        @click="actionCreateRequest"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        >Новая заявка</UIButton
      > -->
    </template>
    <!-- /Toolbar -->
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>
    <!-- List -->
    <CMRegistrationRequestsList
      :key="key"
      :filter-status="menuSelectedId"
      :header-sticked-at="42"
      @event-details="handleDetails"
    />
    <!--  -->
    <!-- New Expense Modal -->
    <!-- <FormBudgetRequest
      :active="modals.expense"
      @hide="modals.expense = false"
      @saved="requestCreated"
      v-if="checkAuthRole('budget.create')"
    ></FormBudgetRequest> -->
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMRegistrationRequestsList from "@/components/CMRegistrationRequestsList.vue";
// import FormBudgetRequest from "@/components/FormBudgetRequest.vue";

import LayoutSideMenu from "@/components/LayoutSideMenu.vue";

export default {
  name: "RegistrationsView",
  components: {
    CMRegistrationRequestsList,
    // FormBudgetRequest,
    LayoutSideMenu,
  },
  mixins: [viewMixin],
  data() {
    return {
      view: { title: "Заявки на регистрацию", subTitle: "Список заявок на регистрацию нового клиента" },
      // Filters
      filter: {
        date1: "",
        date2: "",
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
  },
  mounted() {
    this.fetchRequestCount();
  },
  methods: {
    handleDetails(item) {
      console.log("row clicked: " + item.id);
      this.$router.push({
        name: "registration_request_details",
        params: { request_id: item.id },
      });
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
          }
        });
    },
    // Modals
    actionCreateRequest() {
      // this.modals.expense = true;
      this.$router.push({
        name: "budget_request_new",
      });
    },
    requestCreated() {
      this.key++;
      this.fetchRequestCount();
    },
    // Networking
    async fetchRequestCount() {
      try {
        let result = await apiService.getRegistrationRequestsCount();
        this.combineMenu(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
  },
};
</script>
