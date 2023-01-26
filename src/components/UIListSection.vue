<template>
  <div v-if="header" class="ui-header">
    {{ header }}
  </div>
  <div class="ui-list-section">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "UIListSection",

  props: {
    header: {
      type: String,
      default: null,
    },
  },
};
</script>
