<template>
  <!-- Rules -->
  <WPanel>
    <div class="content">
      <form class="ui form" :class="{ loading: isLoading }">
        <!-- Buttons -->
        <UIButton v-if="editMode" class="" type="primary" @click.prevent="saveMessage">Сохранить</UIButton>
        <UIButton v-if="!editMode" class="" @click.prevent="editMode = true">Изменить</UIButton>

        <div class="ui divider"></div>

        <!-- No content -->
        <!-- <UIPanelSplash v-if="rules.length == 0">Нет разделов</UIPanelSplash> -->
        <div v-if="!editMode">
          <h3>{{ action.message_header }}</h3>
          <p v-if="action.message_text" v-html="action.message_text.replace(/\r\n|\r|\n/g, '<br/>')"></p>
        </div>
        <!--  -->
        <div v-if="editMode">
          <UITextfield
            v-model.trim.lazy="action.message_header"
            placeholder="Заголовок"
            :disabled="isLoading"
          ></UITextfield>
          <UITextAria v-model.trim.lazy="action.message_text" rows="20" placeholder="Текст"></UITextAria>
        </div>
      </form>
    </div>
  </WPanel>
</template>

<script>
import apiService from "@/services/api.service.js";

import WPanel from "@/components/WPanel.vue";
import UITextfield from "@/components/UITextfield.vue";
import UIButton from "@/components/UIButton.vue";
import UITextAria from "@/components/UITextAria.vue";

export default {
  name: "CMPromoActionMessage",
  components: {
    WPanel,
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
      action: {},
      editMode: false,
    };
  },
  watch: {
    actionId: {
      immediate: true,
      handler(newValue) {
        //newValue, oldValue
        if (newValue > 0) {
          this.fetchAction(newValue);
        } else {
          // New action
          this.reset();
        }
      },
    },
  },
  methods: {
    reset() {
      this.action = {};
    },

    saveMessage() {
      this.fetchUpdateActionRules(this.action);
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
    async fetchUpdateActionRules(action) {
      this.isLoading = true;

      try {
        await apiService.updatePromoActionMessage(action);
        this.editMode = false;
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
