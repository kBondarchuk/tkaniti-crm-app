<template>
  <LayoutPage>
    <!-- Grid -->
    <div class="ui grid">
      <!-- fist column -->
      <!-- <div class="eight wide column">
        <CMWarningsList />
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
  name: "CMHomeManager",

  setup() {
    const { view } = useView("CMHomeManager");

    view.title = "Начальная страница менеджера";
    view.subTitle = "";

    return { view };
  },
};
</script>
