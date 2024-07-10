<template>
  <UIBadge :text="status" :class="class2" />
</template>

<script>
export default {
  name: "CMOfdStatus",

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
        case 0:
          return "Новый";
        case 1:
          return "Сформирован";
        case 2:
          return "ОФД OK";
        case 3:
          return "Ошибка";
        case 99:
          return "Запрошен";
        case null:
          return "Нет чека";
        default:
          return this.value;
      }
    },
    class2() {
      switch (this.value) {
        case 0:
          return "background-color-blue text-color-white";
        case 1:
          return "background-color-teal text-color-white";
        case 2:
          return "background-color-green text-color-white";
        case 3:
          return "background-color-red text-color-white";
        case 99:
          return "background-color-orange text-color-white";
        default:
          return "";
      }
    },
  },
};
</script>
