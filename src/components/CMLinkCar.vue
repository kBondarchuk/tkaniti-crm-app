<template>
  <a
    v-if="carId > 0"
    title="Переход на страницу автомобиля"
    class="badge"
    :class="{ red: warnings > 0 }"
    style="display: inline-flex; align-items: center"
    @click.stop="go"
  >
    <i class="car icon grow"></i>
    <!-- <i class="attention red icon" style="margin-left: 0.2em" v-if="warnings > 0"></i> -->
    <!-- <span v-if="bitCount(warnings) > 1" style="margin-left: 0.4em; line-height: 0.5; font-size: 0.8em">
      {{ bitCount(warnings) }}
    </span> -->
  </a>
</template>

<script>
import { bitCount } from "@/utils/utils.js";

export default {
  name: "CMLinkCar",

  props: {
    carId: {
      type: Number,
      default: null,
    },
    warnings: {
      type: Number,
      default: 0,
    },
    path: {
      type: String,
      default: "cars_details",
    },
  },

  methods: {
    bitCount(n) {
      return bitCount(n);
    },
    go() {
      this.$router.push({
        name: this.path,
        params: { id: this.carId },
      });
    },
  },
};
</script>

<style scoped>
a.badge {
  padding: 0.3em 0.4em;
  color: rgba(0, 0, 0, 0.6);
  /* background: #e8e8e8; */
  background: rgba(0, 0, 0, 0.02);
  border-radius: 3px;
  font-weight: bold;
  white-space: nowrap;
}

a.badge.red {
  /* background-color: #db2828;
  color: #fff; */
  background-color: #fff6f6;
  color: #db2828;
}

a.badge > i.icon:hover {
  color: #db2828;
  text-decoration: none;
  cursor: pointer;
}

a.badge.red > i.icon:hover {
  color: inherit;
  cursor: pointer;
}

/* span.ui.label > i.icon:hover {
  color: #db2828;
  text-decoration: none;
}

span.ui.label.red > i.icon {
  color: #fff;
  text-decoration: none;
} */

.badge > .icon {
  margin: 0 0 0 0;
}
/*
.ui.label {
  font-size: 12px;
  line-height: 1;
}

span.ui.label {
  margin-top: -0.2em;
  margin-bottom: -0.1em;
} */
</style>
