<template>
  <!-- <a v-if="id > 0" title="Переход к товару" class="ui label" @click.stop="go"> -->
  <i class="arrow alternate circle right outline icon" @click.stop="go"></i>
  <!-- <span v-if="text">{{ id }}</span> -->
  <!-- </a> -->
</template>

<script>
export default {
  name: "TKLinkGood",

  props: {
    id: {
      type: Number,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    pathName: {
      type: String,
      default: null,
    },
  },

  methods: {
    go() {
      this.$router.push({
        name: this.pathName,
        params: { id: this.id },
      });
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
