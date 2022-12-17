<template>
  <div class="stat-cell graph" style="display: flex; flex-direction: column">
    <CMChartRainbow :chart-data="chartData" class="graph" @legend="handleLegend" />
    <!-- <div class="legend" v-html="legend">
      sdfds sdf sf sdjf ksdjhf sdf hksdjhf ksdfsdhf kjdshf jdshfkdjfhsdkjf hdksjf hds fhdks fhdskjfhskdj
    </div> -->
    <div class="label">{{ name }}</div>
  </div>
</template>

<script>
import CMChartRainbow from "@/components/CMChartRainbow.vue";

export default {
  name: "CMStatisticsGraphCell",

  components: {
    CMChartRainbow,
  },

  props: {
    name: {
      type: String,
      default: "",
    },
    chartData: {
      type: Object,
      default: () => {},
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
