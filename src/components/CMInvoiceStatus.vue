<template>
  <UIBadge :text="status" :class="class2" />
</template>

<script>
export default {
  name: "CMInvoiceStatus",

  components: {
    // UIBadge,
  },

  props: {
    value: {
      type: Number,
      default: null,
    },
  },

  computed: {
    status() {
      switch (this.value) {
        case -5:
          return "Ошибка";
        case -1:
          return "Отказ";
        case 0:
          return "Создан";
        case 1:
          return "Оплачен";
        case 2:
          return "Отменён";
        case 3:
          return "Запрошен";
        case null:
          return "Неопределен";
        default:
          return this.value;
      }
    },
    class2() {
      switch (this.value) {
        case -5:
          return "background-color-gray text-color-red";
        case -1:
          return "background-color-red text-color-white";
        case 0:
          return "";
        case 1:
          return "background-color-green text-color-white";
        case 2:
          return "background-color-orange text-color-white";
        case 3:
          return "background-color-teal text-color-white";
        default:
          return "";
      }
    },
  },
};
</script>
