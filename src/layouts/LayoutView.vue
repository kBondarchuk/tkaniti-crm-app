<template>
  <div id="layout" class="wrapper">
    <CMMainMenu />

    <!-- <div class="ui-layout"> -->
    <!-- Header Title -->
    <!-- <LayoutPageTitle /> -->
    <!-- /Header Title -->
    <router-view />
    <!-- </div> -->

    <LayoutFooter />
  </div>
</template>

<script>
import CMMainMenu from "@/components/CMMainMenu.vue";
import LayoutFooter from "@/Layouts/LayoutFooter.vue";

export default {
  name: "LayoutView",
  components: {
    CMMainMenu,
    LayoutFooter,
  },
};
</script>
