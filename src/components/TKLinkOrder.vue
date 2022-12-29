<template>
  <a v-if="id > 0" title="Переход к заказу" class="ui label" @click.stop="go">
    <!-- :href="'/budget/requests/' + id" -->
    <i class="file alternate outline icon grow"></i><span>{{ id }}</span>
    <!-- style="float: left; line-height: unset" -->
  </a>
</template>

<script>
export default {
  name: "TKLinkOrder",

  props: {
    id: {
      type: Number,
      default: null,
    },
    path: {
      type: String,
      default: "order_details",
    },
  },

  methods: {
    go() {
      this.$router.push({
        name: this.path,
        params: { id: this.id },
      });
    },
  },
};
</script>

<style scoped>
a.ui.label > i.icon:hover {
  color: #db2828;
  text-decoration: none;
}

a.ui.label {
  margin-top: -0.2em;
  margin-bottom: -0.2em;
}
</style>
