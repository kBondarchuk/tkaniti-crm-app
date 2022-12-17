<template>
  <table class="ui very compact small celled table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="2">Детализация платежной операции ({{ transaction.id }})</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Тип оплаты</td>
        <td><CMAcquiringTypeStatus :type="transaction.contract_type" /></td>
      </tr>
      <tr>
        <td>ID Договора / Клиента</td>
        <td>
          {{ transaction.contract_id }}
          <a v-if="transaction.contract_type == 'lease'" @click.stop="go('lease')"> Перейти к договору </a>
          <a v-if="transaction.contract_type == 'rent'" @click.stop="go('rent')"> Перейти к договору </a>
          <a v-if="transaction.contract_type == 'accum'" @click.stop="go('accum')"> Перейти к клиенту </a>
        </td>
      </tr>
      <tr>
        <td>Номер операции</td>
        <td>{{ transaction.orderNumber }}</td>
      </tr>
      <tr>
        <td>ID операции</td>
        <td>{{ transaction.orderId }}</td>
      </tr>
      <tr>
        <td>Время операции</td>
        <td>{{ $filters.date(transaction.date_converted) }}</td>
      </tr>
      <tr>
        <td>Запрашиваемая сумма</td>
        <td>{{ $filters.money(transaction.amount) }}</td>
      </tr>
      <tr>
        <td>Утвержденная сумма</td>
        <td>{{ $filters.money(transaction.approvedAmount) }}</td>
      </tr>
      <tr>
        <td>Списанная сумма</td>
        <td class="text-bold">{{ $filters.money(transaction.depositedAmount) }}</td>
      </tr>
      <tr>
        <td>Сумма возврата</td>
        <td>{{ $filters.money(transaction.refundedAmount) }}</td>
      </tr>
      <tr>
        <td>Платёж зачислен на договор</td>
        <td>{{ transaction.cleared ? "Да" : "Нет" }}</td>
      </tr>

      <tr>
        <td>Описание</td>
        <td>{{ transaction.orderDescription }}</td>
      </tr>
      <tr>
        <td>paymentState</td>
        <td>{{ transaction.paymentState }}</td>
      </tr>
      <tr>
        <td>orderStatus</td>
        <td>{{ orderStatuses[transaction.orderStatus] }}</td>
      </tr>
      <tr>
        <td>actionCode</td>
        <td>
          {{ actionCodes[transaction.actionCode] ? actionCodes[transaction.actionCode] : transaction.actionCode }}
        </td>
      </tr>
      <tr>
        <td>paymentSystem</td>
        <td>{{ transaction.paymentSystem }}</td>
      </tr>
      <tr>
        <td>IP</td>
        <td>{{ transaction.ip }}</td>
      </tr>
      <tr>
        <td>Дата создания</td>
        <td>{{ $filters.date(transaction.created_ts) }}</td>
      </tr>
      <tr>
        <td>Обновлено</td>
        <td>{{ $filters.date(transaction.timestamp) }}</td>
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

import CMAcquiringTypeStatus from "@/components/CMAcquiringTypeStatus.vue";

export default {
  name: "CMAcquiringTransactionsDetails",

  components: {
    CMAcquiringTypeStatus,
  },

  props: {
    transaction: {
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

  methods: {
    go(type) {
      switch (type) {
        case "lease":
          this.$router.push({
            name: "contract_details",
            params: { id: this.transaction.contract_id },
          });
          break;

        case "rent":
          this.$router.push({
            name: "contract_rent_details",
            params: { id: this.transaction.contract_id },
          });
          break;

        case "accum":
          this.$router.push({
            name: "customers_details",
            params: { id: this.transaction.contract_id },
          });
          break;

        default:
          return;
      }
    },
  },
};
</script>
