<template>
  <div class="field" :class="{ disabled: disabled }">
    <label v-if="$slots.default || label" :for="name">
      <slot /><template v-if="label">{{ label }}</template>
    </label>
    <!-- @input="$emit('input', $event.target.value)" -->
    <!-- With button -->
    <div v-if="button" class="ui action input" :class="{ disabled: disabled, error: error }">
      <input
        :id="name"
        ref="input"
        :placeholder="placeholder"
        :name="name"
        :disabled="disabled"
        type="text"
        autocomplete="off"
      />
      <button class="ui button" @click.prevent="$emit('click')">{{ buttonText }}</button>
    </div>
    <!-- No button -->
    <div v-else class="ui right input" :class="{ disabled: disabled, error: error }">
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
    <div v-if="typeof error === 'string'" class="ui pointing label">{{ error }}</div>
  </div>
</template>

<script>
import Cleave from "cleave.js";

const money_defaults = {
  numeral: true,
  numeralThousandsGroupStyle: "thousand",
  numeralDecimalMark: ".",
  delimiter: " ",
  numeralPositiveOnly: true,
  numeralDecimalScale: 2,
};

export default {
  name: "UIInputMoney",

  props: {
    modelValue: [Number, String],
    label: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
    button: { type: Boolean, default: false },
    buttonText: String,
    error: {
      type: [Boolean, String],
      default: false,
    },
    decimalScale: { type: Number, default: 2 },
    positiveOnly: { type: Boolean, default: true },
  },

  emits: ["update:modelValue", "click"],

  data() {
    return {
      rawValue: this.modelValue,
      formattedValue: String,
    };
  },

  watch: {
    modelValue(newValue) {
      //   console.log(newValue);
      this.cleaveMoney.setRawValue(newValue);
    },
  },

  mounted() {
    money_defaults.numeralDecimalScale = this.decimalScale;
    money_defaults.numeralPositiveOnly = this.positiveOnly;

    let vm = this;
    let settings = $.extend(money_defaults, {
      onValueChanged: function (e) {
        // e.target = { value: '5100-1234', rawValue: '51001234' }
        vm.rawValue = e.target.rawValue;
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
