<template>
  <UIBadge :text="status.name" :class="status.class" />
</template>

<script>
/**
 *  Статусы платежа
 *
 *  pending — платеж создан и ожидает действий от пользователя
 *  waiting_for_capture — платеж оплачен, деньги авторизованы и ожидают списания
 *  succeeded — платеж успешно завершен
 *  canceled — платеж отменен
 */
export default {
  name: "CMPaymentYooStatus",

  components: {
    // UIBadge,
  },

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  computed: {
    status() {
      switch (this.value) {
        case "pending":
          return {
            name: "Ожидает оплаты",
            class: "",
          };
        case "succeeded":
          return {
            name: "Успешна",
            class: "background-color-green text-color-white",
          };
        case "waiting_for_capture":
          return {
            name: "Ожидает подтверждения",
            class: "background-color-teal text-color-white",
          };
        case "canceled":
          return {
            name: "Отменена",
            class: "background-color-red text-color-white",
          };
        case null:
          return {
            name: "null",
            class: "background-color-red text-color-white",
          };
        default:
          return { name: this.value };
      }
    },
  },
};
</script>
