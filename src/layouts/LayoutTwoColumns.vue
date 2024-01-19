<template>
  <!-- Grid -->
  <div class="ui two column grid">
    <!-- fist column -->
    <div class="column">
      <slot></slot>
    </div>
    <!-- second column -->
    <div class="column">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayoutTwoColumns",
};
</script>
