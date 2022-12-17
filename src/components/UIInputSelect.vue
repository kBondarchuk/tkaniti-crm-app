<template>
  <div class="field" :class="{ disabled: disabled }">
    <label v-if="$slots.default || label" :for="name">
      <slot /><template v-if="label">{{ label }}</template>
    </label>
    <div class="ui action input">
      <input
        :id="name"
        :placeholder="placeholder"
        :name="name"
        :disabled="disabled"
        type="text"
        :value="value"
        readonly="readonly"
        autocomplete="off"
      />
      <div v-if="clearButton" class="ui icon basic button" style="padding: 8px" @click="$emit('buttonClearDidClick')">
        <i class="icon close"></i>
      </div>
      <div class="ui button" :class="{ loading: loading, disabled: loading }" @click="$emit('buttonDidClick')">
        Выбрать
      </div>
    </div>
    <slot name="bottom" />
  </div>
</template>

<script>
export default {
  name: "UIInputSelect",

  props: {
    value: [Number, String],
    label: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
    clearButton: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["buttonClearDidClick", "buttonDidClick"],
};
</script>
