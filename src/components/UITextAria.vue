<template>
  <div class="field" :class="{ disabled: disabled }">
    <!--  -->
    <label v-if="$slots.default || label" :for="name">
      <slot /><template v-if="label">{{ label }}</template>
    </label>
    <!--  -->
    <div class="ui right input">
      <textarea
        :id="name"
        :value="modelValue"
        :placeholder="placeholder"
        :name="name"
        :disabled="disabled"
        class="ui input"
        type="text"
        autocomplete="off"
        :rows="rows"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "UITextAria",

  props: {
    modelValue: [String, Number],
    placeholder: String,
    label: String,
    name: String,
    disabled: Boolean,
    rows: [Number, String],
  },

  emits: ["update:modelValue"],
};
</script>

<style scoped>
.ui.input textarea {
  padding: 0.4em;
}
</style>
