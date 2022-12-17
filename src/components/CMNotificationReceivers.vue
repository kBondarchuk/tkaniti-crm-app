<template>
  <WPanel>
    <!-- Buttons -->
    <!-- <UIButton class="" @click.prevent="getResults">Пересчитать</UIButton>
    <div class="ui divider"></div> -->
    <!-- Splash -->
    <UIPanelSplash v-if="receivers.length == 0">Нет получателей</UIPanelSplash>
    <!-- <ol :class="{ loading: isLoading }">
      <li v-for="item in results" :key="item.id">{{ item.fio }}, {{ item.points }}</li>
    </ol> -->
    <h2 v-if="receivers.length > 0">Список получателей</h2>

    <div v-if="receivers.length > 0" class="content" style="overflow: auto">
      <table class="ui very basic compact table" :class="{ loading: isLoading }">
        <tr>
          <th>&numero;</th>
          <th>ФИО</th>
          <th class="right aligned">Ув. отпр.</th>
          <th class="right aligned">Прочитано</th>
        </tr>
        <tr v-for="(item, index) in receivers" :key="item.id">
          <td>{{ index + 1 }}.</td>
          <td>{{ item.fio }}</td>
          <td class="right aligned">
            <span v-if="item.is_sent"><i class="check green icon"></i></span>
          </td>
          <td class="right aligned">
            <span v-if="item.is_read"><i class="check green icon"></i></span>
          </td>
        </tr>
      </table>
    </div>
  </WPanel>
</template>

<script>
// import apiService from "@/services/api.service.js";

import WPanel from "@/components/WPanel.vue";
// import UIButton from "@/components/UIButton.vue";
import UIPanelSplash from "@/components/UIPanelSplash.vue";

export default {
  name: "CMNotificationReceivers",
  components: {
    WPanel,
    UIPanelSplash,
    // UIButton,
  },
  props: {
    receivers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      results: [],
      isLoading: false,
    };
  },
  watch: {
    actionId: {
      immediate: true,
      handler(newValue) {
        //newValue, oldValue
        if (newValue > 0) {
          this.fetchActionResults(newValue);
        } else {
          // New action
          this.reset();
        }
      },
    },
  },
  methods: {
    reset() {
      this.results = [];
    },
    getResults() {
      this.fetchActionRun(this.actionId);
    },
    // Networking
    async fetchActionRun() {
      // this.isLoading = true;
      // try {
      //   await apiService.runPromoAction(action_id);
      //   this.fetchActionResults(action_id);
      // } catch (error) {
      //   this.$UIService.showNetworkError(error);
      // }
      // this.isLoading = false;
    },
    async fetchActionResults() {
      // this.isLoading = true;
      // try {
      //   let result = await apiService.getPromoActionResult(action_id);
      //   this.results = result;
      // } catch (error) {
      //   this.$UIService.showNetworkError(error);
      // }
      // this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.content {
  /* overflow: auto; */
  /* background-color: burlywood; */
  /* height: 100%; */
  max-height: 100vh;
  padding-right: 0.3rem;
  margin-right: -0.3rem;
}
</style>
