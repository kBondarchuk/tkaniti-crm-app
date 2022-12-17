<template>
  <a v-if="requestId > 0" title="Переход к заявке" class="ui label" @click.stop="go">
    <!-- :href="'/budget/requests/' + requestId" -->
    <i class="file alternate outline icon grow"></i><span>{{ requestId }}</span>
    <!-- style="float: left; line-height: unset" -->
  </a>
</template>

<script>
export default {
  name: "CMLinkBudget",

  props: {
    requestId: {
      type: Number,
      default: null,
    },
    path: {
      type: String,
      default: "budget_request_details",
    },
  },

  methods: {
    go() {
      this.$router.push({
        name: this.path,
        params: { request_id: this.requestId },
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
