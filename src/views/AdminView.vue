<template>
  <LayoutPage>
    <template #side>
      <LayoutSideMenu :items="menu" />
    </template>

    <p>Time: {{ ping_result.data.time }}</p>

    <p>Server:</p>
    <ul>
      <li v-for="item in ping_result.server_params" :key="item[0]">{{ item }}</li>
    </ul>
  </LayoutPage>
</template>
<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";

import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";

export default {
  name: "AdminView",
  components: {
    LayoutPage,
    LayoutSideMenu,
  },
  mixins: [viewMixin],
  data() {
    return {
      // View
      view: { title: "Администрирование", subTitle: "" },
      menu: [
        { id: 1, name: "Ping", icon: "plus" },
        { id: 2, name: "Новый договор", icon: "plus" },
        { id: 3, name: "Новый договор", icon: "plus" },
      ],
      // Data
      ping_result: {},
    };
  },
  mounted() {
    this.ping();
  },
  methods: {
    async ping() {
      try {
        let result = await apiService.ping();
        console.log(result);
        this.ping_result = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
  },
};
</script>
