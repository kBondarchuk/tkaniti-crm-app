<template>
  <div class="field" :class="{ disabled: disabled }">
    <!--  -->
    <label v-if="$slots.default || label" :for="name">
      <slot /><template v-if="label">{{ label }}</template>
    </label>
    <!--  -->
    <div class="ui right input">
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
    <!--  -->
  </div>
</template>

<script>
import Cleave from "cleave.js";

const phone_defaults = {
  blocks: [2, 3, 3, 2, 2],
  delimiters: [" (", ") ", "-", "-"],
  delimiterLazyShow: true,
  numericOnly: true,
  prefix: "+",
  noImmediatePrefix: true,
};

export default {
  name: "UIInputPhone",

  props: {
    modelValue: String,
    label: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
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
      // console.warn(newValue);
      // if (!newValue) return;
      this.cleaveMoney.setRawValue(newValue);
    },
  },

  mounted: function () {
    let vm = this;
    let settings = $.extend(phone_defaults, {
      onValueChanged: function (e) {
        // e.target = { value: '5100-1234', rawValue: '51001234' }
        // console.warn(e.target.rawValue);

        vm.rawValue = e.target.rawValue;
        vm.formattedValue = e.target.value;

        if (vm.rawValue !== phone_defaults.prefix) {
          // console.debug("*** if", e.target);

          vm.$emit("update:modelValue", vm.rawValue);
        } else {
          // console.debug("*** else", e.target);
          vm.$emit("update:modelValue", null);
        }
      },
    });
    // console.log(settings);
    this.cleaveMoney = new Cleave(this.$refs.input, settings);
    this.cleaveMoney.setRawValue(this.modelValue);
    // console.debug("&&&", this.cleaveMoney);
  },

  beforeUnmount: function () {
    // Destroy Cleave
    this.cleaveMoney.destroy();
  },
};
</script>
