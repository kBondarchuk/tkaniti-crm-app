<template>
  <span>
    <i class="icon" :class="[color, icon]"></i>&nbsp;
    {{ name }}
  </span>
</template>

<script>
export default {
  name: "TKOperationType",
  props: {
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      colors: {
        "Op.OrderPayment": {
          color: "green",
          icon: "check",
          name: "Оплата наличными",
        },
        "Op.OrderRefund": {
          color: "red",
          icon: "undo alternate",
          name: "Возврат наличными",
        },
        "Op.OrderPaymentAcquiring": {
          color: "green",
          icon: "credit card outline",
          name: "Онлайн-оплата",
        },
        "contract_leasing.ChargeDebt": {
          color: "yellow",
          icon: "dollar sign",
          name: "Начисление выкупа",
        },
        "contract_leasing.ChargeDown": {
          color: "yellow",
          icon: "dollar sign",
          name: "Начисление выкупа (первоначальный взнос)",
        },
        "contract_leasing.ChargeInterest": {
          color: "yellow",
          icon: "dollar sign",
          name: "Начисл. аренды",
        },
        "contract_leasing.ChargePenalty": {
          color: "red",
          icon: "exclamation",
          name: "Начисл. пени",
        },
        "contract_leasing.ChargeDebtForward": {
          color: "orange",
          icon: "flag",
          name: "Досрочное начисл. выкупа",
        },
        "contract_leasing.ChargeCarFine": {
          color: "pink",
          icon: "car",
          name: "Начисление суммы штрафа",
        },
        "contract_leasing.Deposit": {
          color: "blue",
          icon: "money outline",
          name: "Пополнение депозита договора",
        },
        "contract_leasing.DepositAcquiring": {
          color: "blue",
          icon: "credit card outline",
          name: "Депозит c карты",
        },
        "customer.DepositAccum": {
          color: "blue",
          icon: "credit card outline",
          name: "Пополнение накопительного счета наличкой",
        },
        "customer.DepositAccumAcquiring": {
          color: "blue",
          icon: "credit card outline",
          name: "Пополнение накопительного счета c карты",
        },
        "contract_leasing.PayDebt": {
          color: "green",
          icon: "check",
          name: "Учёт оплаты ОД",
        },
        "contract_leasing.PayInterest": {
          color: "green",
          icon: "check",
          name: "Учёт оплаты (проценты)",
        },
        "contract_leasing.PayPenalty": {
          color: "green",
          icon: "check",
          name: "Учёт оплаты (пеня)",
        },
        "contract_leasing.PayDown": {
          color: "green",
          icon: "check circle outline",
          name: "Учёт оплаты (первоначальный взнос)",
        },
        "contract_leasing.PayDebtForward": {
          color: "green",
          icon: "check double",
          name: "Учёт оплаты (досрочное погашение)",
        },
        "contract_leasing.PayCarFine": {
          color: "green",
          icon: "check",
          name: "Учёт оплаты (штраф)",
        },
        "contract_rent.PayCarFine": {
          color: "green",
          icon: "check",
          name: "Оплата штрафа ГИБДД",
        },
        "contract_rent.ChargeCarFine": {
          color: "pink",
          icon: "car",
          name: "Начисление суммы штрафа",
        },
        "contract_rent.Deposit": {
          color: "blue",
          icon: "money ",
          name: "Пополнение депозита договора аренды",
        },
        "contract_rent.DepositPledge": {
          color: "pink",
          icon: "money ",
          name: "Внесение залога по договору аренды",
        },
        "contract_rent.DepositAcquiring": {
          color: "blue",
          icon: "credit card outline",
          name: "Пополнение депозита договора аренды с карты",
        },
        "contract_rent.Refund": {
          color: "red",
          icon: "undo alternate",
          name: "Возврат",
        },
        "contract_rent.RefundPledge": {
          color: "red",
          icon: "undo alternate",
          name: "Возврат залога",
        },
        "contract_rent.ChargeDebt": {
          color: "yellow",
          icon: "dollar sign",
          name: "Начисление арендной платы ",
        },
        "contract_rent.PayDebt": {
          color: "green",
          icon: "check",
          name: "Учёт оплаты аренды",
        },
        "contract_rent.DepositFromPledge": {
          color: "blue",
          icon: "arrows alternate horizontal icon",
          name: "Пополнение депозита из залога",
        },
        "car.Expense": {
          color: "violet",
          icon: "minus square",
          name: "Затраты на автомобиль",
        },
        "branch.Expense": {
          color: "purple",
          icon: "minus square",
          name: "Затраты филиала",
        },
        "car.Income": {
          color: "green",
          icon: "plus square",
          name: "Выручка от продажи",
        },
        "contract_leasing.Refund": {
          color: "red",
          icon: "undo alternate",
          name: "Возврат",
        },
        "customer.AddBonuses": {
          color: "red",
          icon: "gift",
          name: "Начисление бонусов",
        },
        "contract_leasing.DepositFromCustomerAccum": {
          color: "blue",
          icon: "arrows alternate horizontal icon",
          name: "Перевод из копилки",
        },
        "contract_leasing.DepositFromCustomerBonus": {
          color: "blue",
          icon: "arrows alternate horizontal icon",
          name: "Перевод с Бонусного счета",
        },
        "investor.Expense": {
          color: "pink",
          icon: "arrows alternate horizontal icon",
          name: "Перевод в филиал",
        },
        "investor.Deposit": {
          color: "blue",
          icon: "money outline",
          name: "Пополнение инвест. счёта",
        },
        "investor.Withdraw": {
          color: "red",
          icon: "reply",
          name: "Выплата инвестору",
        },
        "investor.WithdrawInterest": {
          color: "black",
          icon: "reply",
          name: "Выплата процентов инвестору",
        },
        "investor.Reinvest": {
          color: "blue",
          icon: "undo alternate",
          name: "Реинвестиция",
        },
        "investor.ReinvestInterest": {
          color: "black",
          icon: "undo alternate",
          name: "Реинвест. инвест. процентов",
        },
        "investor.ChargeInterest": {
          color: "orange",
          icon: "percent",
          name: "Начисление инвест. процентов",
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
