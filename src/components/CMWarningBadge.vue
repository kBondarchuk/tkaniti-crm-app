<template>
  <i class="attention red icon" style="vertical-align: unset" :style="style"></i>
</template>

<script>
export default {
  name: "CMWarningBadge",

  props: {
    value: Number,
  },

  computed: {
    style() {
      if (this.value > 0) {
        return "opacity: 1";
      }
      return "opacity: 0";
    },
    // title() {
    //   return this.value + " напоминаний";
    // },
  },
};
</script>
