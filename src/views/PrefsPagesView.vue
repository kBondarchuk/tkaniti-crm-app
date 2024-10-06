<template>
  <PagesView no-paddings route-name="PrefsPages" :view-id="_viewId" :page-id="pageId" :items="_menu_items"></PagesView>
</template>

<script setup>
import PagesView from "@/components/PagesView.vue";

// import { ref, computed, watch, toRaw } from "vue";

import { useView } from "@/composables/view";
import AccessRights from "@/enums/AccessRights";

const _menu_items = [
  {
    id: "profile",
    name: "Профиль пользователя",
    icon: "address card",
    component: "CMPrefsProfile",
    access: AccessRights.User,
  },
  {
    id: "users",
    name: "Пользователи",
    icon: "user friends",
    component: "CMPrefsUsers",
    access: AccessRights.Sysadmin,
  },
  // { id: 3, name: "Шаблоны", icon: "file word", component: "CMPrefsTemplates", access: "admin" },
  { id: "settings", name: "Настройки", icon: "tools", component: "CMPrefsSettings", access: "prefs.settings" },
  { id: "params", name: "Параметры", icon: "tools", component: "CMPrefsParams", access: "admin" },
  // { id: 7, name: "Реквизиты", icon: "stamp", component: "CMPrefsCompanies", access: "admin" },
  { id: "companies", name: "Юр. лица", icon: "stamp", component: "CMPrefsCompanies", access: "admin" },
  { id: "acq", name: "Эквайринг", icon: "visa", component: "CMPrefsAcquiring", access: "admin" },
  { id: "yoo", name: "Ю-касса", icon: "visa", component: "CMPrefsPaymentsYoo", access: AccessRights.Admin },
  { id: "sbp", name: "СБП", icon: "visa", component: "CMPrefsPaymentsSbp", access: "admin" },
  { id: "kassa", name: "Фискализация", icon: "cash register", component: "CMPrefsOfd", access: "admin" },
  { id: "system", name: "Система", icon: "lightbulb", component: "CMPrefsSystem", access: "sysadmin" },
];
/*
const _menu_items = [
  {
    id: "profile",
    name: "Профиль пользователя",
    icon: "address card",
    component: "CMPrefsProfile",
    access: AccessRights.User,
  },
  {
    id: "users",
    name: "Пользователи",
    icon: "user friends",
    component: "CMPrefsUsers2",
    access: AccessRights.Sysadmin,
  },
  {
    id: "templates",
    name: "Шаблоны",
    icon: "file word",
    component: "CMPrefsTemplates",
    access: AccessRights.Prefs.Templates,
  },
  {
    id: "contacts",
    name: "Контакты",
    icon: "phone",
    component: "CMPrefsContacts",
    access: AccessRights.Prefs.Contacts,
  },
  { id: "params", name: "Параметры", icon: "tools", component: "CMPrefsParams", access: AccessRights.Prefs.Params },
  {
    id: "percents",
    name: "Таблица процентов",
    icon: "percent",
    component: "CMPrefsPercentTable",
    access: AccessRights.Prefs.PercentTable,
  },
  { id: "branches", name: "Филиалы", icon: "landmark", component: "CMPrefsBranches", access: AccessRights.Sysadmin },
  {
    id: "expenses",
    name: "Статьи расхода",
    icon: "piggy bank",
    component: "CMPrefsExpensesCategories",
    access: AccessRights.Sysadmin,
  },
  { id: "companies", name: "Юр. лица", icon: "stamp", component: "CMPrefsCompanies", access: AccessRights.Admin },
  { id: "acq", name: "Эквайринг", icon: "visa", component: "CMPrefsPaymentsAcquiring", access: AccessRights.Admin },
  { id: "yoo", name: "Ю-касса", icon: "visa", component: "CMPrefsPaymentsYoo", access: AccessRights.Admin },
  { id: "sbp", name: "СБП", icon: "visa", component: "CMPrefsPaymentsSbp", access: AccessRights.Admin },
  { id: "kassa", name: "Фискализация", icon: "cash register", component: "CMPrefsOfd", access: AccessRights.Admin },
  { id: "system", name: "Система", icon: "lightbulb", component: "CMPrefsSystem", access: AccessRights.Sysadmin },
];
*/
/// SETUP

const _viewId = "PreferencesView";

const { view, checkAuthRole } = useView(_viewId, {
  title: "Настройки",
  subTitle: "",
});

/// PROPS

const props = defineProps({
  pageId: {
    type: String,
    default: null,
  },
});
</script>
