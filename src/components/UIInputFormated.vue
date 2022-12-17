<template>
  <div class="field" :class="{ disabled: disabled }">
    <!--  -->
    <label v-if="$slots.default || label" :for="name">
      <slot />
      <template v-if="label">{{ label }}</template>
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

const cleave_defaults = {
  blocks: [2, 2, 6],
  delimiter: " ",
  uppercase: true,
  // numericOnly: false,
};

export default {
  name: "UIInputFormated",

  props: {
    modelValue: String,
    label: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
    settings: {
      type: Object,
      default: () => {
        return cleave_defaults;
      },
    },
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
      //   console.log(newValue);
      this.cleaveMoney.setRawValue(newValue);
    },
  },

  mounted: function () {
    let vm = this;
    let settings = $.extend(this.settings, {
      onValueChanged: function (e) {
        // e.target = { value: '5100-1234', rawValue: '51001234' }
        vm.rawValue = e.target.rawValue;
        vm.formattedValue = e.target.value;

        vm.$emit("update:modelValue", vm.rawValue);
        // if (vm.rawValue !== cleave_defaults.prefix) {
        //   vm.$emit("input", vm.rawValue);
        // } else {
        //   vm.$emit("input", null);
        // }
        // const filtered = vm.rawValue.replace(/[^0-9A-Z]+/g, "");
        // vm.rawValue = filtered;
        // vm.$emit("input", filtered);
        // console.log(filtered);
      },
    });
    // console.log(settings);
    this.cleaveMoney = new Cleave(this.$refs.input, settings);
    this.cleaveMoney.setRawValue(this.modelValue);
    // console.log(this.cleaveMoney);
  },

  beforeUnmount: function () {
    // Destroy Cleave
    this.cleaveMoney.destroy();
  },
};
</script>
