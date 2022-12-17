<template>
  <!-- Rules -->
  <WPanel>
    <div class="content">
      <form class="ui form" :class="{ loading: isLoading }">
        <!-- Buttons -->
        <UIButton v-if="editMode" class="" type="primary" @click.prevent="saveRules">Сохранить</UIButton>
        <UIButton v-if="!editMode" class="" @click.prevent="editMode = true">Изменить</UIButton>
        <UIButton
          v-if="editMode"
          class="right compact right floated right labeled"
          icon="green plus"
          @click.prevent="addRule"
          >Добавить раздел</UIButton
        >
        <!-- <h2>Условия акции</h2> -->
        <div class="ui divider"></div>

        <!-- No content -->
        <UIPanelSplash v-if="rules.length == 0">Нет разделов</UIPanelSplash>

        <!-- Rules: View mode -->
        <div v-if="!editMode">
          <template v-for="item in rules" :key="item.id">
            <h3>{{ item.section }}. {{ item.title }}</h3>
            <p v-if="item.text" v-html="item.text.replace(/\r\n|\r|\n/g, '<br/>')"></p>
          </template>
        </div>
        <!-- Rules: Edit mode -->
        <div v-if="editMode">
          <template v-for="item in rules" :key="item.id">
            <h4 style="display: inline-block; margin-top: 0; color: darkgray">РАЗДЕЛ {{ item.section }}</h4>
            <UIButton
              class="right floated"
              style="margin-top: -0.4em"
              icon="red trash alternate"
              @click.prevent="removeRule(item)"
            ></UIButton>
            <UITextfield v-model.trim.lazy="item.title" placeholder="Заголовок" :disabled="isLoading"></UITextfield>
            <UITextAria v-model.trim.lazy="item.text" rows="4" placeholder="Текст"></UITextAria>
            <div class="ui divider"></div>
          </template>
        </div>
      </form>
    </div>
  </WPanel>
</template>

<script>
import apiService from "@/services/api.service.js";

import WPanel from "@/components/WPanel.vue";
import UIPanelSplash from "@/components/UIPanelSplash.vue";
import UITextfield from "@/components/UITextfield.vue";
import UIButton from "@/components/UIButton.vue";
import UITextAria from "@/components/UITextAria.vue";

export default {
  name: "CMPromoActionRules",
  components: {
    WPanel,
    UIPanelSplash,
    UITextfield,
    UIButton,
    UITextAria,
  },
  props: {
    actionId: {
      type: Number,
    },
  },
  data() {
    return {
      isLoading: false,
      rules: [],
      editMode: false,
    };
  },
  watch: {
    actionId: {
      immediate: true,
      handler(newValue) {
        //newValue, oldValue
        if (newValue > 0) {
          this.fetchActionRules(newValue);
        } else {
          // New action
          this.reset();
        }
      },
    },
  },
  methods: {
    reset() {
      this.rules = [];
    },
    addRule() {
      var maxSection = 0;
      if (this.rules.length > 0) {
        maxSection = this.rules.reduce((prev, current) => (prev.section > current.section ? prev : current)).section;
      }
      const rule = { section: maxSection + 1, title: "", text: "" };
      this.rules.push(rule);
    },
    removeRule(item) {
      var confirmed = confirm("Вы действительно хотите рездел " + item.section + " ?");
      if (confirmed) {
        if (item.id) {
          this.fetchDeleteActionRule(this.actionId, item.section);
        } else {
          // Remove
          this.rules = this.rules.filter((item2) => {
            return item2.section != item.section;
          });
        }
      }
    },
    saveRules() {
      this.fetchUpdateActionRules(this.actionId, this.rules);
    },
    // Networking
    async fetchActionRules(action_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getPromoActionRules(action_id);
        this.rules = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchUpdateActionRules(action_id, rules) {
      // this.isLoadingIndicators = true;
      try {
        await apiService.updatePromoActionRules(action_id, rules);
        this.editMode = false;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      // this.isLoadingIndicators = false;
    },
    async fetchDeleteActionRule(action_id, section) {
      // this.isLoadingIndicators = true;
      try {
        // Delete
        await apiService.deletePromoActionRules(action_id, section);
        // Refetch
        this.fetchActionRules(action_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      // this.isLoadingIndicators = false;
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
