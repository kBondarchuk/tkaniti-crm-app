<template>
  <PagesPage>
    <!-- info -->
    <table class="ui compact small collapsing definition table">
      <tbody>
        <tr v-if="ping.app_params">
          <td>SRV_APP_MODE</td>
          <td>{{ ping.app_params.SRV_APP_MODE }}</td>
        </tr>
        <tr v-if="ping.app_params">
          <td>SRV_INI_PATH</td>
          <td>{{ ping.app_params.SRV_INI_PATH }}</td>
        </tr>
        <tr>
          <td>mysql_crm_user_id</td>
          <td>{{ ping.mysql_crm_user_id }}</td>
        </tr>
        <tr>
          <td>PHP time</td>
          <td>{{ ping.time }}</td>
        </tr>
        <tr>
          <td>MySQL time</td>
          <td>{{ ping.mysql_time }}</td>
        </tr>
        <tr>
          <td>API_VERSION</td>
          <td>{{ ping.server_params.API_VERSION }}</td>
        </tr>
        <tr>
          <td>OS_VERSION</td>
          <td>{{ ping.server_params.OS_VERSION }}</td>
        </tr>
        <tr>
          <td>HTTPD_VERSION</td>
          <td>{{ ping.server_params.HTTPD_VERSION }}</td>
        </tr>
        <tr>
          <td>PHP_VERSION</td>
          <td>{{ ping.server_params.PHP_VERSION }}</td>
        </tr>
        <tr>
          <td>MYSQL_VERSION</td>
          <td>{{ ping.server_params.MYSQL_VERSION }}</td>
        </tr>
        <tr>
          <td>REQUEST_SCHEME</td>
          <td>{{ ping.server_params.REQUEST_SCHEME }}</td>
        </tr>
        <tr>
          <td>HTTPS</td>
          <td>{{ ping.server_params.HTTPS }}</td>
        </tr>
        <tr>
          <td>PHP_INI_FILE</td>
          <td>{{ ping.server_params.PHP_INI_FILE }}</td>
        </tr>
        <tr>
          <td>PHP_EXTENSIONS</td>
          <td>{{ ping.server_params.PHP_EXTENSIONS }}</td>
        </tr>
        <tr>
          <td>php_time_zone</td>
          <td>{{ ping.server_params.php_time_zone }}</td>
        </tr>
      </tbody>
    </table>

    <!-- MySQL -->
    <table class="ui compact small collapsing definition table">
      <tbody>
        <tr v-for="(value, key) in ping.server_params.MYSQL" :key="key">
          <td>{{ key }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>
    <!--  -->
  </PagesPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import PagesPage from "@/components/PagesPage.vue";

export default {
  name: "CMPrefsSystem",

  components: { PagesPage },

  data() {
    return {
      ping: { server_params: { MYSQL: {} }, app_params: {} },
      isLoading: false,
    };
  },

  computed: {
    authData() {
      return this.$store.getters["auth/getAuthData"];
    },
    authRights() {
      return this.$store.getters["auth/getAuthData"] ? this.$store.getters["auth/getAuthData"].rights : [];
    },
  },

  // watch: {
  //   authData(newValue) {
  //     if (newValue !== null) {
  //       this.fetchUserProfile(this.authData.userid);
  //     }
  //   },
  // },

  mounted() {
    this.fetchPing();
  },

  methods: {
    // Network
    async fetchPing() {
      this.isLoading = true;

      try {
        ({ data: this.ping } = await apiService.ping());
        // console.warn(this.ping);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
