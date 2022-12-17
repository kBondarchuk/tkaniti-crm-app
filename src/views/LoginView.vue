<template>
  <UITransition mode="out-in" appear>
    <div class="login">
      <div class="ui middle aligned center aligned grid">
        <div class="column" style="zoom: 1.2">
          <form class="ui form" :class="{ error: error }">
            <!-- login form -->
            <div v-if="!needPasswordChange" class="ui">
              <div class="field" style="margin-bottom: 0">
                <div class="ui left icon input" :class="{ disabled: isLoading }">
                  <i class="user icon" style="z-index: 2"></i>
                  <input
                    id="email"
                    v-model="login"
                    type="text"
                    name="email"
                    placeholder="Логин"
                    autocomplete="off"
                    autofocus
                  />
                </div>
              </div>
              <div class="field">
                <div class="ui left icon input" :class="{ disabled: isLoading }">
                  <i class="lock icon" style="z-index: 2"></i>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    autocomplete="off"
                  />
                </div>
              </div>

              <button
                id="login"
                class="ui submit fluid button"
                :class="{ loading: isLoading }"
                :disabled="!isReady || isLoading"
                @click.prevent="submit"
              >
                Войти
              </button>
              <div class="ui error message">
                <div class="header">ОШИБКА</div>
                <p>{{ error }}</p>
              </div>
            </div>
            <!-- /login form -->

            <!-- password change -->
            <div v-if="needPasswordChange" class="ui">
              <div class="field">
                <div class="ui left icon input" :class="{ disabled: isLoading }">
                  <i class="lock icon"></i>
                  <input
                    id="password1"
                    v-model="password1"
                    type="password"
                    name="password1"
                    placeholder="Новый пароль"
                    autocomplete="off"
                  />
                </div>
              </div>

              <div class="field">
                <div class="ui left icon input" :class="{ disabled: isLoading }">
                  <i class="lock icon"></i>
                  <input
                    id="password2"
                    v-model="password2"
                    type="password"
                    name="password2"
                    placeholder="Повторите пароль"
                    autocomplete="off"
                  />
                </div>
              </div>

              <button
                id="login"
                class="ui submit compact primary button"
                :class="{ loading: isLoading }"
                :disabled="password1 != password2 || isLoading"
                @click.prevent="updatePassword"
              >
                Сохранить
              </button>
              <div class="ui error message">
                <div class="header">ОШИБКА</div>
                <p>{{ error }}</p>
              </div>
            </div>
            <!-- /password change -->

            <div v-if="message" class="ui message floating" style="margin-left: -5em; margin-right: -5em">
              {{ message }}
            </div>
          </form>
        </div>
      </div>
      <!-- xmas -->
      <!-- <XThemeManager /> -->
      <!-- /xmas -->
    </div>
  </UITransition>
</template>

<script>
import apiService from "@/services/api.service.js";

import UITransition from "@/components/UITransition.vue";
// import XThemeManager from "@/components/XThemeManager.vue";

export default {
  name: "LoginView",
  components: {
    UITransition,
    // XThemeManager,
  },
  data() {
    return {
      login: "",
      password: "",
      error: "",
      message: "",
      needPasswordChange: false,
      password1: "",
      password2: "",
      focusFlag: 0,
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters["auth/isLoading"];
    },
    isReady() {
      return this.login.length > 1 && this.password.length > 1;
    },
  },
  mounted() {
    this.$UIService.setHtmlTitle("Вход", false);
  },
  methods: {
    submit() {
      let login = this.login;
      let password = this.password;

      this.$store
        .dispatch("auth/login", { login: login, password: password })
        .then((status) => {
          console.log("[LOGIN]: success: " + status);

          if (status == 2) {
            this.message = "Требуется смена пароля. Введите новый пароль дважды.";

            this.needPasswordChange = true;
            this.$UIService.showWarning("Требуется смена пароля!");
          } else {
            this.error = "";

            // Check saved path
            const savedPath = this.$store.getters["getSavedPath"];
            console.warn("[LoginView]: Redirecting to savedPath: ", savedPath);

            if (savedPath !== null) {
              this.$store.commit("setSavedPath", null);
              this.$router.push({ path: savedPath });
            } else {
              this.$router.push({ path: "/" });
              this.$UIService.showSuccess("Добро пожаловать!");
            }
          }
        })
        .catch((error) => {
          $(".column").transition("shake");
          this.$UIService.showNetworkError(error);
        });
    },
    updatePassword() {
      let user = {
        id: this.$store.getters["auth/getAuthData"].userid,
        password: this.password1,
        password_required: 0,
      };
      this.fetchUpdateUserProfile(user);
    },

    // Networking
    // Update User
    async fetchUpdateUserProfile(user) {
      // this.isLoading = true;

      try {
        await apiService.updateUserProfile(user);
        this.$UIService.showSuccess("Пароль обновлён");
        this.needPasswordChange = false;
        this.$router.push({ path: "/logoff" });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      // this.isLoading = false;
    },
  },
};
</script>

<style>
body.page-login {
  background-color: #464646;
  /* //#d8d8d8; */
}
</style>

<style scoped>
.login {
  /* background-color: rgba(218, 218, 218, 0.185); */
  background: #fafafa;
  background: -webkit-radial-gradient(center, #fafafa, #c1c2c6);
  background: -moz-radial-gradient(center, #fafafa, #c1c2c6);
  background: radial-gradient(ellipse at center, #fafafa 30%, #c1c2c6 100%);

  height: 100%;
  min-height: 100vh;
}
.grid {
  height: 100%;
  min-height: 100vh;
  margin: 0;
}
.column {
  max-width: 16em;
}

/* button#login {
  font-weight: 400;
} */

input[type="text"]#email,
#password {
  border-radius: 4px;
  padding-top: 9px;
  padding-bottom: 9px;
}

input[type="text"]#email {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

input#password {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: -1px;
}

input[type="text"]#email:focus,
input#password:focus {
  z-index: 1;
}

/* button#login {
  width: 60%;
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 0 0px rgba(34, 36, 38, 0.15) inset;
  color: #fff;
}

button:hover#login {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 1);
}

input[type="text"]#email,
#password {
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
}

input[type="text"]:focus#email,
input[type="password"]:focus#password {
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
} */

/* #myCanvas {
  position: fixed;
  z-index: -1;
  left: 0;
  top: 0;
  width: 100%;
  filter: blur(150px);
  -webkit-filter: blur(150px);
  -moz-filter: blur(150px);
  -o-filter: blur(150px);
  -ms-filter: blur(150px);
} */
</style>
