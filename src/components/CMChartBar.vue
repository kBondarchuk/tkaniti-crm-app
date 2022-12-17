<template>
  <Bar :chart-data="chartData" :chart-options="chartOptions" :plugins="plugins" />
</template>

<script>
// import "chart.js/auto";
import { Bar } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 12,
      bottom: 0,
    },
  },

  // Axes
  scales: {
    y: [
      {
        // display: false,
        stacked: true,
        ticks: {
          //index, values
          callback: function (value) {
            return Number(value / 1000).toFixed(0) + "";
          },
        },
      },
    ],
    // xAxes: [
    //   {
    //     type: "time",
    //     time: {
    //       unit: "week",
    //       displayFormats: {
    //         week: "MMM DD",
    //         isoWeekday: true,
    //       },
    //     },
    //     bounds: "ticks",
    //   },
    // ],
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
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      anchor: "end",
      align: "top",
      offset: "-4",
      formatter: function (value) {
        // (context)
        if (value == 0) return "";
        return Number(value / 1000).toFixed(2);
      },
    },
    labels: {
      render: "value",
      // render: function (args) {
      //   if (args.value == 0) return "";
      //   // args will be something like:
      //   // { label: 'Label', value: 123, percentage: 50, index: 0, dataset: {...} }
      //   // console.log(args.dataset.data[args.index]);

      //   return Number(args.value / 1000).toFixed(2);

      //   // return object if it is image
      //   // return { src: 'image.png', width: 16, height: 16 };
      // },
    },
  },
};

export default {
  name: "CMChartBar",

  components: {
    Bar,
  },

  props: {
    chartData: {
      type: Object,
      default: null,
    },
    // options: {
    //   type: Object,
    //   default: null,
    // },
    // plugins: {
    //   type: Array,
    //   default: () => [ChartPluginLabels],
    // },
  },

  data() {
    return {
      chartOptions: _chartOptions,
      plugins: [ChartDataLabels],
    };
  },

  // watch: {
  //   chartData() {
  //     this.refresh();
  //   },
  // },

  // mounted() {
  //   this.refresh();
  //   // console.log(">>", ChartDataLabels);
  //   // this.addPlugin(ChartDataLabels);
  // },

  // methods: {
  //   refresh() {
  //     console.log("[CMChartBar]: refresh");

  //     this.renderChart(this.chartdata, chartOptions);
  //     // var legend = this.generateLegend();
  //     // this.$emit("legend", legend);
  //   },
  // },
};
</script>
