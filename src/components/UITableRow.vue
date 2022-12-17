<template>
  <tr>
    <td>
      {{ name }}
    </td>
    <td :class="valueClass">
      <slot></slot>
      {{ type ? $filters[type](value) : value }}
    </td>
  </tr>
</template>

<script>
export default {
  name: "UITableRow",

  props: {
    name: {
      type: String,
      default: null,
    },
    value: {
      type: [String, Number],
      default: null,
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
