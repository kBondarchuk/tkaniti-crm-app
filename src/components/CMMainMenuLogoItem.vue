<template>
  <!-- Logo Item: Home -->
  <router-link id="logo-item" to="/" active-class="active2" exact-active-class="active" class="item">
    <span class="logo">
      {{ parsedText.first }}<span v-if="parsedText.second" class="second">.{{ parsedText.second }}</span></span
    >
  </router-link>
</template>

<script>
export default {
  name: "CMMainMenuLogoItem",

  props: {
    text: {
      type: String,
      default: "ЮМ.авто",
    },
  },

  computed: {
    parsedText() {
      return {
        first: this.text.slice(0, this.text.indexOf(".")),
        second: this.text.slice(this.text.indexOf(".") + 1),
      };
    },
  },
};
</script>

<style scoped>
.item#logo-item {
  border-radius: 6px !important;
}

span.logo {
  /* font-size: 17px; */
  font-weight: bold;
  color: #ffffff;
}

span.logo > .second {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 200;
  font-variant-caps: normal;
}
</style>
