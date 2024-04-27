<template>
  <div>
    <!-- Loading block -->
    <div v-if="isLoading && !sectionsCount" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !sectionsCount" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Пусто</span>
    </div>

    <template v-for="section in Object.keys(prefs)" :key="section">
      <h2>{{ section }}</h2>
      <!-- Table -->
      <table
        v-if="sectionsCount"
        class="ui very compact collapsing unstackable table form"
        :class="{ loading: isLoading }"
        style="width: 100%; font-size: 13px"
      >
        <!-- <thead>
        <tr>
          <th>Параметр</th>
          <th>Значение</th>
          <th></th>
        </tr>
      </thead> -->
        <tbody>
          <template v-for="(item, index) in prefs[section]" :key="item.key">
            <YParamsListItem
              v-if="item.key == 'orders.company_id'"
              v-model="prefs[section][index]"
              @save="saveParam(item)"
            >
              <CUISelectCompany v-model="prefs[section][index].int_value" :disabled="isLoading" :label="null" />
            </YParamsListItem>
            <YParamsListItem v-else v-model="prefs[section][index]" @save="saveParam(item)" />
          </template>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import apiService from "@/services/api.service.js";
import Alerts from "@/utils/alerts";
import { useCheckAuth } from "@/composables/checkAuth";
import YParamsListItem from "@/components/YParamsListItem.vue";
import CUISelectCompany from "@/components/CUISelectCompany.vue";

// name: "YParamsList",

/// SETUP

const { checkAuthRole } = useCheckAuth();

/// DATA

const prefs = ref([]);
const isLoading = ref(false);

/// COMPUTED

const sectionsCount = computed(() => {
  return Object.keys(prefs.value).length ?? 0;
});

/// FUNCTIONS

function saveParam(item) {
  // console.log(item);
  postUpdateValue(item);
}

function checkAccess(role) {
  return checkAuthRole(role);
}

function checkMenuItem(item) {
  return checkAccess(item.access_right) || item.access_right === null;
}

function parseParams(params) {
  const parsedMenu = [];

  params.forEach((item) => {
    if (checkMenuItem(item)) {
      parsedMenu.push(item);
    }

    return true;
  });
  // console.log(parsedMenu);
  return parsedMenu;
}

// Network
async function fetchPrefs() {
  isLoading.value = true;

  try {
    let result = await apiService.getPrefs();

    const parsedResult = parseParams(result);

    prefs.value = Object.groupBy(parsedResult, ({ section_title }) => section_title);

    console.warn(prefs.value);
  } catch (error) {
    Alerts.showNetworkError(error);
  }
  isLoading.value = false;
}

// Update param
async function postUpdateValue(item) {
  isLoading.value = true;
  // console.log(user);

  try {
    await apiService.updatePrefValue(item);
    fetchPrefs();

    Alerts.showSuccess("Параметр обновлён! ", item.name);
  } catch (error) {
    Alerts.showNetworkError(error);
  }
  isLoading.value = false;
}

/// RUN

fetchPrefs();
</script>
