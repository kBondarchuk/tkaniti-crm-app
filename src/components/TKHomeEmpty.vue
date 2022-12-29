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
import { viewMixin } from "@/mixins/ViewMixin.js";

export default {
  name: "TKHomeEmpty",

  components: {},

  mixins: [viewMixin],

  data() {
    return {
      view: { title: "Пустая начальная страница", subTitle: "" },
    };
  },
};
</script>
