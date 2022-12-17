<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Hide / Show -->
      <UIButton icon="filter" type="labeled basic" style="min-width: 10em; visibility: hidden">
        <!-- <span v-if="showSideMenu">Скрыть</span> -->
        <!-- <span v-else>Показать</span> -->
      </UIButton>
      <!--  -->
      <UISpacer />
      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <!--  -->
      <UISpacer />
      <!-- Add -->
      <UIButton
        v-if="checkAuthRole('customers.create')"
        icon="plus"
        type="right labeled"
        text="Новый клиент"
        @click="newCustomer"
      />
    </template>
    <!-- /Toolbar -->
    <!-- List -->
    <TKCustomersList :header-sticked-at="42" :search-string="searchString" @event-details="handleDetails" />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import TKCustomersList from "@/components/TKCustomersList.vue";

export default {
  name: "TKCustomersView",

  components: {
    TKCustomersList,
  },

  mixins: [viewMixin],

  data() {
    return {
      searchString: "",
      // View
      view: { title: "Клиенты", subTitle: "Список клиентов" },
    };
  },
  methods: {
    newCustomer() {
      this.$router.push({ name: "customers_new" });
    },
    handleDetails(item) {
      console.log("row clicked: " + item.id);
      this.$router.push({ name: "customers_details", params: { id: item.id } });
    },
  },
};
</script>
