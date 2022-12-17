<template>
  <div>
    <!-- Loading block -->
    <div v-if="isLoading && !prefs.length" class="ui center aligned disabled segment">
      <div class="ui active centered inline loader"></div>
    </div>
    <!-- Empty List  -->
    <div v-if="!isLoading && !prefs.length" class="ui disabled center aligned segment">
      <span style="font-size: 1.3em">Пусто</span>
    </div>
    <!-- Table -->
    <table
      v-if="prefs.length"
      class="ui very compact collapsing small selectable table form"
      :class="{ loading: isLoading }"
    >
      <thead>
        <tr>
          <th>Параметр</th>
          <!-- <th>Параметр</th> -->
          <th>Значение</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in prefs" :key="item.key" :class="{ 'text-color-red': item.access_right == 'sysadmin' }">
          <!-- Description -->
          <td v-if="item.description">
            {{ item.description }}
          </td>
          <td v-else>
            {{ item.key }}
          </td>
          <!-- Value -->
          <td v-if="item.decimal_value !== null">
            <UIInputMoney v-model.lazy="item.decimal_value" />
          </td>
          <td v-if="item.int_value !== null">
            <UIInputNumber v-model.lazy="item.int_value" />
          </td>
          <td v-if="item.string_value !== null">
            <UITextfield v-model.trim.lazy="item.string_value" />
          </td>
          <td class="right aligned">
            <button class="ui compact icon button" @click="saveParam(item)">
              <i class="check green icon"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMPrefsParams",

  components: {},

  data() {
    return {
      prefs: [],
      newUser: {},
      isLoading: false,
    };
  },

  computed: {
    authRights() {
      return this.$store.getters["auth/getAuthRights"];
    },
  },

  mounted() {
    this.fetchPrefs();
  },

  methods: {
    // toggleBlock(id) {
    //   console.log(id);
    //   if (document.getElementById("toggle-" + id).checked) {
    //     // set to 1
    //     this.users.find((obj) => {
    //       return obj.id == id;
    //     }).blocked = 0;
    //   } else {
    //     // set to 0
    //     this.users.find((obj) => {
    //       return obj.id == id;
    //     }).blocked = 1;
    //   }
    // },
    saveParam(item) {
      console.log(item);
      // let user = this.users.find((obj) => {
      //   return obj.id == id;
      // });
      this.fetchUpdateValue(item);
    },
    checkAccess(role) {
      return this.authRights.includes(role);
    },
    checkMenuItem(item) {
      return this.checkAccess(item.access_right) || item.access_right === null;
    },
    parseParams(params) {
      const parsedMenu = [];

      params.forEach((item) => {
        if (this.checkMenuItem(item)) {
          parsedMenu.push(item);
        }

        return true;
      });
      console.log(parsedMenu);
      return parsedMenu;
    },
    // Network
    async fetchPrefs() {
      this.isLoading = true;

      try {
        let result = await apiService.getPrefs();
        console.log(result);
        this.prefs = this.parseParams(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    // Update param
    async fetchUpdateValue(item) {
      this.isLoading = true;
      // console.log(user);

      try {
        await apiService.updatePrefValue(item);
        this.fetchPrefs();

        this.$UIService.showSuccess("Параметр обновлён! ", item.description);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
