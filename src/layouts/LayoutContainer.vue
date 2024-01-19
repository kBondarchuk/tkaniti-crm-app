<template>
  <div class="flex-container">
    <!-- Container-->
    <slot></slot>
    <!-- /Container -->
  </div>
</template>

<script>
export default {
  name: "LayoutContainer",
};
</script>

<style>
.flex-container {
  display: flex;
  align-items: stretch;
  /* background-color: #f1f1f1; */
}
</style>
