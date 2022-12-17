<template>
  <div
    class="ui toggle checkbox"
    :class="{ loading }"
    style="display: block; margin-left: auto"
    @click.stop="toggleOption()"
  >
    <input type="checkbox" name="public" :checked="checked" />
    <label>{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: "CMToggle",

  props: {
    checked: {
      type: Boolean,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  methods: {
    toggleOption() {
      console.log("Toggle: ", this.checked);
      if (this.checked) {
        // set to 0
        // this.fetchSetOption(this.contractId, 0);
      } else {
        // set to 1
        // console.log("Toggle: ", this.checked);
        // this.fetchSetOption(this.contractId, 1);
      }
    },
  },
};
</script>
