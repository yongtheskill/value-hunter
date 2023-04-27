<template>
  <div style="width: 100%; height: 47px; padding-left: 25px" class="chartContainer">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { priceHistoryToGraphData } from '../../utils/format';
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
export default {
  props: ['period', 'data'],
  mounted() {
    const ctx = this.$refs.chart;

    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);

    new Chart(ctx, {
      responsive: true,
      maintainAspectRatio: false,
      type: 'line',
      data: {
        datasets: [
          {
            data: priceHistoryToGraphData(this.data, this.period),
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: false,
          },
          y: { display: false },
        },
        datasets: {
          line: {
            pointStyle: false,
            borderColor: '#63e2b7',
            borderCapStyle: 'round',
          },
        },
      },
    });
  },
};
</script>

<style>
.chartContainer > canvas {
  width: 100% !important;
}
</style>
