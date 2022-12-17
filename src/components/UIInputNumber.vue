<template>
  <div class="field" :class="{ disabled: disabled }">
    <label v-if="$slots.default || label" :for="name">
      <slot /><template v-if="label">{{ label }}</template>
    </label>
    <div class="ui right input">
      <!-- @input="$emit('input', $event.target.value)" -->
      <input
        :id="name"
        ref="input"
        :placeholder="placeholder"
        :name="name"
        :disabled="disabled"
        class="ui input"
        type="text"
        autocomplete="off"
      />
    </div>
    <div v-if="error" class="ui pointing label">{{ error }}</div>
  </div>
</template>

<script>
import Cleave from "cleave.js";

const number_defaults = {
  numeral: true,
  numeralThousandsGroupStyle: "thousand",
  numeralDecimalMark: ".",
  delimiter: " ",
  numeralPositiveOnly: true,
  numeralDecimalScale: 0,
};

export default {
  name: "UIInputNumber",

  props: {
    modelValue: Number,
    label: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
    error: String,
  },

  emits: ["update:modelValue"],

  data() {
    return {
      rawValue: this.modelValue,
      formattedValue: String,
    };
  },

  watch: {
    modelValue(newValue) {
      // console.log(newValue);
      this.cleaveMoney.setRawValue(newValue);
    },
  },

  mounted() {
    let vm = this;
    let settings = $.extend(number_defaults, {
      onValueChanged: function (e) {
        // e.target = { value: '5100-1234', rawValue: '51001234' }
        const parsedInt = parseInt(e.target.rawValue);
        vm.rawValue = isNaN(parsedInt) ? null : parsedInt;
        // console.warn(isNaN(parsedInt), parsedInt, vm.rawValue);
        vm.formattedValue = e.target.value;
        vm.$emit("update:modelValue", vm.rawValue);
        // console.log(e.target);
      },
    });
    // console.log(settings);
    this.cleaveMoney = new Cleave(this.$refs.input, settings);
    this.cleaveMoney.setRawValue(this.modelValue);
    // console.log(this.cleaveMoney);
  },

  beforeUnmount() {
    // Destroy Cleave
    this.cleaveMoney.destroy();
  },
};
</script>
