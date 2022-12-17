<template>
  <div
    class="stat-cell"
    :class="{ red: condition == 'bad', green: condition == 'good', yellow: condition == 'decent' }"
  >
    <!-- <div v-if="value == undefined" class="ui active centered inline small loader"></div> -->
    <div class="value">
      <i v-if="icon" :class="icon" class="icon"></i>
      {{ formatted_value }}
    </div>
    <div class="label">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: "CMStatisticsCell",
  props: {
    name: String,
    value: [String, Number],
    icon: String,
    format: {
      type: String,
      default: "",
    },
    condition: {
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    formatted_value() {
      if (this.value === null) {
        return "Н/Д";
      }
      switch (this.format) {
        case "money":
          return this.$filters.money(this.value, false, true) + " ₽";
        case "date":
          return this.$filters.date(this.value);
        case "percent":
          return this.value + "%";
        default:
          break;
      }
      return this.value;
    },
  },
};
</script>

<style>
.stat-cell {
  background-color: rgba(248, 248, 248, 1);
  padding: 1em;
  border-radius: 6px;
  margin: 0.5em;
}

.stat-cell.red {
  background-color: rgb(248, 226, 226);
}

.stat-cell.green {
  background-color: rgb(226, 248, 229);
}

.stat-cell.yellow {
  background-color: rgb(253, 238, 207);
}

.stat-cell > .value {
  font-size: 2rem !important;
  text-align: center;
  line-height: 1em;
}
.stat-cell .label {
  font-size: 1em;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
  text-transform: uppercase;
  text-align: center;
}

i.icon,
i.icons {
  vertical-align: inherit;
}
</style>
