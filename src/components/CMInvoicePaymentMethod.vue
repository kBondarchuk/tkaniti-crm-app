<template>
  <!-- <UIBadge :text="status" :class="class2" /> -->
  <span>{{ status }}</span>
</template>

<script>
export default {
  name: "CMInvoicePaymentMethod",

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
        case "acq":
          return "Эквайринг";
        case "sbp":
          return "СБП";
        case "yoo":
          return "Ю-касса";
        default:
          return this.value;
      }
    },
    class2() {
      switch (this.value) {
        case "acq":
          return "";
        case "sbp":
          return "";
        case "yoo":
          return "";
        default:
          return "";
      }
    },
  },
};
</script>
