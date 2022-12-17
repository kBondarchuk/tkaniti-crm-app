<template>
  <div class="field" :class="{ disabled: disabled }">
    <div id="slider-1" ref="slider" class="ui blue slider" />
  </div>
</template>

<script>
export default {
  name: "UISlider",

  props: {
    modelValue: {
      type: [Number, String],
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
      default: "slider",
    },
    disabled: Boolean,
  },

  emits: ["update:modelValue"],

  data() {
    return {
      // value: 50,
    };
  },

  watch: {
    modelValue(newValue) {
      // console.warn("[Slider]: watch: ", newValue);
      $(this.$refs.slider).slider("set value", newValue, false);
    },
  },

  mounted() {
    console.log("[Slider]: mounted");

    const vm = this;

    $(this.$refs.slider).slider({
      min: 0,
      max: 100,
      start: vm.modelValue,
      step: 1,
      onMove: function (value) {
        // console.warn("[Slider]: onMove", value);
        vm.$emit("update:modelValue", value);
      },
      // onChange: function (value) {
      //   console.log("[Slider]: onChange", value);
      //   vm.$emit("input", value);
      // },
    });
  },

  // beforeUnmount() {
  // Destroy Calendar
  // $(this.$refs.calendar).off();
  // },
};
</script>
