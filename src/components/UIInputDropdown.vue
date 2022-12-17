<template>
  <div class="field" :class="{ disabled: disabled }">
    <!--  -->
    <label v-if="$slots.default || label" :for="name">
      <slot />
      <template v-if="label">{{ label }}</template>
    </label>
    <!--  -->
    <select
      :id="name"
      class="ui fluid normal dropdown"
      :name="name"
      :disabled="disabled"
      :value="modelValue"
      @change="handleChange"
      @input="handleInput"
    >
      <!--  -->
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option[valueSelector] === null ? '' : option[valueSelector]"
      >
        {{ option.name }}
      </option>
      <!--  -->
    </select>
    <!--  -->
  </div>
</template>

<script>
export default {
  name: "UIInputDropdown",

  props: {
    modelValue: [Number],
    label: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
    options: Array,
    valueSelector: {
      type: String,
      default: "value",
    },
  },

  emits: ["update:modelValue"],

  methods: {
    // handleChange(event) {},
    handleInput(event) {
      // console.warn(event.target.value);
      let value = parseInt(event.target.value);
      if (isNaN(value)) {
        value = null;
      }
      this.$emit("update:modelValue", value);
    },
  },
};
</script>
