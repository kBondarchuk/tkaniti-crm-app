<template>
  <UITableList
    :id="$options.name"
    title="Журнал системных событий"
    bordered
    hide-paging
    :columns-count="2"
    :items-count="items.length"
    :is-loading="isLoading"
    :empty-text="emptyText"
    :pagination="pagination"
    @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
  >
    <tr v-for="item in items" :key="item.id" :item="item" @click="handleDetails(item)">
      <!-- <td>{{$filters.date(item.datetime )}}</td> -->
      <!-- <td>{{ item.name }}</td> -->
      <td>
        <UIBadge
          :text="item.type"
          :class="{
            'background-color-orange text-color-white': item.type == 'warning',
            'background-color-red text-color-white': item.type == 'error',
          }"
        />
      </td>
      <td>
        <span class="text-color-grey">{{ $filters.date(item.datetime) }} • </span>
        <span class="text-color-grey">{{ item.name }}</span> <br />
        {{ item.message }}
      </td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";
import UIBadge from "@/components/UIBadge.vue";

export default {
  name: "CMSystemLogList",

  components: {
    UITableList,
    UIBadge,
  },

  props: {
    carId: {
      type: Number,
    },
  },

  data() {
    return {
      items: [],
      isLoading: false,
      pagination: { page: 0, per_page: 10, sort_by: "datetime", sort_order: "desc" },
    };
  },

  computed: {
    emptyText() {
      return "Нет сообщений";
    },
  },

  watch: {
    carId: {
      immediate: true,
      handler() {
        this.refetch();
      },
    },
  },

  methods: {
    handleDetails(item) {
      console.log("details clicked: " + item.id);
    },
    handlePagingUp() {
      this.pagination.page++;
      this.refetch();
    },
    handlePagingDown() {
      this.pagination.page--;
      this.refetch();
    },
    handlePagingFirst() {
      this.pagination.page = 0;
      this.refetch();
    },
    handlePagingLast() {
      this.pagination.page = this.pagination.total_pages - 1;
      this.refetch();
    },

    // Network
    async refetch() {
      this.isLoading = true;

      var filter = { ...this.pagination };

      try {
        let { data, meta } = await apiService.getSystemLog(filter);
        this.pagination.total_count = meta.total_count;
        this.pagination.total_pages = meta.total_pages;
        this.items = data;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
  // mounted() {
  //   this.refetch();
  // },
};
</script>
