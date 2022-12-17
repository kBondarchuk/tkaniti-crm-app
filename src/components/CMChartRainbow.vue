<template>
  <Doughnut :chart-data="chartData" :chart-options="chartOptions" />
</template>

<script>
// import "chart.js/auto";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

let _chartOptions = {
  title: {
    display: false,
    text: "ГРАФИК",
    position: "bottom",
    fontColor: "#000",
    fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
    fontSize: "14",
  },

  // legend: {
  //   display: false,
  //   position: "bottom",
  // },

  responsive: true,
  maintainAspectRatio: false,

  rotation: -90,
  circumference: 180,

  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          let data = context.dataset.data;
          let total = 0;

          data.map((data) => {
            total += Number(data);
          });

          var currentValue = context.parsed;
          var percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
          return currentValue + " (" + percentage + "%)";
        },
        title: function (context) {
          return context[0].label;
        },
      },
    },
  },
};

export default {
  name: "CMChartRainbow",

  components: {
    Doughnut,
  },

  props: {
    chartData: {
      type: Object,
      default: () => {
        return {
          labels: [],
          datasets: [
            {
              backgroundColor: [],
              data: [],
            },
          ],
        };
      },
    },
    options: {
      type: Object,
      default: () => {},
    },
  },

  emits: ["legend"],

  data() {
    return {
      chartOptions: _chartOptions,
    };
  },

  // watch: {
  //   chartdata() {
  //     this.refresh();
  //   },
  // },

  // mounted() {
  //   this.refresh();
  // },

  // methods: {
  //   refresh() {
  //     this.renderChart(this.chartdata, chartOptions);
  //     var legend = this.generateLegend();
  //     this.$emit("legend", legend);
  //   },
  // },
};
</script>
