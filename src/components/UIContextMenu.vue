<template>
  <div class="menu">
    <div v-for="item in items" :key="item.name" class="item" @click.stop="$parent.$emit(item.eventName, returnValue)">
      <i :class="item.icon" class="icon"></i>
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "UIContextMenu",
  props: {
    items: [Array],
    returnValue: [String, Number],
  },
};
</script>
