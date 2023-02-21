<template>
  <WPanelContainer size="full" style="height: 100%">
    <WPanel size="22em" style="border-right: 1px solid rgba(34, 36, 38, 0.15)">
      <!-- Form -->
      <form class="ui form">
        <UITextfield v-model.trim.lazy="user.username">Имя</UITextfield>
        <!-- <UITextfield v-model.trim.lazy="user.email" readonly>E-Mail</UITextfield> -->
        <UITextfield v-model.trim.lazy="user.password">Пароль</UITextfield>

        <!-- <div class="field">
        <div class="ui sub header">Права</div>
        <select name="rights" id="rights_dropdown" multiple class="ui fluid dropdown">
          <option value>Права</option>
          <option :value="item" v-for="item in authRights" :key="item" selected>{{ item }}</option>
      </select>-->

        <!-- <a class="ui label" v-for="item in authRights" :key="item">
          {{ item }}
          <i class="delete icon"></i>
      </a>-->
        <!-- </div> -->
        <div class="ui hidden divider"></div>
        <input
          name="submit"
          type="submit"
          value="Сохранить"
          class="ui small compact primary submit button"
          @click.prevent="updateUser"
        />
        <div class="ui hidden divider"></div>
      </form>
    </WPanel>

    <!-- Second Column -->
    <!-- <div class="ten wide column"> -->
    <WPanel size="full">
      <!-- info -->
      <table class="ui compact small collapsing table" style="border: 0">
        <tbody>
          <tr>
            <td>E-Mail:</td>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <td>Права:</td>
            <td>
              <UIBadge
                v-for="item in authRights"
                :key="item"
                :text="item"
                style="margin: 0.2rem 0.25rem"
                :value="item"
              />
            </td>
          </tr>
          <!-- <tr>
            <td>Филиалы:</td>
            <td>{{ user.branches }}</td>
          </tr>
          <tr>
            <td>Инвесторы:</td>
            <td>{{ user.investors }}</td>
          </tr> -->
          <tr>
            <td>Дата создания:</td>
            <td>{{ $filters.date(user.created_ts) }}</td>
          </tr>
          <tr>
            <td>Последнее обновление:</td>
            <td>{{ $filters.date(user.updated_ts) }}</td>
          </tr>
        </tbody>
      </table>
    </WPanel>
  </WPanelContainer>
  <!-- grid -->
  <!-- </div> -->
</template>

<script>
import apiService from "@/services/api.service.js";
import WPanelContainer from "@/components/WPanelContainer.vue";
import WPanel from "@/components/WPanel.vue";

export default {
  name: "CMPrefsProfile",

  components: {
    WPanelContainer,
    WPanel,
  },

  data() {
    return {
      user: {},
      isLoading: false,
    };
  },

  computed: {
    items() {
      return this.report;
    },
    authData() {
      return this.$store.getters["auth/getAuthData"];
    },
    authRights() {
      return this.$store.getters["auth/getAuthData"] ? this.$store.getters["auth/getAuthData"].rights : [];
    },
  },

  watch: {
    authData(newValue) {
      if (newValue !== null) {
        this.fetchUserProfile(this.authData.userid);
      }
    },
  },

  mounted() {
    if (this.authData !== null) {
      this.fetchUserProfile(this.authData.userid);
    }
  },

  methods: {
    updateUser() {
      // consol.log(id);
      // let user = this.users.find(obj => {
      //   return obj.id == id;
      // });
      this.fetchUpdateProfile(this.user);
    },

    // Network
    async fetchUserProfile(id) {
      this.isLoading = true;

      try {
        let result = await apiService.getUserProfile(id);
        this.user = result;
        // console.warn(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    // Update User
    async fetchUpdateProfile(user) {
      this.isLoading = true;

      try {
        await apiService.updateUserProfile(user);
        this.fetchUserProfile(this.authData.userid);
        this.$UIService.showSuccess("Профиль обновлён");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
