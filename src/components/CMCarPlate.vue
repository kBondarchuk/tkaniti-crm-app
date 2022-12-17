<template>
  <div v-if="value != null" class="plate" :style="style">
    <div v-if="value != null" class="number">{{ value.substring(0, 6) }}</div>
    <div v-if="value != null" class="region">{{ value.substring(6) }}</div>
  </div>
</template>

<script>
import { plate_number_regx } from "@/utils/regexps";

export default {
  name: "CMCarPlate",

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  computed: {
    style() {
      if (plate_number_regx.test(this.value)) {
        return "";
      } else {
        return "color: red;";
      }
    },
  },
};
</script>

<style scoped>
.plate {
  /* border: 1px solid rgba(0, 0, 0, 0.65); */

  display: inline-block;
  border-radius: 3px;
  margin: -2px 0;
  font-variant: small-caps;
  white-space: nowrap;
}

.number {
  display: inline-block;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-top: solid 2px rgba(0, 0, 0, 0.65);
  border-right: solid 0px rgba(0, 0, 0, 0.65);
  border-bottom: solid 2px rgba(0, 0, 0, 0.65);
  border-left: solid 2px rgba(0, 0, 0, 0.65);
  padding: 0 7px;
  font-weight: 700;
}
.region {
  border-top: solid 2px rgba(0, 0, 0, 0.65);
  border-right: solid 2px rgba(0, 0, 0, 0.65);
  border-bottom: solid 2px rgba(0, 0, 0, 0.65);
  border-left: solid 2px rgba(0, 0, 0, 0.65);
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  display: inline-block;
  padding: 0 4px;
  font-weight: 700;
}
</style>
