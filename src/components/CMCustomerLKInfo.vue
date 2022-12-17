<template>
  <div>
    <table class="ui very compact small celled two column definition table" :class="{ loading: isLoading }">
      <!-- <thead>
        <tr>
          <th colspan="2" class="ui center aligned">ЛК клиента</th>
        </tr>
      </thead> -->
      <tbody>
        <tr>
          <td>Пароль</td>
          <td v-if="info.password">Установлен</td>
          <td v-else>Не установлен</td>
        </tr>
        <tr>
          <td>Получение уведомлений</td>
          <td v-if="info.device_id">Да</td>
          <td v-else>Нет</td>
        </tr>
      </tbody>
    </table>
    <!--  -->
    <table class="ui very compact small celled table" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th colspan="2" class="ui center aligned">Последний вход</th>
        </tr>
      </thead>
      <tbody class="marked">
        <tr>
          <td>Время</td>
          <td>{{ $filters.date(info.last_access.timestamp) }}</td>
        </tr>
        <tr>
          <td>IP</td>
          <td>{{ info.last_access.ip }}</td>
        </tr>
        <tr>
          <td>Результат</td>
          <td>{{ info.last_access.result }}</td>
        </tr>
        <tr>
          <td>Приложение</td>
          <td>
            {{ getAppString() }}
          </td>
        </tr>
        <tr>
          <td>Версия</td>
          <td>{{ info.last_access.info }}</td>
        </tr>
        <tr>
          <td>Платформа</td>
          <td>{{ info.last_access.platform }}</td>
        </tr>
        <tr>
          <td>user_agent</td>
          <td>{{ info.last_access.user_agent }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMCustomerLKInfo",
  props: {
    customer_id: {
      type: Number,
    },
  },
  data() {
    return {
      info: { last_access: {} },
      isLoading: false,
    };
  },
  watch: {
    customer_id: {
      immediate: true,
      handler(newValue) {
        if (newValue !== undefined) {
          this.fetchItem(newValue);
        }
      },
    },
  },
  methods: {
    getAppString() {
      switch (this.info.last_access.api_client_id) {
        case "ru.yumauto.lk.web-app":
          return "Web";
        case "ru.yumauto.lk.android-cordova-app":
          return "Android";
        default:
          return this.info.last_access.api_client_id;
      }
    },
    // Network
    async fetchItem(customer_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getCustomerLKInfo(customer_id);
        this.info = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
