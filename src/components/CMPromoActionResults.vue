<template>
  <WPanel>
    <!-- Buttons -->
    <UIButton
      class=""
      :class="{ disabled: action.items == null || action.items.length < 1, loading: isLoading }"
      @click.prevent="getResults"
      >Пересчитать</UIButton
    >
    <div class="ui divider"></div>
    <UIPanelSplash v-if="results.length == 0">Результаты не просчитаны</UIPanelSplash>
    <!-- <ol :class="{ loading: isLoading }">
      <li v-for="item in results" :key="item.id">{{ item.fio }}, {{ item.points }}</li>
    </ol> -->

    <div v-if="results.length > 0" class="content" style="overflow: auto">
      <table class="ui very basic compact table" :class="{ loading: isLoading }">
        <tr>
          <th>&numero;</th>
          <th>ФИО</th>
          <th class="right aligned">Баллы</th>
        </tr>
        <tr v-for="(item, index) in results" :key="item.id">
          <td>{{ index + 1 }}.</td>
          <td>{{ item.fio }}</td>
          <td class="right aligned">{{ item.points }}</td>
        </tr>
      </table>
    </div>
  </WPanel>
</template>

<script>
import apiService from "@/services/api.service.js";

import WPanel from "@/components/WPanel.vue";
import UIPanelSplash from "@/components/UIPanelSplash.vue";

export default {
  name: "CMPromoActionResults",
  components: {
    WPanel,
    UIPanelSplash,
  },
  props: {
    actionId: {
      type: Number,
    },
    action: {
      type: Object,
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
    async fetchActionRun(action_id) {
      this.isLoading = true;
      try {
        await apiService.runPromoAction(action_id);
        this.fetchActionResults(action_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchActionResults(action_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getPromoActionResult(action_id);
        this.results = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
  // mounted() {
  //   this.fetchIndicators();
  // },
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
