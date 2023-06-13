<template>
  <!-- <a v-if="id > 0" title="Переход к товару" class="ui label" @click.stop="go"> -->
  <i class="clone outline icon" title="Скопировать значение" @click.stop="copy"></i>
  <!-- <span v-if="text">{{ id }}</span> -->
  <!-- </a> -->
</template>

<script>
export default {
  name: "UIClipButton",

  props: {
    id: {
      type: Number,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
  },

  methods: {
    copy() {
      // Copy the text to clipboard
      navigator.clipboard.writeText(this.value);
    },
  },
};
</script>

<style scoped>
.icon {
  font-size: 14px;
  /* background-color: aqua; */
}

.icon:hover {
  color: orangered;
  cursor: pointer;
}
</style>
