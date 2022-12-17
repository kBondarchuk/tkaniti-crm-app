<template>
  <UITable :headers="headers" :count="items.length" :loading="isLoading" :empty-text="emptyText">
    <tr
      v-for="(item, index) in items"
      :key="item.id"
      :class="{ error: items[index - 1] ? items[index - 1].new_status != item.old_status : false }"
    >
      <!-- <td>{{item.id}}</td> -->
      <td>{{ $filters.date(item.datetime) }}</td>
      <td>
        <CMContractStatus v-if="item.old_status != null" :value="item.old_status" />
        <span v-else>Создание договора</span>
        <i class="arrow alternate right icon"></i><CMContractStatus :value="item.new_status" />
      </td>
      <td>
        {{ item.user }}
      </td>
    </tr>
  </UITable>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITable from "@/components/UITable.vue";
import CMContractStatus from "@/components/CMContractStatus.vue";

export default {
  name: "CMHistoryStatusList",
  components: {
    UITable,
    CMContractStatus,
  },
  props: {
    contract_id: {
      type: Number,
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
      return ["Дата", "Изменение статуса", "Сотрудник"];
    },
    emptyText() {
      return "Нет истории";
    },
  },
  mounted() {
    this.refetch();
  },
  methods: {
    async refetch() {
      this.isLoading = true;
      try {
        let result = await apiService.getContractsHistory(this.contract_id);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
