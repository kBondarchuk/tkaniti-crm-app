<template>
  <LayoutPage>
    <!-- Grid -->
    <div class="ui grid">
      <!-- fist column -->
      <!-- <div class="eight wide column">
      </div> -->
      <!-- second column -->
      <!-- <div class="eight wide second column">
        <CMDraftRequestsList v-if="checkAuthRole('registration.view')" />
        <CMRentContractsWarningsList />
        <CMCarFinesTotalsList general />
        <CMSystemLogList v-if="checkAuthRole('admin')" />
      </div> -->
    </div>
  </LayoutPage>
</template>

<script>
import { useView } from "@/composables/view";

export default {
  name: "TKHomeEmpty",

  setup() {
    const { view } = useView("TKHomeEmpty");

    view.title = "Пустая начальная страница";
    view.subTitle = "";

    return { view };
  },
};
</script>
