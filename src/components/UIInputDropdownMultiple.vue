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
      ref="select"
      multiple=""
      class="ui dropdown"
      :name="name"
      :disabled="disabled"
      @change="handleChange"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.name }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "UIInputDropdownMultiple",

  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    disabled: Boolean,
    options: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["update:modelValue"],

  watch: {
    modelValue(newValue) {
      // console.log("Multi set:", newValue);
      $(this.$refs.select).dropdown("set selected", newValue);
    },
  },

  mounted() {
    $(this.$refs.select).dropdown();
    // {clearable: true}
  },

  methods: {
    handleChange() {
      let value = $(this.$refs.select).dropdown("get value");
      // console.log("Multi:", value);
      this.$emit("update:modelValue", value);
    },
  },
};
</script>
