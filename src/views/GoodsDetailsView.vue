<template>
  <LayoutPage no-paddings back-button="goods" :view-id="_viewId">
    <!-- Toolbar -->
    <template #toolbar>
      <UISpacer />

      <!-- Statuses -->
      <UIOptButtons
        v-if="good"
        :model-value="good.status_id"
        :options="modeOptions"
        :disabled="!accessGoodEdit"
        @update:model-value="actionSetStatus"
      />
      <UISpacer />

      <!-- Print -->
      <UIButton type="basic labeled" text="На сборку" icon="print" @click="print" />
      <!-- Edit -->
      <UIButton type="basic labeled" text="Изменить" icon="edit" :disabled="!accessGoodEdit" @click="edit" />
      <!--  -->
    </template>

    <!-- Tabs -->
    <YDetailsTabs :tabs="tabs" />

    <!-- Pages -->
    <div class="ui active tab" style="padding: 0 1.5em 1.5em 1.5em">
      <router-view :good="good" @update="fetchGood(good_id)"></router-view>
    </div>

    <!------->
  </LayoutPage>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";

import { useView } from "@/composables/view";
import { useDetailsTabs } from "@/composables/detailsTabs";
import { useNavigation } from "@/composables/navigation";
import { useUiStore } from "@/stores/uiStore";

import apiService from "@/services/api.service.js";

import Alerts from "@/utils/alerts";

import AccessRights from "@/enums/AccessRights";

import UIOptButtons from "@/components/UIOptButtons.vue";

const kTABS = [
  { name: "ОСНОВНОЕ", id: "general" },
  { name: "ФОТО", id: "photos" },
  { name: "ВИДЕО", id: "videos" },
  { name: "ЗАКАЗЫ", id: "orders", access: AccessRights.OrdersView },
];

/// SETUP

const _viewId = "GoodsDetailsView";
const { view, checkAuthRole } = useView(_viewId, {
  title: "Товар",
  subTitle: "Детализация",
});
const { tabs } = useDetailsTabs(kTABS);
const { navigateTo } = useNavigation();
const uiStore = useUiStore();

/// PROPS

const props = defineProps({
  goodId: {
    type: Number,
    default: null,
  },
});

/// DATA

// Models
const good = ref({});

// UI
const modeOptions = ref([
  { id: 0, name: "Новый", title: "", icon: null, disabled: true },
  { id: 1, name: "На складе", title: "", icon: null },
  { id: 2, name: "В продаже", title: "", icon: null },
  { id: 4, name: "Приостановлено", title: "", icon: null },
  { id: 3, name: "Продано", title: "", icon: null },
]);

/// COMPUTED

// Access Rights
const accessGoodEdit = computed(() => {
  return checkAuthRole(AccessRights.GoodsEdit);
});

/// WATCH

watchEffect(async () => {
  console.warn("[GoodsDetailsView]: watchEffect", props.goodId);
  if (props.goodId) {
    await fetchGood(props.goodId);
    // console.warn(tabs);
  }
});

/// FUNCTIONS

function setTitle() {
  view.title = good.value?.name + " " + "(" + props.goodId + ")";
}

// ---
function edit() {
  navigateTo.Goods.Edit({ goodId: props.goodId });
}

async function print() {
  const orders = await apiService.getOrdersForGood({ good_id: props.goodId, order_status_id: 7 });

  const good_name = good.value?.name + ", " + good.value?.brand;
  const good_id = props.goodId;
  let sum = 0;

  let htmlTable = `<table>
        <tr>
          <th>№</th>
          <th>ID заказа</th>
          <th>Клиент</th>
          <th>Количество</th>
        </tr>
      `;

  orders.forEach((item, index) => {
    htmlTable =
      htmlTable +
      "<tr><td>" +
      (index + 1) +
      "</td><td>" +
      item.order_id +
      "</td><td>" +
      item.customer_fio +
      "</td><td class='a_right'>" +
      item.good_quantity +
      "</td></tr>";

    sum = sum + parseFloat(item.good_quantity);
  });

  htmlTable =
    htmlTable +
    `<tfoot>
          <tr>
            <td colspan="3" class="a_right">Итого:</td>
            <td class="a_right">${sum.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>`;

  // Open the print window
  const WinPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0");

  WinPrint.document.write(`<!DOCTYPE html>
        <html>
          <head>
            <title>${good_name}</title>
            <style>
            table, th, td {
              font-family: monospace;
              border: 1px solid black;
              border-collapse: collapse;
            }
            th, td {
              padding: 0.3em 0.6em;
            }
            td.a_right {
              text-align: right;
            }
            tfoot {
              font-weight: bold;
            }
            </style>
          </head>
          <body>
            <h1>Задание на сборку</h1>
            <h2>${good_name} (ID: ${good_id})</h2><br/>

            ${htmlTable}
          </body>
        </html>`);

  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  // WinPrint.close();
}

// Actions
function actionSetStatus(status) {
  console.warn(status);

  if (status == 3 || status == 4) return;
  postSetStatus(props.goodId, status);
}

// Networking

async function fetchGood(good_id) {
  try {
    var result = await apiService.getGood(good_id);
    setTitle();
    console.warn(result);
  } catch (error) {
    Alerts.showNetworkError(error);
  }
  good.value = result;
  setTitle();
}

async function postSetStatus(good_id, status) {
  try {
    await apiService.setGoodStatus(good_id, status);
  } catch (error) {
    Alerts.showNetworkError(error);
  }

  fetchGood(props.goodId);
}
</script>
