<template>
  <router-link v-if="item.route" :to="item.route" active-class="active" class="item" :class="item.class">
    <i v-if="item.icon" class="icon" :class="item.icon" /> {{ item.name }}
  </router-link>
  <div v-else class="item disabled">
    <i v-if="item.icon" class="icon" :class="item.icon" /> <span v-html="item.name"></span>
  </div>
</template>

<script>
export default {
  name: "CMMainMenuItem",

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  //
};
</script>
