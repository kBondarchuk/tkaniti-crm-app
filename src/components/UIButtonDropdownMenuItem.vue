<template>
  <div class="item" :class="{ loading, disabled }" v-bind="$attrs">
    <i v-if="icon" :class="icon + ' icon'"></i>{{ title }}
  </div>
</template>

<script>
export default {
  name: "UIButtonDropdownMenuItem",

  props: {
    title: String,
    icon: String,
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
