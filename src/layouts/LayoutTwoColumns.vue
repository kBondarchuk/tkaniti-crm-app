<template>
  <!-- Grid -->
  <div class="container">
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

<script setup>
// name: "LayoutTwoColumns",
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 1em;
}

.column {
  flex: 1;
}

@media only screen and (max-width: 800px) {
  .container {
    flex-direction: column;
  }
}
</style>
