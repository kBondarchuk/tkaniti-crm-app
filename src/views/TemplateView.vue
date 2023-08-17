<template>
  <LayoutPage>
    <!-- <h1>Заглавная страница</h1> -->
  </LayoutPage>
</template>

<script>
import { useView } from "@/composables/view";

export default {
  name: "TemplateView",

  setup() {
    const { view } = useView("TemplateView");

    view.title = "Шаблон";
    view.subTitle = "Заготовка страницы";

    return { view };
  },
};
</script>
