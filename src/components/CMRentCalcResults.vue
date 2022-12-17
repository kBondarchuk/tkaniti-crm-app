<template>
  <table class="ui very basic compact two column table" style="font-size: 16px">
    <tbody>
      <tr>
        <td>Филиал</td>
        <td class="right aligned">
          <span v-if="branch">{{ branch }}</span>
          <span v-else class="text-color-grey">Филиал не определён</span>
        </td>
      </tr>
      <tr>
        <td>Инвестор</td>
        <td class="right aligned">
          <span v-if="investor">{{ investor }}</span>
          <span v-else class="text-color-grey">Инвестор не определён</span>
        </td>
      </tr>
      <!-- <tr>
        <td>Срок</td>
        <td class="right aligned">
          <span>{{ days }}</span> дней
        </td>
      </tr> -->
      <tr>
        <td>Сумма залога</td>
        <td class="right aligned">
          <span v-if="pledge" class="text-bold">{{ $filters.money(pledge) }} &#8381;</span>
          <span v-else class="text-color-grey">не определён</span>
        </td>
      </tr>
      <tr>
        <td>Ежедневный платёж</td>
        <td class="right aligned">
          <span v-if="daily_payment" class="text-bold">{{ $filters.money(daily_payment) }} &#8381;</span>
          <span v-else class="text-color-grey">не определён</span>
        </td>
      </tr>
      <tr>
        <td>
          Сумма предоплаты <span v-if="days">за {{ days }} дней</span>
        </td>
        <td class="right aligned">
          <span v-if="daily_payment && days" class="text-bold"
            >{{ $filters.money(parseFloat(daily_payment) * days) }} &#8381;</span
          >
          <span v-else class="text-color-grey">не определён</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "CMRentCalcResults",

  props: {
    branch: {
      type: String,
    },
    investor: {
      type: String,
    },
    pledge: {
      type: [Number, String],
    },
    days: {
      type: Number,
    },
    daily_payment: {
      type: [Number, String],
    },
  },
};
</script>

<style scoped>
.no-bottom-margin {
  margin-bottom: 0;
}

.ui.basic.table tbody tr:last-child > td {
  border-bottom: 1px solid #dededf;
}
</style>
