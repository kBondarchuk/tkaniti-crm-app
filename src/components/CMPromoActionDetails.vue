<template>
  <!-- <fragment> -->
  <WPanelContainer vertical>
    <WPanel size="28em" style="border-right: 1px solid rgba(34, 36, 38, 0.15)">
      <div class="content">
        <!-- NO CONTENT -->
        <UIPanelSplash v-if="actionId === null"> Акция не выбрана </UIPanelSplash>
        <!-- Form -->
        <form v-if="actionId !== null" class="ui form" :class="{ loading: isLoading }">
          <h2 v-if="action.name">{{ action.name }}</h2>
          <UITextfield v-model.trim.lazy="action.name" :disabled="isLoading">Название</UITextfield>
          <UITextfield v-model.trim.lazy="action.notes" :disabled="isLoading">Комментарий</UITextfield>

          <div class="two fields">
            <UIInputDate v-model="action.date1">Дата начала</UIInputDate>
            <UIInputDate v-model="action.date2">Дата окончания</UIInputDate>
          </div>
          <div class="field" style="text-align: center">
            <div v-if="contractsCount != null" class="ui pointing label" style="margin-top: 0">
              Договоров:
              <div class="detail">{{ contractsCount }}</div>
            </div>
          </div>
          <!--  -->
          <div class="field">
            <div class="ui checkbox">
              <input v-model="action.hidden" type="checkbox" name="example" />
              <label @click.prevent="action.hidden = !action.hidden">Не показывать в ЛК</label>
            </div>
          </div>
          <!--  -->
          <div class="ui hidden divider"></div>
          <!-- Buttons -->
          <div class="three fields">
            <div class="field">
              <UIButton class="" :class="{ disabled: !canSave }" type="primary" @click.prevent="createAction"
                >Сохранить</UIButton
              >
            </div>

            <!-- status -->
            <div class="ui field" style="text-align: center">
              <UIButton
                v-if="action.status == 0"
                class="green"
                title="Запустить"
                :class="{ disabled: action.items == null || contractsCount < 1 || action.items.length < 1 }"
                style="margin: 0"
                @click.prevent="setActionStatus(1)"
                >Запустить</UIButton
              >

              <UIButton
                v-if="action.status == 1"
                class="secondary"
                title="Остановить"
                :class="{ disabled: action.items == null || contractsCount < 1 || action.items.length < 1 }"
                style="margin: 0"
                @click.prevent="setActionStatus(0)"
                >Остановить</UIButton
              >
            </div>
            <div class="field" style="text-align: right">
              <!-- Delete -->
              <UIButton
                class="red"
                :class="{ disabled: actionId < 1 || action.status > 0 }"
                style="margin: 0"
                @click.prevent="deleteAction(actionId)"
                >Удалить</UIButton
              >
            </div>
          </div>
        </form>
      </div>
    </WPanel>

    <!-- Tabs -->
    <WPanelContainer v-if="action.id" horizontal>
      <WPanel no-padding style="border: 0">
        <div class="ui top tabular menu" style="padding: 0.5em 1em 0em 1em; background-color: aliceblue">
          <div class="item" :class="{ active: menuId == 1 }" @click="menuId = 1">ПОКАЗАТЕЛИ</div>
          <div class="item" :class="{ active: menuId == 2 }" @click="menuId = 2">УСЛОВИЯ АКЦИИ</div>
          <div class="item" :class="{ active: menuId == 3 }" @click="menuId = 3">РЕЗУЛЬТАТЫ</div>
          <div class="item" :class="{ active: menuId == 4 }" @click="menuId = 4">СООБЩЕНИЕ</div>
        </div>
      </WPanel>
      <!-- Показатели -->
      <CMPromoActionIndicators v-if="menuId == 1" :action-id="actionId" :action="action" @refetch="fetchAction" />
      <!-- Условия акции -->
      <CMPromoActionRules v-if="menuId == 2" :action-id="actionId" />
      <!-- Результаты -->
      <CMPromoActionResults v-if="menuId == 3" :action-id="actionId" :action="action" />
      <!-- Сообщение -->
      <CMPromoActionMessage v-if="menuId == 4" :action-id="actionId" :action="action" />
      <!--  -->
    </WPanelContainer>
  </WPanelContainer>
  <!-- </fragment> -->
</template>

<script>
import apiService from "@/services/api.service.js";

import WPanel from "@/components/WPanel.vue";
import WPanelContainer from "@/components/WPanelContainer.vue";
import UIPanelSplash from "@/components/UIPanelSplash.vue";
import UIInputDate from "@/components/UIInputDate.vue";
import UITextfield from "@/components/UITextfield.vue";
import UIButton from "@/components/UIButton.vue";
import CMPromoActionRules from "@/components/CMPromoActionRules.vue";
import CMPromoActionMessage from "@/components/CMPromoActionMessage.vue";
// import { Fragment } from "vue-fragment";
import CMPromoActionResults from "@/components/CMPromoActionResults.vue";
import CMPromoActionIndicators from "@/components/CMPromoActionIndicators.vue";

export default {
  name: "CMPromoActionDetails",
  components: {
    WPanelContainer,
    WPanel,
    UIPanelSplash,
    UIInputDate,
    UITextfield,
    UIButton,
    CMPromoActionRules,
    CMPromoActionResults,
    CMPromoActionIndicators,
    CMPromoActionMessage,
  },
  props: {
    actionId: {
      type: Number,
      default: null,
    },
  },
  emits: ["selectAction"],
  data() {
    return {
      action: {},
      // indicators: [],
      // newIndicator: {},
      contractsCount: null,
      isLoading: false,
      menuId: 1,
    };
  },

  computed: {
    canSave() {
      return (
        this.action != null &&
        (this.action.status === undefined || this.action.status == 0) &&
        Boolean(this.action.name) &&
        Boolean(this.action.date1) &&
        Boolean(this.action.date2)
      );
    },
  },

  watch: {
    actionId: {
      immediate: true,
      handler(newValue) {
        // console.log("sd: ", newValue);

        //newValue, oldValue
        if (newValue > 0) {
          this.fetchAction(newValue);
          // this.fetchActionResults(newValue);
        } else {
          // New action
          this.reset();
        }
        // this.$emit("eventDetails", {});
      },
    },
    "action.date1": {
      immediate: false,
      handler(newValue) {
        if (this.action.date2) {
          console.log("date1: ", newValue);
          this.fetchContractsCount(this.action.date1, this.action.date2);
        }
      },
    },
    "action.date2": {
      immediate: false,
      handler(newValue) {
        if (this.action.date1) {
          console.log("date2: ", newValue);
          this.fetchContractsCount(this.action.date1, this.action.date2);
        }
      },
    },
  },

  methods: {
    reset() {
      this.action = { date1: "", date2: "", hidden: false };
      // this.indicators = [];
      // this.newIndicator = {};
      // this.results = null;
      this.contractsCount = null;
    },
    createAction() {
      if (this.action.id > 0) {
        // Update
        this.fetchUpdateAction(this.action);
      } else {
        // Create
        this.fetchCreateAction(this.action);
      }
    },
    setActionStatus(status) {
      this.fetchSetActionStatus(this.action.id, status);
    },
    deleteAction(actionId) {
      var confirmed = confirm("Вы действительно хотите удалить акцию?");
      if (confirmed) {
        this.fetchDeleteAction(actionId);
      }
    },

    // Networking
    async fetchAction(action_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getPromoAction(action_id);
        this.action = result;
        // this.fetchActionRules(action_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchSetActionStatus(action_id, status) {
      this.isLoading = true;
      try {
        let result = await apiService.setPromoActionStatus(action_id, status);
        this.action.status = result.status;
        console.log("New status: ", result.status);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCreateAction(action) {
      this.isLoading = true;
      try {
        let result = await apiService.createPromoAction(action);
        //this.indicators = result;
        // this.fetchAction(this.actionId);
        console.log(result.id);
        this.$emit("selectAction", result.id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchUpdateAction(action) {
      this.isLoading = true;
      try {
        let result = await apiService.updatePromoAction(action);
        //this.indicators = result;
        // this.fetchAction(this.actionId);
        console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchDeleteAction(action_id) {
      this.isLoadingIndicators = true;
      try {
        await apiService.deletePromoAction(action_id);
        this.$emit("selectAction", 0);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoadingIndicators = false;
    },

    async fetchContractsCount(date1, date2) {
      this.isLoading = true;
      try {
        let result = await apiService.getPromoActionContracts(date1, date2);
        this.contractsCount = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
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
}
</style>
