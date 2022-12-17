<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UIButton icon="filter" type="labeled basic" style="min-width: 10em" @click="toggleSideMenu">
        <span v-if="showSideMenu">Скрыть</span>
        <span v-else>Показать</span>
      </UIButton>
      <!--  -->
      <UISpacer />
      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <!--  -->
      <UISpacer />
      <!--  -->
      <UIButton v-if="checkAuthRole('contracts.create')" icon="plus" type="right labeled" @click="newContract">
        Новый договор
      </UIButton>
    </template>
    <!-- /Toolbar -->

    <!-- Side Menu -->
    <template v-if="showSideMenu" #side>
      <div class="sticked" style="top: 61px">
        <!-- Statuses -->
        <LayoutSideMenu v-model="menuSelectedId" :items="menu" />
        <!-- Investors -->
        <MultipleSideMenu
          v-if="showSideMenu && investors.length && checkAuthRole('manager')"
          v-model="selectedInvestors"
          :items="investors"
          header="Инвесторы"
          name="fio_short"
        />
        <!-- Branches -->

        <MultipleSideMenu
          v-if="showSideMenu && branches.length && checkAuthRole('manager')"
          v-model="selectedBranches"
          :items="branches"
          header="Филиалы"
          tint-color="pink"
        />
      </div>
    </template>
    <!-- List -->
    <CMContractsList
      :contracts-status="selectedStatuses"
      :contracts-investors="selectedInvestors"
      :contracts-branches="selectedBranches"
      :header-sticked-at="42"
      :search-string="searchString"
      :card-view="showSideMenu"
      @event-details="handleDetails"
    />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import UITextSearch from "@/components/UITextSearch.vue";
import CMContractsList from "@/components/CMContractsList.vue";
import MultipleSideMenu from "@/components/MultipleSideMenu.vue";

export default {
  name: "ContractsLeasingView",
  components: {
    CMContractsList,
    UITextSearch,
    MultipleSideMenu,
  },

  mixins: [viewMixin],

  data() {
    return {
      searchString: "",
      // View
      view: { title: "Договоры выкупа", subTitle: "Учёт договоров выкупа" },
      showSideMenu: true,
      menu: [
        { id: null, name: "Все", icon: "folder", status: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
        { id: 1, name: "В работе", icon: "play", label: "", status: [1, 0] },
        { id: 0, name: "Ожидающие", icon: "hourglass half", status: [0] },
        { id: 2, name: "Завершённые", icon: "check", status: [2] },
        { id: 3, name: "Выплаченные", icon: "thumbs up", status: [3] },
        { id: 4, name: "В архиве", icon: "archive", status: [4] },
        { id: 10, name: "Возврат", icon: "undo", status: [10] },
        { id: 11, name: "Обмен", icon: "close", status: [11] },
        // { id: -1, name: "Удалённые", icon: "trash alternate", status: [-1] },
      ],
      investors: [
        // { id: 1, name: "ЮМ-АВТО" },
        // { id: 2, name: "Каратаев Ю.М." },
        // { id: 3, name: "Иванов И.И." },
      ],
      branches: [
        // { id: 1, name: "ЮМ-АВТО" },
        // { id: 2, name: "Каратаев Ю.М." },
        // { id: 3, name: "Иванов И.И." },
      ],
      menuSelectedId: 999,
      selectedStatuses: null,
      selectedInvestors: [],
      selectedBranches: [],
    };
  },
  watch: {
    menuSelectedId: {
      immediate: false,
      handler(newValue) {
        console.log("menuSelectedId", newValue);
        // Save menuSelectedId
        // if (newValue === null) {
        //   localStorage.removeItem("contracts.list.selected_menu");
        // } else {
        localStorage.setItem("contracts.list.selected_menu", newValue);
        // }
        // Get statuses
        this.selectedStatuses = this.menu.find((item) => item.id == newValue).status;
        // console.log(this.selectedStatuses);
        // Fetch
        this.fetchCountractCount({ investors: this.selectedInvestors, branches: this.selectedBranches });
      },
    },
    selectedInvestors: {
      handler(newValue) {
        // console.log(">>> selectedInvestors");
        // Save
        localStorage.setItem("contracts.list.selected_investors", newValue.join(","));
        // Fetch
        this.fetchCountractCount({ investors: this.selectedInvestors, branches: this.selectedBranches });
      },
      deep: true,
    },
    selectedBranches: {
      handler(newValue) {
        // console.log("*** selectedBranches");
        // Save
        localStorage.setItem("contracts.list.selected_branches", newValue.join(","));
        // Fetch
        this.fetchCountractCount({ investors: this.selectedInvestors, branches: this.selectedBranches });
      },
      deep: true,
    },
  },

  created() {
    // Load saved params
    const selected_menu_params = localStorage.getItem("contracts.list.selected_menu");
    if (selected_menu_params) {
      this.menuSelectedId = JSON.parse(selected_menu_params);
    } else {
      this.menuSelectedId = null;
    }

    // Side panel
    this.showSideMenu = JSON.parse(localStorage.getItem("contracts.lease.list.show_side_menu")) ?? true;

    const selected_investors_params = localStorage.getItem("contracts.list.selected_investors");
    if (selected_investors_params) {
      this.selectedInvestors = selected_investors_params
        .split(",")
        .filter((id) => !isNaN(parseInt(id)))
        .map(Number);
    }
    const selected_branches_params = localStorage.getItem("contracts.list.selected_branches");
    if (selected_branches_params) {
      this.selectedBranches = selected_branches_params
        .split(",")
        .filter((id) => !isNaN(parseInt(id)))
        .map(Number);
    }
  },
  mounted() {
    if (this.checkAuthRole("manager")) {
      this.fetchInvestors();
      this.fetchBranches();
    }
    // this.fetchCountractCount({ investors: this.selectedInvestors, branches: this.selectedBranches });
  },

  methods: {
    newContract() {
      this.$router.push({ name: "new_contract" });
    },
    handleDetails(item) {
      console.log("row clicked: " + item.id);
      this.$router.push({ name: "contract_details", params: { id: item.id } });
    },
    toggleSideMenu() {
      this.showSideMenu = !this.showSideMenu;
      localStorage.setItem("contracts.lease.list.show_side_menu", this.showSideMenu);
    },
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
            //* this.$set(menuItem, "label", 0);
            menuItem["label"] = 0;
          }
        });

      // console.log("+++", JSON.stringify(this.menu));
    },

    // Network
    async fetchInvestors() {
      try {
        let result = await apiService.getInvestors();
        this.investors = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
    async fetchBranches() {
      try {
        let result = await apiService.getBranches();
        this.branches = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
    async fetchCountractCount({ investors, branches } = {}) {
      try {
        let result = await apiService.getContractsCount({ investors, branches });
        // this.items = result;
        // console.log(result);
        this.combineMenu(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
  },
};
</script>
