<template>
  <div>
    <!-- Form -->
    <form class="ui form" style="width: 22em">
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
    <!-- info -->
    <table class="ui compact small definition collapsing table">
      <tbody>
        <tr>
          <td>E-Mail:</td>
          <td>{{ user.email }}</td>
        </tr>
        <tr>
          <td>Права:</td>
          <td>
            <UIBadge v-for="item in authRights" :key="item" :text="item" style="margin: 0.2rem 0.25rem" :value="item" />
          </td>
        </tr>
        <tr>
          <td>Филиалы:</td>
          <td>{{ user.branches }}</td>
        </tr>
        <tr>
          <td>Инвесторы:</td>
          <td>{{ user.investors }}</td>
        </tr>
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

    <!-- <div style="font-size: 0.9em">
      <b>E-Mail: </b> {{ user.email }} <br />
      <b>Права: </b>
      <span :value="item" v-for="item in authRights" :key="item">&lt;{{ item }}&gt;&nbsp;</span>
      <br />
      <b>Филиалы: </b>
      <span>{{ user.branches }}</span>
      <br />
      <b>Дата создания: </b>
      $filters.date(user.created_ts )
      <br />
      <b>Последнее обновление: </b>
      $filters.date(user.updated_ts )
    </div> -->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMPrefsProfile",

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
