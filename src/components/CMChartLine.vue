<template>
  <Line :chart-data="chartData" :chart-options="chartOptions" />
</template>

<script>
// import "chart.js/auto";
import { Line } from "vue-chartjs";
import { Chart as ChartJS, Tooltip, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(Tooltip, LineElement, PointElement, CategoryScale, LinearScale);

let _chartOptions = {
  title: {
    display: false,
    text: "ГРАФИК",
    position: "bottom",
    fontColor: "#000",
    fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
    fontSize: "14",
  },

  responsive: true, // my new default options
  maintainAspectRatio: false, // my new default options

  plugins: {
    legend: { display: false },
  },

  // Axes

  scales: {
    y: {
      // display: false,
      beginAtZero: true,
      ticks: {
        suggestedMin: 0,
        //index, values
        callback: function (value, index, ticks) {
          return Number(value / 1000000).toFixed(0) + " млн.";
        },
      },
    },
  },

  // tooltips: {
  //   enabled: true,
  // },
  tooltips: {
    callbacks: {
      label: function (tooltipItem) {
        // console.log(tooltipItem);

        return Number(tooltipItem.yLabel / 1000).toFixed(2) + " т.р.";
      },
      //     // title: function (tooltipItem, data) {
      //     //   return data.labels[tooltipItem[0].index];
      //     // },
    },
  },
  //
  // plugins: {
  //   labels: {
  //     render: "value",
  //   },
  // },
};

export default {
  name: "CMChartLine",

  components: {
    Line,
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
    // options: {
    //   type: Object,
    //   default: null,
    // },
  },
  data() {
    return {
      chartOptions: _chartOptions,
      // plugins: [Title, Tooltip, Legend, LineElement, LineController, CategoryScale, LinearScale],
    };
  },
  watch: {
    chartdata() {
      this.refresh();
    },
  },

  // mounted() {
  //   this.refresh();
  // },

  // methods: {
  //   refresh() {
  //     console.log("[CMChartLine]: refresh");

  //     this.renderChart(this.chartdata, chartOptions);
  //     var legend = this.generateLegend();
  //     this.$emit("legend", legend);
  //   },
  // },
};
</script>
