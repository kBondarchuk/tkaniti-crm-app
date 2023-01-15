<template>
  <UITableList
    id="requests"
    title="Заявки на регистрацию"
    bordered
    hide-paging
    :columns-count="3"
    :items-count="items.length"
    :is-loading="isLoading"
    :empty-text="emptyText"
  >
    <tr v-for="item in items" :key="item.id" :item="item" @click="handleDetails(item)">
      <!-- <td>{{item.id}}</td> -->
      <td class="">{{ $filters.date(item.created_dt) }}</td>
      <td class="">{{ item.last_name }} {{ item.first_name }} {{ item.second_name }}</td>
      <td class="">{{ $filters.phone(item.phone) }}</td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMDraftRequestsList",

  components: {},

  props: {
    carId: {
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
      return [];
    },
    emptyText() {
      return "Нет новых заявок";
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
      if (item.id) {
        this.$router.push({
          name: "registration_request_details",
          params: { request_id: item.id },
        });
      }
    },
    // Network
    async refetch() {
      this.isLoading = true;

      try {
        let { data } = await apiService.getRegistrationRequests(0);
        this.items = data;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
