<template>
  <UIButton text="Назад" icon="left arrow" type="basic labeled" @click="back(to)" />
</template>

<script>
export default {
  name: "BackButton",

  props: {
    to: {
      type: String,
      default: null,
    },
  },

  methods: {
    back(name) {
      const lastRoutePath = this.$store.getters["getLastRoutePath"];
      const currentRoutePath = this.$router.currentRoute.path;

      if (lastRoutePath && lastRoutePath != currentRoutePath) {
        console.log("<< Return to : ", lastRoutePath);
        this.$store.commit("removeLastRouteName");
        this.$router.push({ path: lastRoutePath, query: { navigate: "back" } });
      } else {
        console.log("<< Return to : ", name);
        this.$router.push({ name });
      }
    },
  },
};
</script>
