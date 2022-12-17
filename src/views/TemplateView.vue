<template>
  <LayoutPage>
    <!-- <h1>Заглавная страница</h1> -->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import LayoutPage from "@/components/LayoutPage.vue";

export default {
  name: "TemplateView",
  components: { LayoutPage },
  mixins: [viewMixin],
  data() {
    return {
      view: { title: "Шаблон", subTitle: "Заготовка страницы" },
    };
  },
};
</script>
