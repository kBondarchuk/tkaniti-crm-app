<template>
  <table class="ui very compact small celled table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="2">Платёжная операция эквайринга</th>
      </tr>
    </thead>
    <tbody>
      <!-- <tr>
        <td>Юр. лицо</td>
        <td>{{ transaction.acq_entity_description }}</td>
      </tr> -->

      <tr>
        <td>Описание платежа</td>
        <td>{{ order.orderDescription }}</td>
      </tr>
      <tr>
        <td>Номер операции</td>
        <td>{{ order.orderId }}</td>
      </tr>

      <tr>
        <td>Статус</td>
        <!-- <td>{{ order.orderStatus }}</td> -->
        <td>{{ orderStatuses[order.orderStatus] }}</td>
      </tr>
      <tr>
        <td>actionCode</td>
        <td>
          {{ actionCodes[order.actionCode] ?? order.actionCode }}
        </td>
      </tr>

      <tr>
        <td>Сумма</td>
        <td>{{ $filters.money(order.amount) }}</td>
      </tr>
      <tr>
        <td>depositedAmount</td>
        <td>{{ $filters.money(order.depositedAmount) }}</td>
      </tr>
      <tr>
        <td>approvedAmount</td>
        <td>{{ $filters.money(order.approvedAmount) }}</td>
      </tr>
      <tr>
        <td>refundedAmount</td>
        <td>{{ $filters.money(order.refundedAmount) }}</td>
      </tr>

      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>Время операции</td>
        <td>{{ $filters.date(order._order_datetime) }}</td>
      </tr>
      <tr>
        <td>Время авторизации</td>
        <td>{{ $filters.date(order._order_auth_datetime) }}</td>
      </tr>

      <tr>
        <td colspan="2"></td>
      </tr>

      <tr>
        <td>Банк</td>
        <td>{{ order.bank_name }}</td>
      </tr>
      <tr>
        <td>IP</td>
        <td>{{ order.ip }}</td>
      </tr>
      <tr>
        <td>ID терминала</td>
        <td>{{ order.terminal_id }}</td>
      </tr>
      <tr>
        <td>ID настроек</td>
        <td>{{ order.settings_id }}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>URL платежной страницы</td>
        <td>
          <a v-if="order.form_url" :href="order.form_url" target="_blank">Открыть страницу оплаты</a>
          &nbsp;
          <UIClipButton v-if="order.form_url" :value="order.form_url" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const orderStatuses = {
  0: "Заказ зарегистрирован, но не оплачен",
  1: "Предавторизованная сумма удержана (для двухстадийных платежей)",
  2: "Проведена полная авторизация суммы заказа",
  3: "Авторизация отменена",
  4: "По транзакции была проведена операция возврата",
  5: "Инициирована авторизация через сервер контроля доступа банка-эмитента",
  6: "Авторизация отклонена",
};

const actionCodes = {
  "-2025": "Отклонено. Статус RReq-а не Y",
  "-2023": "Отклонено. U в ARes-e",
  "-2018":
    "Directory server Visa или MasterCard либо недоступен, либо в ответ на запрос вовлечённости карты (VeReq) пришла ошибка связи. Это ошибка взаимодействия платёжного шлюза и серверов МПС по причине технических неполадок на стороне последних.",
  "-2015": "VERes от DS содержит iReq, вследствие чего платёж был отклонён.",
  "-2007": "Истёк срок ожидания ввода данных",
  "-2006": "Операция невозможна. Аутентификация держателя карты завершена неуспешно.",
  0: "Платёж успешно прошёл",
  5: "Отказ сети проводить транзакцию.",
  82: "Неверный CVC",
  101: "Истёк срок действия карты",
  106: "Превышено допустимое число попыток ввода ПИН. Вероятно карта временно заблокирована",
  116: "Сумма транзакции превышает доступный остаток средств на выбранном счёте.",
  121: "Предпринята попытка выполнить транзакцию на сумму, превышающую дневной лимит, заданный банком-эмитентом",
  123: "Превышен лимит на число транзакций: клиент выполнил максимально разрешённое число транзакций в течение лимитного цикла и пытается провести ещё одну.",
  999: "Отсутствует начало авторизации транзакции. Отклонено по фроду или ошибка 3dsec. После получения этого кода ответа дальнейшие попытки проведения платежа отклоняются.",
  2003: "SSL (Не 3d-Secure/SecureCode) транзакции запрещены Магазину",
  71015: "Введены неправильные параметры карты",
};

import UIClipButton from "@/components/UIClipButton.vue";

export default {
  name: "CMPaymentsAcqOrderDetails",

  components: {
    // CMOfdStatus,
    UIClipButton,
  },

  props: {
    order: {
      type: Object,
      default: () => {},
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      orderStatuses: orderStatuses,
      actionCodes: actionCodes,
    };
  },
};
</script>
