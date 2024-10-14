<template>
  <div class="ui-list-row" :class="{ stack: stack }">
    <div class="inner-content">
      <div v-if="name" class="label">
        {{ name }}
      </div>
      <div class="value">
        <!-- Default Slot when not Loading -->
        <slot v-if="!isLoading"
          ><span v-if="value == null || value === ''" class="color-secondary">{{ placeholder }}</span></slot
        >
        <!-- Loading state: -->
        <template v-if="isLoading"><UITextLoader /></template>
        <!-- value is empty state -->
        <!-- <template
          v-else-if="(value == null || value === '') && ($slots.default == null || $slots.default == undefined)"
        >
          <span class="color-secondary">{{ placeholder }}</span>
        </template> -->
        <!-- value not empty and not loading -->
        <template v-else> {{ type ? $filters[type](value) : value }} </template>
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
    placeholder: {
      type: String,
      default: "—",
    },
  },

  computed: {
    valueClass() {
      switch (this.align) {
        case "right":
          return "right aligned";
        case "left":
          return "left aligned";
        case "center":
          return "center aligned";
        default:
          return null;
      }
    },
  },

  // mounted() {
  //   console.warn(this.name, slots.default);
  // },
};
</script>
