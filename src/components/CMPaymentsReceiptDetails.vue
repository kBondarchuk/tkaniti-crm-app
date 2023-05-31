<template>
  <table class="ui very compact small celled table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="2">Кассовый чек</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Статус чека</td>
        <td><CMOfdStatus :value="receipt.status_code" /> {{ receipt["status_message"] }}</td>
      </tr>
      <template v-if="receipt.receipt_id">
        <tr>
          <td>ID чека</td>
          <td>{{ receipt.receipt_id }}</td>
        </tr>
        <tr>
          <td>Время создания чека</td>
          <td>{{ $filters.date(receipt.receipt_datetime) }}</td>
        </tr>
        <tr>
          <td>Последнее изменение чека</td>
          <td>{{ $filters.date(receipt.modified_datetime) }}</td>
        </tr>
        <tr>
          <td>Статус код</td>
          <td>{{ receipt.status_code }}</td>
        </tr>
        <tr>
          <td>Номер девайса</td>
          <td>{{ receipt.device_id }}</td>
        </tr>
        <tr>
          <td>ID настроек</td>
          <td>{{ receipt.settings_id }}</td>
        </tr>
        <tr>
          <td>URL чека</td>
          <td><a v-if="receipt.ofd_receipt_url" :href="receipt.ofd_receipt_url" target="_blank">Смотреть чек</a></td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
// const ofdStatuses = {
//   0: "Запрос на чек получен в Ferma",
//   1: "Чек сформирован на кассе",
//   2: "Чек передан в ОФД",
//   3: "Ошибка: Чек не передан в ОФД, нужно отправить повторно",
//   99: "Чек запрошен, но ответ пока не получен",
//   null: "Чек не создавался",
// };

import CMOfdStatus from "@/components/CMOfdStatus.vue";

export default {
  name: "CMPaymentsReceiptDetails",

  components: {
    CMOfdStatus,
  },

  props: {
    receipt: {
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
      // ofdStatuses: ofdStatuses,
    };
  },
};
</script>
