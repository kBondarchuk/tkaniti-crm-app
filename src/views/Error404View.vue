<template>
  <LayoutPage>
    <!-- <h1>Заглавная страница</h1> -->
  </LayoutPage>
</template>

<script>
import { useView } from "@/composables/view";

export default {
  name: "Error404View",

  setup() {
    const { view } = useView("Error404View");

    view.title = "404";
    view.subTitle = "Страница не найдена";

    return { view };
  },
};
</script>
