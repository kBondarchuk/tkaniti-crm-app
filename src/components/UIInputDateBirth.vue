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

const date_defaults = {
  date: true,
  delimiter: ".",
  datePattern: ["d", "m", "Y"],
};

export default {
  name: "UIInputDateBirth",

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
      // console.log(newValue, this.SQLDateToRaw(newValue));
      this.cleaveMoney.setRawValue(this.SQLDateToRaw(newValue));
    },
  },

  mounted: function () {
    let vm = this;
    let settings = $.extend(date_defaults, {
      onValueChanged: function (e) {
        // e.target = { value: '5100-1234', rawValue: '51001234' }
        vm.rawValue = e.target.rawValue;
        vm.formattedValue = e.target.value;

        if (!e.target.value) {
          vm.$emit("update:modelValue", null);
          return;
        }

        let date = vm.dateToMySQL(e.target.value);
        if (date) {
          vm.$emit("update:modelValue", date);
        }
        // console.log(date);
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

  methods: {
    // 31.12.2019 -> 2019-12-31
    dateToMySQL(date) {
      if (date === undefined) return "";
      if (date === null) return "";
      if (date.length < 10) return "";
      // Split Date / Time

      return date.split(".")[2] + "-" + date.split(".")[1] + "-" + date.split(".")[0];
    },
    // 2019-12-31 -> 31122019
    SQLDateToRaw(date) {
      if (date === undefined) return "";
      if (date === null) return "";
      if (date.length < 10) return "";
      // Split Date / Time

      return date.split("-")[2] + date.split("-")[1] + date.split("-")[0];
    },
  },
};
</script>
