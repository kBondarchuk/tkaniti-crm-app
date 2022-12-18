<template>
  <table
    class="ui very compact small definition unstackable table"
    :class="{ loading: isLoading, 'two column': twoColumns }"
  >
    <tbody>
      <slot></slot>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "UIStaticTable",

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    twoColumns: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
