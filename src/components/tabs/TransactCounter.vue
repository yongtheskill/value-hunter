<template>
  <n-grid :cols="3">
    <n-gi style="display: flex; justify-content: flex-start; align-items: center"
      ><n-button style="margin-left: 1.5rem" @click="close()"
        ><template #icon
          ><n-icon><back-icon /></n-icon></template
        >Back</n-button
      ></n-gi
    >
    <n-gi style="display: flex; justify-content: center; align-items: center"
      ><h1>{{ counter.stockSymbol }}</h1></n-gi
    >
    <n-gi></n-gi>
  </n-grid>
  <span style="opacity: 0.5">{{ counter.name }}</span>

  <div style="padding-top: 2.5rem; font-size: 3.5rem; font-weight: 700">
    {{ formatMoney(counter.priceHistory[period]) }}
  </div>
  <h2
    style="padding-bottom: 2.5rem"
    :class="{
      trendLabel: true,
      positiveTrend: counter.priceHistory[period] - counter.priceHistory[period - 1] > 0,
      negativeTrend: counter.priceHistory[period] - counter.priceHistory[period - 1] < 0,
    }">
    {{ formatMoney(counter.priceHistory[period] - counter.priceHistory[period - 1])
    }}<n-icon style="margin-left: 2px"
      ><up-icon
        v-if="counter.priceHistory[period] - counter.priceHistory[period - 1] > 0" /><down-icon
        v-else-if="
          counter.priceHistory[period] - counter.priceHistory[period - 1] < 0
        " /><neutral-icon v-else
    /></n-icon>
  </h2>

  <div style="width: 100%; height: 12rem" class="chartContainer">
    <canvas ref="chart"></canvas>
  </div>

  <n-radio-group
    v-model:value="toBuy"
    style="width: 100%; padding: 1.8rem 1.5rem 1rem 2rem; display: flex">
    <n-radio-button :value="true" label="Buy" />
    <n-radio-button :value="false" label="Sell" />
  </n-radio-group>
</template>

<script>
import {
  CaretBack as backIcon,
  ArrowUp as upIcon,
  ArrowDown as downIcon,
  Remove as neutralIcon,
} from '@vicons/ionicons5';
import { formatMoney, priceHistoryToGraphData } from '../../utils/format';
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

export default {
  data() {
    return {
      toBuy: true,
    };
  },
  mounted() {
    const ctx = this.$refs.chart;

    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);

    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            data: priceHistoryToGraphData(this.counter.priceHistory, this.period),
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: false,
            grid: { display: false, drawOnChartArea: false },
          },
          y: {
            grid: { display: true, color: '#fff3', drawTicks: false },
            ticks: {
              callback(value, index, ticks) {
                return '$' + value;
              },
            },
          },
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
  props: ['counter', 'period', 'close'],
  methods: {
    formatMoney,
  },
  components: {
    backIcon,
    upIcon,
    downIcon,
    neutralIcon,
  },
};
</script>

<style>
.n-radio-button {
  flex-grow: 1;
}
.n-radio-button-hand {
  display: flex;
  text-align: center;
}
.n-radio-group .n-radio__label {
  display: flex;
  justify-content: center;
}
</style>
