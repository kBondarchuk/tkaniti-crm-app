<template>
  <div class="stat-cell graph" style="display: flex; flex-direction: column; position: relative">
    <CMChartLine :chart-data="chartdata" class="graph" :class="{ transparent: loading }" @legend="handleLegend" />
    <div
      v-if="loading"
      class="ui active inline slow grey loader"
      style="display: block; position: absolute; top: 35%; left: 50%; z-index: 10"
    />
    <!-- <div class="legend">&nbsp;</div> -->
    <div class="label">{{ name }}</div>
  </div>
</template>

<script>
import CMChartLine from "@/components/CMChartLine.vue";

export default {
  name: "CMStatisticsLineGraphCell",

  components: {
    CMChartLine,
  },

  props: {
    name: {
      type: String,
      default: "",
    },
    chartdata: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      legend: "",
    };
  },

  methods: {
    handleLegend(legend) {
      this.legend = legend;
    },
  },
};
</script>

<style lang="css">
.transparent {
  opacity: 0;
}

.graph {
  min-height: 10em;
  flex-basis: 10em;
}

div.legend {
  /* background-color: white; */
  flex: 1;
}
div.legend > ul {
  list-style-type: none;
  padding-inline-start: 0;
  text-align: center;
  /* background-color: red; */
}

div.legend > ul > li {
  display: inline-block;
  margin-right: 0.5em;

  /* background-color: red; */
}

div.legend > ul > li > span {
  width: 1em;
  margin-right: 0.5em;
  border-radius: 1em;

  /* background-color: red; */
}

div.legend > ul > li > span:before {
  content: "\00a0\00a0\00a0\00a0\00a0";
  width: 1em;
}
</style>
