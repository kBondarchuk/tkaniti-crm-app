<template>
  <table class="ui very compact small definition unstackable table" :class="{ loading: isLoading }">
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
  },
};
</script>
