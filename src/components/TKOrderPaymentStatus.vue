<template>
  <UIBadge :text="status?.name" :class="status?.class" />
</template>

<script>
export default {
  name: "TKOrderPaymentStatus",

  components: {},

  props: {
    value: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      statuses: [
        { id: "0", icon: "", name: "Не оплачен", class: "background-color-red text-color-white" },
        { id: "1", icon: "", name: "Оплачен", class: "background-color-green text-color-white" },
      ],
    };
  },

  computed: {
    status() {
      const sid = 1;
      return this.statuses.find((item) => item.id == this.value);
    },
  },
};
</script>
