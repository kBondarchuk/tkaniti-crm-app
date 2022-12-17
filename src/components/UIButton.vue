<template>
  <button v-bind="$attrs" class="ui compact button" :class="[{ icon: icon }, color, type, direction]" :title="title">
    <i v-if="icon" class="icon" :class="icon"></i>
    <slot />
    <template v-if="text">{{ text }}</template>
  </button>
</template>

<script>
export default {
  name: "UIButton",
  props: {
    color: String,
    type: String,
    icon: { type: String, default: null },
    direction: String,
    title: String,
    text: String,
  },
};
</script>
