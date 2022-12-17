<template>
  <!-- :href="'#/customers/' + customerId" -->
  <a
    v-if="customerId > 0"
    title="Переход на страницу клиента"
    class="badge"
    style="display: inline-flex; align-items: center"
    @click.stop="go"
  >
    <i class="user icon grow"></i>
  </a>
</template>

<script>
export default {
  name: "CMLinkCustomer",
  props: {
    customerId: {
      type: Number,
      default: null,
    },
  },
  methods: {
    go() {
      this.$router.push({
        name: "customers_details",
        params: { id: this.customerId },
      });
    },
  },
};
</script>

<style scoped>
a.badge {
  padding: 0.3em 0.4em;
  color: rgba(0, 0, 0, 0.6);
  /* background: #e8e8e8; */
  background: rgba(0, 0, 0, 0.02);
  border-radius: 3px;
  font-weight: bold;
  white-space: nowrap;
}

a.badge.red {
  background-color: #db2828;
  color: #fff;
}

a.badge > i.icon:hover {
  color: #db2828;
  text-decoration: none;
  cursor: pointer;
}

a.badge.red > i.icon:hover {
  color: inherit;
}

/* .ui.label > i.icon:hover {
  color: #db2828;
  text-decoration: none;
}

.ui.label.red > i.icon {
  color: #fff;
  text-decoration: none;
} */

.badge > .icon {
  margin: 0 0 0 0;
}

/* .ui.label {
  font-size: 12px;
  line-height: 1;
}
/*
.ui.label {
   margin-top: -0.2em;
  margin-bottom: -0.1em;
  display: inline;
} */
</style>
