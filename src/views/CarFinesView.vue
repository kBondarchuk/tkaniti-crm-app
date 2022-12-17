<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UIButton
        icon="filter"
        type="labeled basic"
        style="min-width: 10em; margin-right: 3.5em"
        @click="showSideMenu = !showSideMenu"
      >
        <span v-if="showSideMenu">Скрыть</span>
        <span v-else>Показать</span>
      </UIButton>
      <!--  -->
      <!-- <UISpacer /> -->
      <!-- Select Car -->
      <CMCarSelector v-model:car-id="car_id" class="ui-tool-bar-item" style="min-width: 30em" />
      <!--  -->
      <UISpacer />
      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." class="ui-tool-bar-item" />
      <!--  -->
      <!-- <UISpacer /> -->
      <!--  -->
      <!-- <UIButton
        icon="plus"
        type="right labeled"
        text="Новый штраф"
        :class="{ disabled: !checkAuthRole('cars.create'), disabled: true }"
        @click="actionCreateFine"
      /> -->
    </template>
    <!-- /Toolbar -->

    <!-- Side Menu -->
    <template v-if="showSideMenu" #side>
      <div class="sticked" style="top: 61px">
        <!-- Payed status -->
        <LayoutSideMenu v-model="menuPayedStatusSelectedId" :items="payedStatusMenu" header="Оплата" />
        <!-- Charges -->
        <LayoutSideMenu v-model="menuChargeStatusSelectedId" :items="chargeStatusMenu" header="Начисления" />
        <!-- Terms -->
        <LayoutSideMenu
          v-model="menuTermsStatusSelectedId"
          :items="termsStatusMenu"
          header="Сроки"
          style="padding-bottom: 1em"
        />
      </div>
    </template>

    <!-- List -->
    <CMCarFinesList
      :key="key"
      :car-id="car_id"
      :filter-status="menuChargeStatusSelectedId != null ? [menuChargeStatusSelectedId] : null"
      :filter-payed-status="menuPayedStatusSelectedId != null ? [menuPayedStatusSelectedId] : null"
      :filter-terms-status="menuTermsStatusSelectedId != null ? [menuTermsStatusSelectedId] : null"
      :header-sticked-at="42"
      :bordered="false"
      :search-string="searchString"
      :hide-car-column="car_id > 0"
      @event-details="handleDetails"
      @filter-car="
        (newValue) => {
          car_id = newValue;
        }
      "
    />

    <!--       :car-id="car.id" -->
    <!-- <Portal>
      <ModalCarFineEdit
        :active="modals.edit"
        :selected-item="selectedItem"
        @hide="modals.edit = false"
        @did-change="fineCreated"
      />
    </Portal> -->
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
// import apiService from "@/services/api.service.js";

import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";
import CMCarFinesList from "@/components/CMCarFinesList.vue";
// import ModalCarFineEdit from "@/components/ModalCarFineEdit.vue";
import CMCarSelector from "@/components/CMCarSelector.vue";
import UITextSearch from "@/components/UITextSearch.vue";

export default {
  name: "CarFinesView",

  components: {
    LayoutPage,
    LayoutSideMenu,
    CMCarFinesList,
    CMCarSelector,
    UITextSearch,
  },

  mixins: [viewMixin],

  props: {
    termsStatus: {
      type: Number,
      default: null,
    },
    payedStatus: {
      type: Number,
      default: null,
    },
    carId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      view: { title: "Штрафы", subTitle: "Работа со штрафами" },
      showSideMenu: true,
      // Filters
      car_id: null,
      chargeStatusMenu: [
        { id: null, name: "Все", icon: "folder" },
        { id: -1, name: "Невозможно", icon: "close", label: "" },
        { id: 0, name: "Возможно", icon: "hourglass half" },
        { id: 1, name: "Начисленные", icon: "check", label: "" },
      ],
      payedStatusMenu: [
        { id: null, name: "Все", icon: "folder" },
        { id: 0, name: "Не оплачено", icon: "close" },
        { id: 2, name: "В процессе", icon: "hourglass half" },
        { id: 1, name: "Оплачено", icon: "check", label: "" },
      ],
      termsStatusMenu: [
        { id: null, name: "Все", icon: "folder" },
        { id: 1, name: "Со скидкой", icon: "percentage" },
        { id: 0, name: "Без скидки", icon: "calendar check", label: "" },
        { id: 2, name: "Просроченные", icon: "calendar times" },
      ],
      menuChargeStatusSelectedId: null,
      menuPayedStatusSelectedId: null,
      menuTermsStatusSelectedId: null,
      // Data
      searchString: "",
      selectedItem: null,
      // Modals
      modals: {
        edit: false,
      },
      // Keys
      key: 0,
    };
  },

  watch: {
    menuPayedStatusSelectedId: {
      immediate: false,
      handler(newValue) {
        // console.log("> menuSelectedId", newValue);
        // Save menuSelectedId
        // if (newValue === null) {
        //   localStorage.removeItem("cars.list.selected_menu");
        // } else {
        localStorage.setItem("car_fines.list.payed_menu", newValue);
        // }
        // fetch
        // this.fetchCarsCount();
      },
    },
    menuChargeStatusSelectedId: {
      immediate: false,
      handler(newValue) {
        // console.log("> menuSelectedId", newValue);
        // Save menuSelectedId
        // if (newValue === null) {
        //   localStorage.removeItem("cars.list.selected_menu");
        // } else {
        localStorage.setItem("car_fines.list.charged_menu", newValue);
        // }
        // fetch
        // this.fetchCarsCount();
      },
    },
    menuTermsStatusSelectedId: {
      immediate: false,
      handler(newValue) {
        localStorage.setItem("car_fines.list.terms_menu", newValue);
      },
    },
    car_id: {
      immediate: false,
      handler(newValue) {
        localStorage.setItem("car_fines.list.car_id", newValue);
      },
    },
  },

  created() {
    // Load saved params
    this.menuPayedStatusSelectedId = JSON.parse(localStorage.getItem("car_fines.list.payed_menu"));
    this.menuChargeStatusSelectedId = JSON.parse(localStorage.getItem("car_fines.list.charged_menu"));
    this.menuTermsStatusSelectedId = JSON.parse(localStorage.getItem("car_fines.list.terms_menu"));
    this.car_id = JSON.parse(localStorage.getItem("car_fines.list.car_id"));

    // console.warn(this.carId);

    if (this.carId != null) {
      this.car_id = this.carId;
    }

    console.warn("created-props: ", this.termsStatus, this.payedStatus, this.carId);
    if (this.termsStatus != null) {
      this.menuTermsStatusSelectedId = this.termsStatus;
    }

    if (this.payedStatus != null) {
      this.menuPayedStatusSelectedId = this.payedStatus;
    }
  },

  mounted() {
    // this.fetchRequestCount();
  },

  methods: {
    // Modals
    actionCreateFine() {
      this.selectedItem = null;
      this.modals.edit = true;
    },
    fineCreated() {
      console.log("Dtp changed!");
      this.key++;
    },
    // itemClick(item) {
    //   // console.log("Lick " + item);
    //   this.selectedItem = item;
    //   this.modals.edit = true;
    // },
    handleDetails(item) {
      console.log("row clicked: " + item.id);
      this.$router.push({ name: "car_fines_details", params: { id: item.id } });
    },

    // Util
    // combineMenu(counts) {
    //   this.menu
    //     .filter((item) => {
    //       return item.id >= 0;
    //     })
    //     .forEach((menuItem) => {
    //       var result = counts.find((obj) => {
    //         return obj.status == menuItem.id;
    //       });
    //       if (result) {
    //         this.$set(menuItem, "label", result.count);
    //       }
    //     });
    // },

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
