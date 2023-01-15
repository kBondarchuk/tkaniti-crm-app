<template>
  <!-- Показатели -->
  <WPanel>
    <div class="content">
      <!--  -->
      <form class="ui form" :class="{ loading: isLoading }">
        <!-- <h2>Показатели</h2> -->
        <!-- header -->
        <div class="ui sub header" style="display: inline-block; width: 62%; margin-top: 0">Показатель</div>
        <div class="ui sub header" style="display: inline-block; width: 38%; margin-top: 0; padding-left: 0.5em">
          Баллы
        </div>
        <div class="ui divider" style="margin-top: 0.5em"></div>
        <!-- New -->
        <div class="fields">
          <!-- <UITextfield v-model="newIndicator.name" :disabled="isLoading">Показатель</UITextfield> -->
          <UIInputDropdown v-model.number="newIndicator.id" :options="options" style="width: 64%"></UIInputDropdown>
          <UIInputMoney
            v-model="newIndicator.value"
            :positive-only="false"
            :disabled="isLoading"
            style="width: 20%"
          ></UIInputMoney>
          <UIButton
            class="field"
            icon="red trash alternate"
            style="margin-right: 0.5em; margin-left: 0.5em; width: 8%; visibility: hidden"
          ></UIButton>
          <UIButton
            class="field"
            :class="{ disabled: !newIndicator.id || !newIndicator.value || action.status > 0 }"
            icon="green plus"
            style="margin-right: 0.5em; width: 8%"
            @click.prevent="addIndicator"
          ></UIButton>
        </div>
        <div class="ui divider"></div>

        <!-- List -->
        <div v-for="item in action.items" :key="item.id" class="fields">
          <UITextfield v-model.trim.lazy="item.indicator_name" :disabled="isLoading" style="width: 64%"></UITextfield>

          <UIInputMoney
            v-model="item.value"
            :positive-only="false"
            :disabled="isLoading"
            style="width: 20%"
          ></UIInputMoney>
          <UIButton
            class="field"
            icon="red trash alternate"
            style="margin-right: 0.5em; margin-left: 0.5em; width: 8%"
            :class="{ disabled: action.status > 0 }"
            @click.prevent="fetchDeleteIndicator(1, item.id)"
          ></UIButton>
          <UIButton
            class="field"
            icon="green check"
            style="margin-right: 0.5em; width: 8%"
            :class="{ disabled: action.status > 0 }"
            @click.prevent="updateIndicator(item.id)"
          ></UIButton>
        </div>
        <h4
          v-if="action.items && action.items.length == 0"
          style="text-align: center; margin-top: 0em; color: rgba(0, 0, 0, 0.5)"
        >
          Нет показателей
        </h4>
        <!-- <div class="ui divider"></div> -->
      </form>
    </div>
  </WPanel>
</template>

<script>
import apiService from "@/services/api.service.js";

import WPanel from "@/components/WPanel.vue";

export default {
  name: "CMPromoActionIndicators",
  components: {
    WPanel,
  },
  props: {
    actionId: {
      type: Number,
    },
    action: {
      type: Object,
    },
  },
  emits: ["refetch"],
  data() {
    return {
      isLoading: false,
      indicators: [],
      newIndicator: {},
      contractsCount: null,
    };
  },
  computed: {
    options() {
      let menu = [{ name: "Выбрать", value: null }];

      menu = menu.concat(
        this.indicators.map(function (item) {
          return { name: item.name, value: item.id };
        })
      );

      return menu;
    },
  },
  watch: {
    actionId: {
      immediate: true,
      handler(newValue) {
        //newValue, oldValue
        if (newValue > 0) {
          // this.fetchActionRules(newValue);
        } else {
          // New action
          // this.reset();
        }
      },
    },
  },
  mounted() {
    this.fetchIndicators();
  },
  methods: {
    addIndicator() {
      console.log(this.newIndicator);
      const newIndicator = this.newIndicator;
      newIndicator.indicator_id = this.newIndicator.id;
      this.fetchAddIndicator(this.actionId, newIndicator);
    },
    updateIndicator(indicator_id) {
      const item = this.action.items.find((item) => {
        return item.id == indicator_id;
      });

      console.log(item);
      this.fetchUpdateIndicator(this.actionId, indicator_id, item);
    },
    // Networking
    async fetchIndicators() {
      this.isLoading = true;
      try {
        let result = await apiService.getPromoAvailableIndicators();
        this.indicators = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchAddIndicator(action_id, newIndicator) {
      this.isLoading = true;
      try {
        await apiService.addPromoActionIndicator(action_id, newIndicator);
        //this.indicators = result;
        // this.fetchAction(this.actionId);
        this.$emit("refetch", this.actionId);

        // console.log(result);
        this.newIndicator = { value: "" };
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchUpdateIndicator(action_id, indicator_id, indicator) {
      this.isLoading = true;
      try {
        let result = await apiService.updatePromoActionIndicator(action_id, indicator_id, indicator);
        //this.indicators = result;
        // this.fetchAction(this.actionId);
        this.$emit("refetch", this.actionId);
        console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchDeleteIndicator(action_id, indicator_id) {
      this.isLoading = true;
      try {
        await apiService.deletePromoActionIndicator(action_id, indicator_id);
        //this.indicators = result;
        // this.fetchAction(this.actionId);
        this.$emit("refetch", this.actionId);
        // console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.ui.comments {
  /* overflow: auto; */
  /* background-color: burlywood; */
  /* height: 100%; */
  max-height: 100vh;
}
</style>
