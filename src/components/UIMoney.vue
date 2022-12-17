<template>
  <span class="nobr" v-html="$filters.money2(value, true) + (rub ? ' ₽' : '')"></span>
</template>

<script>
export default {
  name: "UIMoney",

  props: {
    value: {
      type: String,
      default: "",
    },
    rub: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    name() {},
  },
};
</script>
