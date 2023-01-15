<template>
  <!-- <UITableList
    id="CMBudgetStagesList"
    :headers="[]"
    :items-count="items.length + 1"
    :is-loading="isLoading"
    noSort
    bordered
    notSelectable
  > -->
  <!--  -->
  <div>
    <div
      class="ui top attached header center aligned small segment"
      style="background: #f9fafb; padding-top: 0.4rem; padding-bottom: 0.4rem"
    >
      СТАДИИ РАССМОТРЕНИЯ ЗАЯВКИ
    </div>
    <CMRegistrationStagesListItem
      :key="0"
      :item="{ username: requestAuthor, dt: requestDate, status: 0 }"
      :count="items.length"
      :index="-1"
    />
    <!--  -->
    <CMRegistrationStagesListItem
      v-for="(item, index) in items"
      :key="item.id"
      :item="item"
      :count="items.length"
      :index="index"
    />
  </div>
  <!-- </UITableList> -->
</template>

<script>
import apiService from "@/services/api.service.js";

import CMRegistrationStagesListItem from "@/components/CMRegistrationStagesListItem.vue";

export default {
  name: "CMRegistrationStagesList",
  components: {
    CMRegistrationStagesListItem,
  },
  props: {
    requestId: {
      type: Number,
      default: null,
    },
    requestAuthor: {
      type: String,
      default: null,
    },
    requestDate: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      items: [],
      isLoading: false,
    };
  },
  computed: {
    headers() {
      return [
        { name: "Дата, время" },
        // { name: "Действие" },
        { name: "Сотрудник, Комментарий" },
        // , { name: "Комментарий" }
      ];
    },
  },
  watch: {
    requestId: {
      immediate: true,
      handler(newValue) {
        if (newValue === null) return;
        this.fetchStages(newValue);
      },
    },
  },
  methods: {
    async fetchStages(requestId) {
      this.isLoading = true;
      try {
        let result = await apiService.getRegistrationRequestStages(requestId);
        // console.log(result);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
