<template>
  <LayoutPage>
    <!-- <h1>Заглавная страница</h1> -->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import LayoutPage from "@/components/LayoutPage.vue";

export default {
  name: "Error404View",
  components: { LayoutPage },
  mixins: [viewMixin],
  data() {
    return {
      view: { title: "404", subTitle: "Страница не найдена" },
    };
  },
};
</script>
