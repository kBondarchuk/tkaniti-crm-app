<template>
  <div class="flex-container-item" :style="{ flexGrow: grow, width: width + 'rem' }">
    <!-- Container-->
    <slot></slot>
    <!-- /Container -->
  </div>
</template>

<script>
export default {
  name: "LayoutContainerItem",
  props: {
    grow: {
      type: [Number, String],
      default: 0,
    },
    width: {
      type: [Number, String],
      default: "auto",
    },
  },
};
</script>

<style>
.flex-container-item {
  /* background-color: DodgerBlue; */
  /* color: white; */
  padding: 1rem;
  /* text-align: center; */
  border-right: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
}
</style>
