<template>
  <div class="no-content"><slot></slot></div>
</template>

<script>
export default { name: "UIPanelSplash" };
</script>

<style scoped>
.no-content {
  padding-top: 3rem;
  padding-bottom: 3rem;
  text-align: center;
  font-size: 1.5rem;
  color: rgba(0, 0, 0, 0.25);
}
</style>
