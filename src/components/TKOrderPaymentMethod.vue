<template>
  <div :class="status?.class"><i :class="status?.icon + ' icon'" :title="status?.text"></i></div>
</template>

<script>
export default {
  name: "TKOrderPaymentMethod",

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
        { id: "0", icon: "", text: "", class: "text-color-red" },
        { id: "1", icon: "credit card outline", text: "Карта", class: "text-color-blue" },
        { id: "2", icon: "money ", text: "Перевод", class: "text-color-grey" },
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
