<template>
  <div v-if="xmas">
    <img src="/images/theme/christmas.png" style="position: absolute; bottom: 0; right: 25%" />
    <img src="/images/theme/snowman.png" style="position: absolute; bottom: 0; right: 20%; width: 80px; height: 80px" />
  </div>
</template>

<script>
export default {
  name: "XThemeManager",

  data() {
    return {
      xmas: false,
    };
  },

  mounted() {
    this.makeSnow();
  },

  beforeUnmount() {
    // cleanup
    this.freezeSnow();
  },

  methods: {
    makeSnow() {
      var month = new Date().getMonth();
      var day = new Date().getDate();
      // console.log(day, month);

      if (!((month == 11 && day > 20) || (month == 1 && day < 10))) return;

      this.xmas = true;
      console.log("Theme condition detected!");

      //
      this.$nextTick(function () {
        // DOM updated

        if (!window.snowStorm) {
          console.log("Load theme..");

          let snowstorm = document.createElement("script");
          snowstorm.setAttribute("src", "/libs/snowstorm.js");
          snowstorm.setAttribute("async", "true");
          document.head.appendChild(snowstorm);

          snowstorm.onload = () => {
            window.snowStorm.autoStart = false;
            // window.snowStorm.toggleSnow();
            console.log("Load theme..", window.snowStorm.active);

            if (!window.snowStorm.active) {
              console.log("Starting theme..");

              window.snowStorm.toggleSnow();
            }
          };
        } else {
          console.log("Theme already loded - resuming!");

          window.snowStorm.resume();
        }
      });
    },

    freezeSnow() {
      if (this.xmas) {
        console.log("Freezing theme..");

        window.snowStorm.freeze();
      }
    },
  },
};
</script>
