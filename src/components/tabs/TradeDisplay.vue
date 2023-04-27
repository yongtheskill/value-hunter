<template>
  <div
    style="
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    ">
    <h1>TRADE</h1>
    <span style="display: flex; align-items: center"
      ><n-icon style="margin-right: 5px"><info-icon /></n-icon>Tap on equity to transact</span
    >
  </div>
  <div
    style="
      width: 100%;
      background-color: var(--color-background-mute);
      box-shadow: inset 0 0 4px #000;
      padding: 0.2rem 1.5rem;
    ">
    <n-grid :cols="12">
      <n-gi :span="5">Equity</n-gi>
      <n-gi :span="2" style="display: flex; justify-content: flex-end"> <div>Price</div></n-gi>
      <n-gi :span="5" style="display: flex; justify-content: flex-end"><div>Chart</div></n-gi>
    </n-grid>
  </div>
  <div v-if="loading" class="fadeOut">
    <div v-for="i in Array(5)">
      <div style="padding: 0 1.5rem">
        <n-skeleton
          height="45px"
          width="100%"
          style="border-radius: var(--border-radius-inset1); margin: 1rem 0" />
      </div>
      <n-divider v-if="i != 5" style="margin: 0" />
    </div>
  </div>
  <div else style="display: flex; flex-direction: column">
    <div
      v-for="(counter, i) in counters"
      :key="counter.id"
      @click="openTransaction(counter)"
      style="cursor: pointer">
      <div style="padding: 1rem 1.5rem">
        <n-grid :cols="12">
          <n-gi :span="5"
            ><h2 style="font-weight: 700">{{ counter.stockSymbol }}</h2>
            <span style="opacity: 0.5">{{ counter.name }}</span></n-gi
          >
          <n-gi :span="2" style="display: flex; justify-content: flex-end">
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-end;
              ">
              <h3>{{ formatMoney(counter.priceHistory[period]) }}</h3>
              <span
                :class="{
                  trendLabel: true,
                  positiveTrend:
                    counter.priceHistory[period] - counter.priceHistory[period - 1] > 0,
                  negativeTrend:
                    counter.priceHistory[period] - counter.priceHistory[period - 1] < 0,
                }"
                >{{
                  formatMoney(
                    counter.priceHistory[period] - counter.priceHistory[period - 1],
                    true
                  )
                }}<n-icon style="margin-left: 2px"
                  ><up-icon
                    v-if="
                      counter.priceHistory[period] - counter.priceHistory[period - 1] > 0
                    " /><down-icon
                    v-else-if="
                      counter.priceHistory[period] - counter.priceHistory[period - 1] < 0
                    " /><neutral-icon v-else /></n-icon
              ></span></div
          ></n-gi>
          <n-gi :span="5" style="display: flex; justify-content: flex-end"
            ><counter-chart :period="period" :data="counter.priceHistory" />
          </n-gi>
        </n-grid>
      </div>
      <n-divider v-if="i + 1 != counters.length" style="margin: 0" />
    </div>
    <div style="max-height: 100vh; flex-grow: 1"></div>
  </div>

  <div
    v-if="Object.keys(transactingCounter).length != 0"
    style="
      padding: 1.5rem 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      background-color: var(--color-background);
      z-index: 999;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    ">
    <transact-counter
      :counter="transactingCounter"
      :period="period"
      :close="closeTransaction"
      :doShort="doShort" />
  </div>
</template>

<script>
import { getCounterList } from '../../utils/dataStore';
import { formatMoney } from '../../utils/format';
import counterChart from './CounterChart.vue';
import transactCounter from './TransactCounter.vue';
import {
  InformationCircle as infoIcon,
  ArrowUp as upIcon,
  ArrowDown as downIcon,
  Remove as neutralIcon,
} from '@vicons/ionicons5';

export default {
  data() {
    return {
      counters: [],
      loading: true,
      period: Number(this.periodString),
      transactingCounter: {},
    };
  },
  props: ['periodString', 'doShort'],
  async beforeMount() {
    this.loadCounters();
  },
  watch: {
    period() {
      this.loadCounters();
    },
  },
  methods: {
    closeTransaction() {
      this.transactingCounter = {};
    },
    openTransaction(counter) {
      this.transactingCounter = counter;
    },
    async loadCounters() {
      this.loading = true;
      this.counters = await getCounterList();
      this.loading = false;
    },
    formatMoney,
  },
  components: {
    infoIcon,
    upIcon,
    downIcon,
    neutralIcon,
    counterChart,
    transactCounter,
  },
};
</script>

<style>
.trendLabel {
  display: flex;
  align-items: center;
}
.positiveTrend {
  color: var(--color-success);
}
.negativeTrend {
  color: var(--color-error);
}
h2.newsHeadline {
  padding-top: 0.5rem;
  font-size: 1.3rem !important;
  font-weight: 500;
  padding-bottom: 1.1rem;
}
</style>
