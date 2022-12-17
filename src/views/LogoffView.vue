<template>
  <UITransition mode="out-in" appear>
    <div class="login">
      <div class="ui middle aligned center aligned grid">
        <div class="column">ВЫХОД...</div>
      </div>
    </div>
  </UITransition>
</template>

<script>
import UITransition from "@/components/UITransition.vue";

export default {
  name: "LogoffView",
  components: {
    UITransition,
  },
  data() {
    return {
      login: "",
      password: "",
      error: "",
    };
  },
  created() {
    this.$store
      .dispatch("auth/logoff")
      .then((status) => {
        console.log("[LOGOFF]: success: " + status.message);
        // this.$UIService.showMessage(status.message);
        this.$router.push({ path: "/login" });
      })
      .catch(() => {
        // this.$UIService.showNetworkError(error);
        this.$router.push({ path: "/login" });
      });
  },
};
</script>

<style scoped>
.login {
  background-color: rgba(218, 218, 218, 0.185);
  height: 100%;
  min-height: 100vh;
}
.grid {
  height: 100%;
  min-height: 100vh;
  margin: 0;
}
.column {
  max-width: 14em;
}
</style>
