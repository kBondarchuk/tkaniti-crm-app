<template>
  <!-- <form class="ui form" style="width: 20em">
    <h2>Заказы</h2>
    <CUISelectCompany v-model="orderCompanyId" :disabled="isLoading" @selected="valueChanged" />
  </form> -->

  <YParamsList style="width: 40em" />
</template>

<script setup>
// import { ref, computed, watch } from "vue";
// import apiService from "@/services/api.service.js";
// import CUISelectCompany from "@/components/CUISelectCompany.vue";
// import Alerts from "@/utils/alerts";
import YParamsList from "@/components/YParamsList.vue";

// name: "CMPrefsSettings",

/// DATA
/*
const orderCompanyId = ref(null);
const isLoading = ref(false);

/// FUNCTIONS

function valueChanged(params) {
  postUpdateValue(params.id);
}

// Network
async function fetchPrefs() {
  isLoading.value = true;

  try {
    let result = await apiService.getPrefValueByKey("orders.company_id");
    console.log(result.key, result.int_value);
    orderCompanyId.value = result.int_value;
  } catch (error) {
    Alerts.showNetworkError(error);
  }
  isLoading.value = false;
}

// Update param
async function postUpdateValue(intValue) {
  isLoading.value = true;
  // console.log(user);
  const item = { key: "orders.company_id", int_value: intValue };

  try {
    await apiService.updatePrefValue(item);
    fetchPrefs();
    Alerts.showSuccess("Параметр обновлён! ", item.description);
  } catch (error) {
    Alerts.showNetworkError(error);
  }
  isLoading.value = false;
}
/// RUN

 fetchPrefs();
*/
</script>
