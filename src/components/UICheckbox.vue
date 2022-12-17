<template>
  <div class="ui checkbox">
    <input :id="id" type="checkbox" name="" :checked="modelValue" @change="toggle($event)" />
    <label :for="id" style="cursor: pointer">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: "UICheckbox",

  props: {
    modelValue: {
      type: [Boolean, Number],
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      required: true,
    },
    // loading: {
    //   type: Boolean,
    //   default: false,
    // },
  },

  emits: ["update:modelValue"],

  data() {
    return {};
  },

  // watch: {
  //   checked(newValue, oldValue) {
  //     console.log("checked: ", newValue, oldValue);
  //   },
  // },

  methods: {
    toggle(event) {
      // console.log("Toggle: ", event.target.checked);
      this.$emit("update:modelValue", event.target.checked);
    },
  },
};
</script>
