<template>
  <td style="white-space: nowrap; text-align: right">
    <span
      :class="colored ? { positive: value > 0, negative: value < 0 } : {}"
      style="padding: 4px 6px; border-radius: 4px; margin: -4px -6px"
      v-html="$filters.money2(value, true) + (rub ? ' ₽' : '')"
    />
  </td>
  <!-- style="white-space: nowrap" -->
</template>

<script>
export default {
  name: "UIMoneyCell",

  props: {
    value: {
      type: String,
      default: "",
    },
    rub: {
      type: Boolean,
      default: false,
    },
    colored: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="css" scoped>
td > span.negative {
  color: #9f3a38;
  background: #fff6f6;
}
td > span.positive {
  color: #2c662d;
  background: #fcfff5;
}

.ui.selectable.table tr:hover td > span.negative,
.ui.table tr td.selectable:hover > span.negative {
  background: #ffe7e7;
  color: #943634;
}
.ui.selectable.table tr:hover td > span.positive,
.ui.table tr td.selectable:hover > span.positive {
  background: #f7ffe6;
  color: #275b28;
}
</style>
