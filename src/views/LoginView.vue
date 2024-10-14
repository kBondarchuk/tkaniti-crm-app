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
                :class="{ 'double loading': isLoading }"
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

            <div v-if="message" class="ui inverted message floating" style="margin-left: -5em; margin-right: -5em">
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
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/uiStore";
import Alerts from "@/utils/alerts";
import Animations from "@/utils/animations";

// import UITransition from "@/components/UITransition.vue";
// import XThemeManager from "@/components/XThemeManager.vue";

export default {
  name: "LoginView",

  components: {
    // UITransition,
    // XThemeManager,
  },

  setup() {
    if (window.matchMedia) {
      // Check if the dark-mode Media-Query matches
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        // Dark
        console.warn("🌜 DARK MODE");
        document.getElementsByTagName("meta")["theme-color"].content = "rgb(32, 32, 32)";
      } else {
        // Light
        console.warn("🌞 LIGHT MODE");
        document.getElementsByTagName("meta")["theme-color"].content = "#c1c2c6";
      }
    } else {
      // Default (when Media-Queries are not supported)
      console.warn("MODES NOT SUPPORTED");
    }

    const uiStore = useUiStore();
    const authStore = useAuthStore();
    const router = useRouter();
    return { uiStore, authStore, router };
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
      return this.authStore.isLoading;
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

      //   .dispatch("auth/login", { login: login, password: password })
      this.authStore
        .login({ login: login, password: password })
        .then((status) => {
          console.log("[LOGIN]: success: " + status);

          if (status == 2) {
            this.message = "Требуется смена пароля. Введите новый пароль дважды.";

            this.needPasswordChange = true;
            Alerts.showWarning("Требуется смена пароля!");
          } else {
            this.error = "";

            // Check saved path
            const savedPath = this.uiStore.getSavedPath();
            console.log("[LoginView]: savedPath: ", savedPath);

            if (savedPath != null) {
              console.warn("[LoginView]: Redirecting to savedPath: ", savedPath);
              this.uiStore.setSavedPath(null);
              this.router.replace({ path: savedPath });
            } else {
              this.router.replace({ path: "/" });
              Alerts.showSuccess("Добро пожаловать!");
            }
          }
        })
        .catch((error) => {
          const element = document.querySelector(".column");

          Animations.animate(element, Animations.Names.ShakeHorizontal);

          document.getElementsByTagName("meta")["theme-color"].content = "rgb(212, 18, 0)";
          Alerts.showNetworkError(error);
        });
    },
    updatePassword() {
      let user = {
        id: this.authStore.getAuthData.userid,
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
        Alerts.showSuccess("Пароль обновлён");
        this.needPasswordChange = false;
        this.router.push({ path: "/logoff" });
      } catch (error) {
        Alerts.showNetworkError(error);
      }
      // this.isLoading = false;
    },
  },
};
</script>

<style>
@media (prefers-color-scheme: light) {
  body.page-login {
    /* background: #464646; */
    background: #c1c2c6;
    /* //#d8d8d8; */
  }
}

@media (prefers-color-scheme: dark) {
  body.page-login {
    background: rgb(32, 32, 32);
  }
}
</style>

<style scoped>
.login {
  height: 100%;
  min-height: 100vh;
}

@media (prefers-color-scheme: light) {
  .login {
    /* background-color: rgba(218, 218, 218, 0.185);
  background: -webkit-radial-gradient(center, #fafafa, #c1c2c6);
  background: -moz-radial-gradient(center, #fafafa, #c1c2c6);
  */
    background: #fafafa;
    background: radial-gradient(ellipse at center, #fafafa 30%, #c1c2c6 70%);
  }
}

@media (prefers-color-scheme: dark) {
  input[type="text"]#email {
    background-color: rgb(48, 48, 48);
    color: white;
  }

  input#password,
  input#password1,
  input#password2 {
    background-color: rgb(48, 48, 48);
    color: white;
  }

  input[type="text"]#email:not(:focus) {
    border-color: rgb(64, 64, 64);
  }

  input#password:not(:focus),
  input#password1:not(:focus),
  input#password2:not(:focus) {
    border-color: rgb(64, 64, 64);
  }

  i.icon:before {
    color: white;
  }

  button#login {
    background-color: rgb(51, 118, 205);
  }
  button#login {
    color: white;
  }
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
  border-radius: 6px;
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

button#login {
  border-radius: 6px;
}
</style>
