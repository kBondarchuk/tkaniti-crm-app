<template>
  <UIBadge :text="status" :class="class2" />
</template>

<script>
export default {
  name: "CMAcquiringTypeStatus",

  components: {},

  props: {
    type: {
      type: String,
      default: null,
    },
  },

  computed: {
    status() {
      switch (this.type) {
        case "lease":
          return "Выкуп";
        case "rent":
          return "Аренда";
        case "accum":
          return "Копилка";
        default:
          return this.type;
      }
    },
    class2() {
      switch (this.type) {
        case "lease":
          return "background-color-blue text-color-white";
        case "rent":
          return "background-color-green text-color-white";
        case "accum":
          return "background-color-teal text-color-white";
        default:
          return "";
      }
    },
  },
};
</script>
