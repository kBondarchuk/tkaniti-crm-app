<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UIButton icon="filter" type="labeled compact basic" style="min-width: 10em" @click="toggleSideMenu">
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
      <UIButton
        v-if="checkAuthRole('contracts.create')"
        icon="plus"
        type="right labeled right floated"
        text="Новый договор аренды"
        @click="newContract"
      />
    </template>
    <!-- /Toolbar -->

    <!-- Side Menu -->
    <template v-if="showSideMenu" #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>

    <!-- List -->
    <CMRentContractsList
      :contracts-status="selectedStatuses"
      :header-sticked-at="42"
      :search-string="searchString"
      @event-details="handleDetails"
    />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import UITextSearch from "@/components/UITextSearch.vue";
import CMRentContractsList from "@/components/CMRentContractsList.vue";

export default {
  name: "ContractsRent",

  components: {
    CMRentContractsList,
    UITextSearch,
  },

  mixins: [viewMixin],

  data() {
    return {
      searchString: "",
      // View
      view: { title: "Договоры аренды", subTitle: "Учёт договоров аренды" },
      showSideMenu: true,
      menu: [
        { id: null, name: "Все", icon: "folder", status: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { id: 1, name: "В работе", icon: "play", label: "", status: [2, 1, 0] },
        { id: 0, name: "Ожидающие", icon: "hourglass half", status: [0] },
        { id: 2, name: "Просроченные", icon: "warning", status: [2] },
        { id: 3, name: "Завершённые", icon: "check", status: [3] },
        { id: 4, name: "Залог", icon: "money", status: [4] },
        // { id: 4, name: "В архиве", icon: "archive", status: [4] },
        { id: 10, name: "Закрытые", icon: "close", status: [10] },
        // { id: -1, name: "Удалённые", icon: "trash alternate", status: [-1] },
      ],
      menuSelectedId: 999,
      selectedStatuses: null,
    };
  },

  watch: {
    menuSelectedId: {
      immediate: false,
      handler(newValue) {
        // console.log("menuSelectedId", newValue);
        // Save menuSelectedId
        // if (newValue === null) {
        //   localStorage.removeItem("contracts.list.selected_menu");
        // } else {
        localStorage.setItem("contracts.rent.list.selected_menu", newValue);
        // }
        // Get statuses
        this.selectedStatuses = this.menu.find((item) => item.id == newValue).status;
        // console.log(this.selectedStatuses);

        // Fetch
        this.fetchCountractCount();
      },
    },
  },

  created() {
    // Load saved params
    this.menuSelectedId = JSON.parse(localStorage.getItem("contracts.rent.list.selected_menu"));
    this.showSideMenu = JSON.parse(localStorage.getItem("contracts.rent.list.show_side_menu")) ?? true;
  },

  mounted() {
    this.fetchCountractCount();
  },

  methods: {
    newContract() {
      this.$router.push({ name: "new_contract_rent" });
    },
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.$router.push({ name: "contract_rent_details", params: { id: item.id } });
    },
    toggleSideMenu() {
      this.showSideMenu = !this.showSideMenu;
      localStorage.setItem("contracts.rent.list.show_side_menu", this.showSideMenu);
    },
    async fetchCountractCount() {
      try {
        let result = await apiService.getRentContractsCount();
        // this.items = result;
        // console.log(result);
        this.combineMenu(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
    combineMenu(counts) {
      let holder = {};

      this.menu
        .filter((item) => {
          return item.id >= 0;
        })
        .forEach((menuItem) => {
          menuItem.status.forEach((status) => {
            var result = counts.find((obj) => {
              return obj.status == status;
            });

            if (result) {
              // console.log(menuItem.id, ":", result.count);

              if (holder[menuItem.id]) {
                holder[menuItem.id] = holder[menuItem.id] + result.count;
              } else {
                holder[menuItem.id] = result.count;
              }
            }
          });
        });

      this.menu.forEach((menuItem) => {
        if (holder[menuItem.id]) {
          //* this.$set(menuItem, "label", holder[menuItem.id]);
          menuItem["label"] = holder[menuItem.id];
        }
      });

      // console.log("=", holder);
    },
  },
};
</script>
