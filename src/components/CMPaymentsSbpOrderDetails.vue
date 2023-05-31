<template>
  <table class="ui very compact small celled table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="2">Платёжная операция СБП</th>
      </tr>
    </thead>
    <tbody>
      <!-- <tr>
        <td>Юр. лицо</td>
        <td>{{ transaction.acq_entity_description }}</td>
      </tr> -->

      <tr>
        <td>Номер операции</td>
        <td>{{ order.number }}</td>
      </tr>
      <tr>
        <td>Статус</td>
        <td>{{ order.status }}</td>
      </tr>
      <tr>
        <td>Сумма</td>
        <td>{{ $filters.money(order.amount) }}</td>
      </tr>
      <tr>
        <td>Время операции</td>
        <td>{{ $filters.date(order.created) }}</td>
      </tr>
      <tr>
        <td>ID настроек</td>
        <td>{{ order.settings_id }}</td>
      </tr>
      <tr>
        <td>URL страницы оплаты</td>
        <td><a v-if="order.payment_url" :href="order.payment_url" target="_blank">Открыть страницу оплаты</a></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
// import CMOfdStatus from "@/components/CMOfdStatus.vue";

export default {
  name: "CMPaymentsSbpOrderDetails",

  components: {
    // CMOfdStatus,
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
};
</script>
