<template>
  <div class="ui-list-row" :class="{ stack: stack }">
    <div class="inner-content">
      <td v-if="name" class="label">
        {{ name }}
      </td>
      <div class="value">
        <slot v-if="!isLoading"></slot>
        <template v-if="isLoading"><UITextLoader /></template>
        <template v-else-if="(value == null || value === '') && $slots.default == null">
          <span class="color-secondary">—</span>
        </template>
        <template v-else>
          {{ type ? $filters[type](value) : value }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UIListItem",

  inject: ["isLoading"],

  props: {
    name: {
      type: String,
      default: null,
    },
    value: {
      type: [String, Number],
      default: null,
    },
    stack: {
      type: Boolean,
      default: false, // stack | inline
    },
    align: {
      type: String,
      default: null,
      validator(value) {
        // The value must match one of these strings
        return ["left", "center", "right"].includes(value);
      },
    },
    type: {
      type: String,
      default: null,
    },
  },

  computed: {
    valueClass() {
      switch (this.align) {
        case "right":
          return "right aligned";
          break;
        case "left":
          return "left aligned";
          break;
        case "center":
          return "center aligned";
          break;
        default:
          return null;
          break;
      }
    },
  },
};
</script>
