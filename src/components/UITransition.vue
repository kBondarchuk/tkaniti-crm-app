<template>
  <transition v-bind="$attrs" name="fade">
    <slot></slot>
  </transition>
</template>
<script>
export default {};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
