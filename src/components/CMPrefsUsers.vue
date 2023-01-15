<template>
  <div>
    <!-- Loading block -->
    <div v-if="isLoading && !users.length" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !users.length" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Пусто</span>
    </div>
    <!-- Table -->
    <table v-if="users.length" class="ui very compact very basic small table form" :class="{ loading: isLoading }">
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>EMail</th>
          <th>Пароль</th>
          <th>Филиалы</th>
          <th>Инвесторы</th>
          <th class="center aligned">Доступ</th>
          <th class="center aligned">Дата</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr class="gray_bg">
          <td>{{ newUser.id }}</td>
          <td>
            <UITextfield v-model.trim.lazy="newUser.username"></UITextfield>
          </td>
          <td>
            <UITextfield v-model.trim.lazy="newUser.email"></UITextfield>
          </td>
          <td>
            <UITextfield v-model.trim.lazy="newUser.password"></UITextfield>
          </td>
          <td>
            <UITextfield v-model.trim.lazy="newUser.branches"></UITextfield>
          </td>
          <td>
            <UITextfield v-model.trim.lazy="newUser.investors"></UITextfield>
          </td>
          <td>{{ newUser.blocked }}</td>
          <td>{{ newUser.created_ts }}</td>

          <td class="right aligned">
            <button class="ui compact primary icon button" @click="createUser">
              <i class="plus icon"></i>
            </button>
          </td>
        </tr>
        <!-- rights -->
        <tr class="gray_bg">
          <td class="no_top_borders">Права</td>
          <td colspan="6" class="no_top_borders">
            <UITextAria v-model.trim.lazy="newUser.rights" :rows="3" />
          </td>
          <td class="no_top_borders"></td>
        </tr>

        <tr>
          &nbsp;
        </tr>

        <template v-for="(user, index) in users" :key="'a' + index">
          <!--  -->
          <tr :class="{ stripe1: index % 2, stripe2: !(index % 2) }" class="">
            <td class="no_top_borders top_pad">{{ user.id }}</td>
            <td class="no_top_borders top_pad">
              <UITextfield v-model.trim.lazy="user.username" />
            </td>
            <td class="no_top_borders top_pad">
              <UITextfield v-model.trim.lazy="user.email" />
            </td>
            <td class="no_top_borders top_pad">
              <UITextfield v-model.trim.lazy="user.password" />
            </td>
            <td class="no_top_borders top_pad">
              <UITextfield v-model.trim.lazy="user.branches" />
            </td>
            <td class="no_top_borders top_pad">
              <UITextfield v-model.trim.lazy="user.investors" />
            </td>
            <td class="right aligned no_top_borders top_pad" @click.stop="toggleBlock(user.id)">
              <div class="ui fitted toggle checkbox">
                <input :id="'toggle-' + user.id" type="checkbox" name="public" :checked="user.blocked == 0 ? 1 : 0" />
                <label></label>
              </div>
            </td>
            <td class="center aligned no_top_borders top_pad" style="font-size: 0.8em">
              {{ $filters.date(user.created_ts) }}
              <br />
              {{ $filters.date(user.updated_ts) }}
            </td>
            <td class="right aligned no_top_borders top_pad">
              <button class="ui compact icon button" @click="updateUser(user.id)">
                <i class="check green icon"></i>
              </button>
            </td>
          </tr>
          <!-- rights -->
          <tr :class="{ stripe1: index % 2, stripe2: !(index % 2) }" class="bottom_pad">
            <td class="no_top_borders">Права</td>
            <td colspan="6" class="no_top_borders">
              <UITextAria v-model="user.rights" :rows="3" />
            </td>
            <td class="no_top_borders" colspan="2"></td>
          </tr>

          <!-- Spacer -->
          <tr>
            &nbsp;
          </tr>
          <!--  -->
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMPrefsUsers",
  data() {
    return {
      users: [],
      newUser: {},
      isLoading: false,
    };
  },
  computed: {
    items() {
      return this.report;
    },
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    toggleBlock(id) {
      // console.log(id);
      if (document.getElementById("toggle-" + id).checked) {
        // set to 1
        this.users.find((obj) => {
          return obj.id == id;
        }).blocked = 0;
      } else {
        // set to 0
        this.users.find((obj) => {
          return obj.id == id;
        }).blocked = 1;
      }
    },
    createUser() {
      // console.log(this.newUser);
      this.fetchCreateUser();
    },
    updateUser(id) {
      // console.log(id);
      let user = this.users.find((obj) => {
        return obj.id == id;
      });
      this.fetchUpdateUser(user);
    },
    // Network
    async fetchUsers() {
      this.isLoading = true;
      try {
        let result = await apiService.getAuthUsers();
        this.users = result.map(function (item) {
          delete item.password;
          return item;
        });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    // Create User
    async fetchCreateUser() {
      this.isLoading = true;
      try {
        let result = await apiService.createAuthUser(this.newUser);
        this.$UIService.showSuccess(result);
        this.newUser = {};
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    // Update User
    async fetchUpdateUser(user) {
      this.isLoading = true;
      try {
        await apiService.updateAuthUser(user);
        this.fetchUsers();
        this.$UIService.showSuccess("Изменения сохранены");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
td.no_top_borders {
  border-top: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 1rem !important;
}
td.top_pad {
  padding-top: 1.2em !important;
}
tr.bottom_pad > td {
  padding-bottom: 1.5em !important;
}

.stripe1 {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
.stripe2 {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>
