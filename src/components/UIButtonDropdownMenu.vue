<template>
  <div ref="button_menu" class="ui dropdown compact basic right floated button">
    <i v-if="icon && !loading" :class="icon + ' icon'"></i>
    <i v-if="loading" class="spinner loading icon"></i>
    <span class="text">{{ title }}</span>
    <i class="dropdown icon"></i>
    <div class="menu">
      <!-- <div class="header">
        <i class="tags icon"></i>
        Filter by tag
      </div> -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "UIButtonDropdownMenu",

  props: {
    title: String,
    icon: String,
    loading: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    $(this.$refs.button_menu).dropdown({
      action: "hide",
    });
  },
};
</script>
