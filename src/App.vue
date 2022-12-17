<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  watch: {
    $route: {
      handler(to, from) {
        // console.warn(to, from);
        const body = document.getElementsByTagName("body")[0];
        if (from && from.name) {
          body.classList.remove("page-" + from.name.toLowerCase());
        }
        if (to && to.name) {
          body.classList.add("page-" + to.name.toLowerCase());
        }
      },
      immediate: true,
    },
  },
};
</script>
