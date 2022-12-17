<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!--  -->
      <!-- <UIButton icon="plus" type="labeled" style="visibility: hidden">x</UIButton> -->
      <UISpacer />
      <!--  -->
      <UIButton
        icon="plus"
        type="right labeled right floated"
        text="Новое ДТП"
        :class="{ disabled: !checkAuthRole('cars.create') }"
        @click="actionDtpCreate"
      />
    </template>
    <!-- /Toolbar -->
    <!-- Side Menu -->
    <template #side>
      <LayoutSideMenu v-model="menuSelectedId" :items="menu" :sticky-at="56" />
    </template>
    <!-- List -->
    <CMDTPList :key="key" :car_id="null" :header-sticked-at="42" :bordered="false" @event-details="dtpClick" />
    <!-- <CMRegistrationRequestsList
      @event-details="handleDetails"
      :filter-status="menuSelectedId"
      :header-sticked-at="42"
      :key="key"
    /> -->
    <!--  -->
    <!-- Modal -->
    <!-- :car-id="car.id" -->

    <FormCarDtpEdit
      :active="modals.dtp"
      :selected-item="selectedDtp"
      @hide="modals.dtp = false"
      @did-change="dtpCreated"
    />

    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
// import apiService from "@/services/api.service.js";

import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";
import CMDTPList from "@/components/CMDTPList.vue";
import FormCarDtpEdit from "@/components/FormCarDtpEdit.vue";

export default {
  name: "DTPView",

  components: {
    LayoutPage,
    CMDTPList,
    FormCarDtpEdit,
    LayoutSideMenu,
  },

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "ДТП", subTitle: "Список ДТП" },
      // Filters
      filter: {
        date1: "",
        date2: "",
      },
      menu: [
        { id: null, name: "Все", icon: "folder" },
        // { id: 0, name: "Не выплаченные", icon: "edit" },
        // { id: 1, name: "Выплаченные", icon: "hourglass half", label: "" },
      ],
      menuSelectedId: null,
      // Data
      selectedDtp: null,
      // Modals
      modals: {
        dtp: false,
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
        // this.fetchRequestCount();
      },
    },
  },
  mounted() {
    // this.fetchRequestCount();
  },

  methods: {
    // Modals
    actionDtpCreate() {
      this.selectedDtp = null;
      this.modals.dtp = true;
    },
    dtpCreated() {
      console.log("Dtp changed!");
      this.key++;
    },
    dtpClick(item) {
      // console.log("Lick " + item);
      this.selectedDtp = item;
      this.modals.dtp = true;
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

    // Networking
    // async fetchRequestCount() {
    //   try {
    //     let result = await apiService.getRegistrationRequestsCount();
    //     this.combineMenu(result);
    //   } catch (error) {
    //     this.$UIService.showNetworkError(error);
    //   }
    // },
  },
};
</script>
