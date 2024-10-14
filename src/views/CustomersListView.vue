<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Hide / Show -->
      <UIButton icon="filter" type="labeled basic" style="min-width: 10em; visibility: hidden"> </UIButton>
      <!--  -->
      <UISpacer />
      <!-- Поиск -->
      <UITextSearch v-model="searchString" placeholder="Поиск..." />
      <!--  -->
      <UISpacer />
      <!-- Add -->
      <UIButton
        :disabled="!checkAuthNewCustomer"
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

<script setup>
import { ref, computed, watch } from "vue";
import { useView } from "@/composables/view";
import { useNavigation } from "@/composables/navigation";

import TKCustomersList from "@/components/TKCustomersList.vue";

import AccessRights from "@/enums/AccessRights";

// name: "TKCustomersView",

/// SETUP
// const router = useRouter();
const { view, checkAuthRole } = useView("CustomersView");
const { navigateTo } = useNavigation();

view.title = "Клиенты";
view.subTitle = "Список клиентов";

/// DATA
const searchString = ref("");

/// COMPUTED

const checkAuthNewCustomer = computed(() => {
  return checkAuthRole(AccessRights.Customers.Edit);
});

/// FUNCTIONS

function newCustomer() {
  // router.push({ name: "customers_new" });
  navigateTo.Customers.New();

}

function handleDetails(item) {
  console.log("row clicked: " + item.id);
  // router.push({ name: "customers_details", params: { id: item.id } });
  navigateTo.Customers.Details({ customerId: item.id });
}
</script>
