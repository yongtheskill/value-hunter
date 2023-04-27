<template>
  <div style="padding: 1.4rem 1.5rem 0 1.5rem; display: flex; justify-content: center">
    <h1>Overview</h1>
  </div>
  <div
    style="
      margin: 1rem 1.5rem;
      background-color: var(--color-background-soft);
      border-radius: var(--border-radius);
    ">
    <div style="padding: 0.8rem 1rem 0.5rem 1rem; border-bottom: 1px solid #fff1">
      <span>Total Value</span>
      <h1 style="padding-bottom: 0.2rem">{{ formatMoney(totalValue) }}</h1>
    </div>

    <div style="padding: 0.3rem 1rem 0.8rem 1rem">
      <div class="nrow">
        <div>Stocks</div>
        <div>{{ formatMoney(stocksValue) }}</div>
      </div>
      <div class="nrow">
        <div>Short Value</div>
        <div>{{ formatMoney(shortValue) }}</div>
      </div>
      <div class="nrow">
        <div>Cash</div>
        <div>{{ formatMoney(player.money) }}</div>
      </div>
      <div class="nrow">
        <div>Profit/Loss</div>
        <div
          :style="{
            color: totalDiff < 0 ? 'var(--color-error)' : 'var(--color-success)',
            display: 'flex',
            'align-items': 'center',
          }">
          {{ formatMoney(totalDiff, true) }}
          <n-icon style="padding-left: 4px"
            ><downIcon v-if="totalDiff < 0" /><upIcon v-else
          /></n-icon>
        </div>
      </div>
    </div>
  </div>
  <div style="padding: 2.2rem 1.5rem 0 1.5rem; display: flex; justify-content: center">
    <h1>Holdings</h1>
  </div>
  <div v-if="loading" class="fadeOut" style="margin: 1rem 1.5rem">
    <div v-for="i in Array(5)">
      <n-skeleton
        height="300px"
        width="100%"
        style="border-radius: var(--border-radius-inset1); margin-bottom: 1rem" />
      <n-divider v-if="i != 4" />
    </div>
  </div>
  <div v-show="!loading && holdings.length != 0">
    <div style="margin: 1.5rem; overflow: visible">
      <div style="width: 100%; overflow: visible">
        <canvas ref="mainChart"></canvas>
      </div>
      <n-space vertical v-if="!loading" style="padding-top: 1.5rem">
        <div
          v-for="holding in holdings"
          :key="holding.counter.id"
          style="
            width: 100%;
            display: flex;
            justify-content: space-between;
            background-color: var(--color-background-mute);
            padding: 0.5rem 1rem;
            padding-bottom: 0.6rem;
            border-radius: var(--border-radius);
            margin-bottom: 0.2rem;
          ">
          <div style="display: flex; align-items: center">
            <div
              :style="{
                height: '12px',
                width: '12px',
                'border-radius': '3px',
                'margin-right': '10px',
                'background-color': holding.color,
              }"></div>
            <h3>{{ holding.counter.name }}</h3>
          </div>
          <div style="display: flex; align-items: center">
            <div style="display: flex; flex-direction: column; align-items: flex-end">
              <h3>
                {{ formatMoney(holding.counter.priceHistory[this.period] * holding.n, true) }}
              </h3>
              <span
                :style="{
                  color: calcChange(holding) < 0 ? 'var(--color-error)' : 'var(--color-success)',
                  display: 'flex',
                  'align-items': 'center',
                }"
                >{{ formatMoney(calcChange(holding), true) }}
                <n-icon style="padding-left: 4px"
                  ><downIcon v-if="calcChange(holding) < 0" /><upIcon v-else /></n-icon
              ></span>
            </div>
            <h2 style="font-weight: 700; padding-left: 20px; padding-right: 10px">
              {{ holding.n }}
            </h2>
          </div>
        </div>
      </n-space>
    </div>
  </div>
  <div
    v-if="!loading && holdings.length == 0"
    style="
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      padding-bottom: 1.2rem;
    ">
    <h2 style="opacity: 40%; font-weight: 700">No holdings yet</h2>
  </div>

  <div style="padding: 2.2rem 1.5rem 0 1.5rem; display: flex; justify-content: center">
    <h1>Transaction History</h1>
  </div>
  <div style="padding: 1rem 1.5rem; display: flex; flex-direction: column-reverse">
    <div
      v-for="transaction in player.transactions"
      style="
        margin-bottom: 0.8rem;
        padding: 0.8rem 1rem;
        background-color: var(--color-background-soft);
        border-radius: var(--border-radius);
      ">
      <div
        v-if="transaction.isStock || transaction.isShort"
        style="display: flex; justify-content: space-between">
        <div>
          <h2 style="font-weight: 700">
            {{ counters[transaction.counterId] ? counters[transaction.counterId].stockSymbol : '' }}
          </h2>
          <span style="opacity: 0.5">{{
            counters[transaction.counterId] ? counters[transaction.counterId].name : ''
          }}</span>
        </div>
        <div>
          <div
            :style="{
              border: '1px solid',
              'font-size': '0.8rem',
              'border-color':
                (transaction.isShort && !transaction.isCover) || transaction.isBuy
                  ? 'var(--color-success-strong)'
                  : 'var(--color-error-strong)',
              color:
                (transaction.isShort && !transaction.isCover) || transaction.isBuy
                  ? 'var(--color-success-strong)'
                  : 'var(--color-error-strong)',
              padding: '2px 6px',
              'border-radius': 'var(--border-radius-inset1)',
            }">
            {{
              transaction.isStock
                ? transaction.isBuy
                  ? 'BUY'
                  : 'SELL'
                : transaction.isCover
                ? 'SHORT COVER'
                : 'SHORT SELL'
            }}
          </div>
        </div>
      </div>
      <div v-else>
        <h2 style="font-weight: 700">{{ transaction.label }}</h2>
      </div>
      <div v-if="transaction.isStock || transaction.isShort">
        <div class="nrow" style="padding-top: 0.5rem">
          <div>Quantity</div>
          <div>{{ transaction.nShares }}</div>
        </div>
        <div class="nrow">
          <div>Price</div>
          <div>{{ formatMoney(transaction.price) }}</div>
        </div>
        <div class="nrow">
          <div>Order Date</div>
          <div>Week {{ transaction.period + 1 }}</div>
        </div>
      </div>
      <div v-else>
        <div class="nrow">
          <div>Amount</div>
          <div>{{ formatMoney(transaction.price) }}</div>
        </div>
        <div class="nrow">
          <div>Date</div>
          <div>Week {{ transaction.period + 1 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import { getDoc, listenDoc } from '../../utils/firestore';
import { waitForAuth } from '../../utils/auth';
import { getCountersObj } from '../../utils/dataStore';
import { formatMoney } from '../../utils/format';
import ColorHash from 'color-hash';
import { ArrowUp as upIcon, ArrowDown as downIcon } from '@vicons/ionicons5';

const colorHash = new ColorHash();

export default {
  props: ['period'],
  data() {
    return {
      loading: true,
      player: {},
      counters: {},
      chart: {},
    };
  },
  computed: {
    holdings() {
      if (!this.player.holdings) return [];
      const counters = [];
      for (const counterId in this.player.holdings) {
        const counter = this.counters[counterId];
        const n = this.player.holdings[counterId];
        counters.push({
          counter,
          n,
          color: colorHash.hex(counter.name + 'b'),
          val: counter.priceHistory[this.period] * n,
        });
      }
      counters.sort((a, b) => b.n - a.n);
      return counters;
    },
    counterNames() {
      return this.holdings.map((h) => h.counter.name);
    },
    counterValues() {
      return this.holdings.map((h) => h.val);
    },
    counterColors() {
      return this.holdings.map((h) => h.color);
    },
    stocksValue() {
      let sum = 0;
      for (const holding of this.holdings) {
        sum += holding.val;
      }
      return sum;
    },
    shortValue() {
      if (Object.keys(this.counters).length == 0) {
        return 0;
      }
      let sum = 0;
      for (const counter in this.player.shortRecords) {
        for (const cperiod in this.player.shortRecords[counter]) {
          const t = this.player.shortRecords[counter][cperiod];
          const count = t.nSold - t.nCovered;
          const buyTotal = count * t.price;
          const val = buyTotal - count * this.counters[counter].priceHistory[this.period];
          sum += val;
        }
      }
      return sum;
    },
    totalValue() {
      return this.stocksValue + this.shortValue + this.player.money;
    },
    totalInvested() {
      if (!this.player.transactions) return 0;

      let bal = 0;
      for (const transaction of this.player.transactions) {
        if (!transaction.isStock) continue;
        if (transaction.isBuy) {
          bal += transaction.nShares * transaction.price;
          continue;
        }
        bal -= transaction.nShares * transaction.price;
      }
      return bal;
    },
    totalDiff() {
      return this.totalValue - this.player.iMoney;
    },
  },
  methods: {
    calcChange(holding) {
      const counterId = holding.counter.id;
      let bal = 0;
      for (const transaction of this.player.transactions) {
        if (!transaction.isStock) continue;
        if (!(transaction.counterId == counterId)) continue;
        if (transaction.isBuy) {
          bal -= transaction.nShares * transaction.price;
          continue;
        }
        bal += transaction.nShares * transaction.price;
      }
      bal += holding.val;
      return bal;
    },
    formatMoney,
    loadPlayer() {
      const th = this;
      waitForAuth(async (user) => {
        if (!th.loading) return;

        listenDoc('players', user.uid, (p) => {
          th.player = p.data();
          th.loading = false;
        });
      });
    },
    loadChart() {
      const ctx = this.$refs.mainChart;

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.counterNames,
          datasets: [
            {
              label: 'Value',
              data: this.counterValues,
              backgroundColor: this.counterColors,
              borderColor: '#181818',
              borderWidth: 6,
              cutout: 90,
              hoverOffset: 10,
              clip: { top: 15, right: 15, bottom: 15, left: 15 },
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label(a) {
                  return formatMoney(a.raw);
                },
              },
            },
            legend: {
              display: false,
            },
          },
        },
      });
    },
  },
  watch: {
    player() {
      try {
        this.loadChart();
      } catch {}
    },
  },
  async mounted() {
    this.loadPlayer();
    this.counters = await getCountersObj();
    Chart.register(DoughnutController, ArcElement, Tooltip);
  },
  components: {
    upIcon,
    downIcon,
  },
};
</script>

<style>
.nrow {
  display: flex;
  justify-content: space-between;
  padding-top: 0.2rem;
}
</style>
