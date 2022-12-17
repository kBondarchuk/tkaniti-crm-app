<template>
  <!-- Поиск -->
  <div class="ui left icon input search">
    <input type="text" :placeholder="placeholder" :value="modelValue" @input="update" />
    <i class="search icon"></i>
    <i
      v-if="modelValue && modelValue.length > 0"
      class="x icon"
      style="position: absolute; right: 0px; left: auto; display: block; cursor: pointer; pointer-events: all"
      @click.prevent="clear"
    ></i>
  </div>
  <!--  -->
</template>

<script>
export default {
  name: "UITextSearch",

  props: {
    modelValue: {
      type: [String, Number],
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    disabled: Boolean,
    readonly: Boolean,
    debounce: {
      type: Number,
      default: 600,
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      debounceFunc: null,
    };
  },

  methods: {
    clear() {
      this.$emit("update:modelValue", "");
    },
    update(event) {
      clearTimeout(this.debounceFunc);
      this.debounceFunc = setTimeout(() => {
        this.$emit("update:modelValue", event.target.value);
      }, this.debounce);
    },
  },
};
</script>

<style scoped>
.ui[class*="left icon"].input.search > input[type="text"] {
  padding-left: 2.67142857em;
  padding-right: 2em;
}

.ui.input.search > input[type="text"] {
  padding: 0.4em;
  /* padding-right: 1em; */
  /* padding-right: 1.5em; */
  border-radius: 3px;
  -webkit-appearance: none;
}
</style>
