<template>
  <!-- Grid -->
  <div class="ui column grid">
    <!-- fist column -->
    <div class="six wide column">
      <slot></slot>
    </div>
    <!-- second column -->
    <div class="ten wide column">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayoutThereColumns",
};
</script>
