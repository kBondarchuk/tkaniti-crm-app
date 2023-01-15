<template>
  <UIBadge
    :text="status"
    :class="{
      'background-color-green text-color-white': charged === 1,
      'background-color-red text-color-white': charged === -1,
      'background-color-blue text-color-white': charged === 0,
    }"
  />
</template>

<script>
export default {
  name: "CMFineChargeStatus",

  components: {},

  props: {
    charged: {
      type: Number,
      default: null,
    },
  },

  computed: {
    status() {
      if (this.charged == 1) {
        return "Начислен";
      } else if (this.charged == -1) {
        return "Невозможно";
      } else if (this.charged == 0) {
        return "Возможно";
      } else {
        return "Не определён";
      }
    },
  },
};
</script>
