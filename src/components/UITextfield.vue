<template>
  <div class="field" :class="[{ disabled: disabled }, gridWidth]">
    <!--  -->
    <label v-if="$slots.default || label" :for="name">
      <slot />
      <template v-if="label">{{ label }}</template>
    </label>
    <!--  -->
    <div class="ui right input">
      <input
        :id="name"
        :value="modelValue"
        :placeholder="placeholder"
        :name="name"
        :disabled="disabled"
        :readonly="readonly"
        class="ui input"
        type="text"
        autocomplete="off"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "UITextfield",

  props: {
    modelValue: {
      type: [String, Number],
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    disabled: Boolean,
    readonly: Boolean,
    gridWidth: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue"],
};
</script>
