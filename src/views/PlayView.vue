<template>
  <main style="background-color: var(--color-background-dark)" v-show="period < nPeriods - 1">
    <n-tabs
      v-model:value="currentTab"
      type="segment"
      size="large"
      :animated="true"
      style="padding: 1rem; height: 100vh; width: 100vw">
      <n-tab-pane class="tabPane" name="1" :tab="newsTabVnode">
        <news :period="period"
      /></n-tab-pane>
      <n-tab-pane class="tabPane" name="2" :tab="tradeTabVnode">
        <trade :periodString="period" :doShort="shortSelling" />
      </n-tab-pane>
      <n-tab-pane class="tabPane" name="3" :tab="portfolioTabVnode">
        <portfolio :period="period"
      /></n-tab-pane>
    </n-tabs>
    <div class="periodTitleBacking"></div>
    <div class="periodTitle">
      <h1>Week {{ period + 1 }}</h1>
      <h3 class="subtitle">Get ready to trade!</h3>
    </div>
  </main>
  <div
    v-show="period == nPeriods - 1"
    style="
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      background-color: var(--color-background-dark);
      position: fixed;
      overflow-y: scroll;
    ">
    <div
      style="
        margin: 1rem;
        background-color: var(--color-background);
        border-radius: var(--border-radius);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
      <h1>End of Game!</h1>
      <div>Review your portfolio and transactions!</div>
    </div>
    <div
      style="
        margin: 1rem;
        background-color: var(--color-background);
        border-radius: var(--border-radius);
      ">
      <portfolio :period="period" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { mapActions } from 'pinia';
import { useClassStore } from '../utils/classStore';
import { getData } from '../utils/dataStore';
import { animate } from 'motion';
import { h } from 'vue';
import newsTabTitle from '../components/tabTitles/NewsTab.vue';
import tradeTabTitle from '../components/tabTitles/TradeTab.vue';
import portfolioTabTitle from '../components/tabTitles/PortfolioTab.vue';
import news from '../components/tabs/NewsDisplay.vue';
import trade from '../components/tabs/TradeDisplay.vue';
import portfolio from '../components/tabs/PortfolioDisplay.vue';

export default {
  data() {
    return {
      currentTab: '1',
      newsTabVnode: h(newsTabTitle),
      tradeTabVnode: h(tradeTabTitle),
      portfolioTabVnode: h(portfolioTabTitle),
      currentPeriod: 0,
    };
  },
  computed: {
    ...mapState(useClassStore, ['started', 'period', 'shortSelling', 'nPeriods']),
  },
  methods: {
    ...mapActions(useClassStore, ['listen', 'load']),
    showTitle() {
      if (this.period == this.nPeriods - 1) return;
      animate(
        '.periodTitleBacking',
        { opacity: [1, 1, 0, 0], 'pointer-events': ['auto', 'auto', 'none', 'none'] },
        { duration: 7 /*0.1*/, offset: [0, 0.9, 0.91] }
      );
      animate(
        '.periodTitle',
        { opacity: [0, 1, 1, 0] },
        { duration: /*0.1*/ 7, offset: [0, 0.01, 0.95] }
      );
      animate('.subtitle', { opacity: [0, 1] }, { duration: 0.8 /*0.1*/, delay: /*0*/ 0.8 });
    },
  },
  mounted() {
    this.load();
    this.listen();
    getData();
    this.showTitle();
  },
  watch: {
    period() {
      if (this.period != this.currentPeriod) {
        this.currentPeriod = this.period;
        this.showTitle();
      }
    },
  },
  components: {
    news,
    trade,
    portfolio,
    newsTabTitle,
    tradeTabTitle,
    portfolioTabTitle,
  },
};
</script>

<style>
.tabPane {
  overflow: scroll;
  padding-top: 0 !important;
  height: calc(100vh - 46px - 3rem);
}

.periodTitle {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  color: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
.periodTitleBacking {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-background);
  z-index: 999;
}

h1 {
  font-weight: 700;
}

.n-tabs {
  flex-direction: column-reverse;
}

.n-tabs .n-tabs-pane-wrapper {
  overflow-y: scroll;
  margin-bottom: 0.8rem;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
}
</style>
