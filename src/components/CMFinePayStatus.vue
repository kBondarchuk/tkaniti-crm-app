<template>
  <UIBadge
    :text="status"
    :class="{
      'background-color-red text-color-white': payed === 0,
      'background-color-green text-color-white': payed === 1,
      'background-color-teal text-color-white': payed === 2,
      'text-color-black': payed === 3,
    }"
  />
</template>

<script>
export default {
  name: "CMFinePayStatus",

  components: {},

  props: {
    payed: {
      type: Number,
      default: null,
    },
  },

  computed: {
    status() {
      if (this.payed == 1) {
        return "Оплачен";
      } else if (this.payed == 2) {
        return "В процессе";
      } else if (this.payed == 0) {
        return "Не оплачен";
      } else if (this.payed == 3) {
        return "Оплачен";
      } else {
        return "Не определён";
      }
    },
  },
};
</script>
