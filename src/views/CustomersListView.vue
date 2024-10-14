<template>
  <LayoutPage no-paddings :view-id="_viewId">
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

/// SETUP

const _viewId = "CustomersListView";
const _storageID = _viewId + ".list.selected_menu";

const { view, checkAuthRole } = useView(_viewId, {
  title: "Клиенты",
  subTitle: "Список клиентов",
});
const { navigateTo } = useNavigation();

/// DATA

const searchString = ref("");

/// COMPUTED

const checkAuthNewCustomer = computed(() => {
  return checkAuthRole(AccessRights.Customers.Edit);
});

/// FUNCTIONS

function newCustomer() {
  navigateTo.Customers.New();
}

function handleDetails(item) {
  navigateTo.Customers.Details({ customerId: item.id });
}
</script>
