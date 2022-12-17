<template>
  <span>
    <i class="icon" :class="[color, icon]"></i>
    <span class="nobr">{{ name }}</span>
  </span>
</template>

<script>
export default {
  name: "CMTransactionType",
  props: {
    type: String,
  },
  data() {
    return {
      colors: {
        charge: {
          color: "yellow",
          icon: "dollar sign",
          name: "Начисление выкупа",
        },
        charge_down: {
          color: "yellow",
          icon: "dollar sign",
          name: "Начисление выкупа (первоначальный взнос)",
        },
        charge_interest: {
          color: "yellow",
          icon: "dollar sign",
          name: "Начисл. аренды",
        },
        charge_penalty: {
          color: "red",
          icon: "exclamation",
          name: "Начисл. пени",
        },
        charge_fwd: {
          color: "orange",
          icon: "flag",
          name: "Досрочное начисл. выкупа",
        },
        deposit: {
          color: "blue",
          icon: "money outline",
          name: "Депозит",
        },
        deposit_acq: {
          color: "blue",
          icon: "credit card outline",
          name: "Депозит c карты",
        },
        payment: { color: "green", icon: "check", name: "Учёт оплаты" },
        payment_interest: {
          color: "green",
          icon: "check",
          name: "Учёт оплаты (проценты)",
        },
        payment_penalty: {
          color: "green",
          icon: "check",
          name: "Учёт оплаты (пеня)",
        },
        payment_down: {
          color: "green",
          icon: "check circle outline",
          name: "Учёт оплаты (первоначальный взнос)",
        },
        payment_fwd: {
          color: "green",
          icon: "check double",
          name: "Учёт оплаты (досрочное погашение)",
        },
        expense: { color: "violet", icon: "minus square", name: "Затраты" },
        reinvestment: {
          color: "blue",
          icon: "undo alternate",
          name: "Реинвестиция",
        },
        correction: {
          color: "red",
          icon: "undo alternate",
          name: "Коррекция",
        },
        correction_payment: {
          color: "red",
          icon: "undo alternate",
          name: "Коррекция оплаты",
        },
        correction_charge: {
          color: "red",
          icon: "undo alternate",
          name: "Коррекция начислений",
        },
        refund: {
          color: "red",
          icon: "undo alternate",
          name: "Возврат",
        },
        bonus: {
          color: "red",
          icon: "gift",
          name: "Бонусы",
        },
        transfer: {
          color: "blue",
          icon: "arrows alternate horizontal icon",
          name: "Перевод",
        },
        // Rent types
        "charge.rent": {
          color: "yellow",
          icon: "dollar sign",
          name: "Начисление арендной платы",
        },
        "deposit.rent": {
          color: "blue",
          icon: "money outline",
          name: "Пополнение депозита",
        },
        "payment.rent": { color: "green", icon: "check", name: "Учёт оплаты аренды" },
        "pledge.rent": {
          color: "yellow",
          icon: "money",
          name: "Внесение залога",
        },
        "payment.sale": {
          color: "green",
          icon: "plus square",
          name: "Оплата продажи",
        },
      },
    };
  },
  computed: {
    name() {
      return this.colors[this.type] ? this.colors[this.type].name : this.type;
    },
    color() {
      return this.colors[this.type] ? this.colors[this.type].color : "grey";
    },
    icon() {
      return this.colors[this.type] ? this.colors[this.type].icon : "question";
    },
  },
};
</script>
