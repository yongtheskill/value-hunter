<template>
  <main style="background-color: var(--color-background-dark)">
    <n-tabs
      v-model:value="currentTab"
      type="segment"
      size="large"
      :animated="true"
      style="padding: 1rem; height: 100vh; width: 100vw">
      <n-tab-pane class="tabPane" name="1" :tab="newsTabVnode">
        <div><news :period="period" /></div
      ></n-tab-pane>
      <n-tab-pane class="tabPane" name="2" :tab="tradeTabVnode"> </n-tab-pane>
      <n-tab-pane class="tabPane" name="3" :tab="portfolioTabVnode"> </n-tab-pane>
    </n-tabs>
    <div class="periodTitleBacking"></div>
    <div class="periodTitle">
      <h1>Week {{ period + 1 }}</h1>
      <h3 class="subtitle">Get ready to trade!</h3>
    </div>
  </main>
</template>

<script>
import { mapState } from 'pinia';
import { mapActions } from 'pinia';
import { useClassStore } from '../utils/classStore';
import { animate } from 'motion';
import { h } from 'vue';
import newsTabTitle from '../components/tabTitles/NewsTab.vue';
import tradeTabTitle from '../components/tabTitles/TradeTab.vue';
import portfolioTabTitle from '../components/tabTitles/PortfolioTab.vue';
import news from '../components/NewsDisplay.vue';

export default {
  data() {
    return {
      currentTab: '1',
      newsTabVnode: h(newsTabTitle),
      tradeTabVnode: h(tradeTabTitle),
      portfolioTabVnode: h(portfolioTabTitle),
    };
  },
  computed: {
    ...mapState(useClassStore, ['started', 'period']),
  },
  methods: {
    ...mapActions(useClassStore, ['listen', 'load']),
    showTitle() {
      animate(
        '.periodTitleBacking',
        { opacity: [1, 1, 0, 0], 'pointer-events': ['auto', 'auto', 'none', 'none'] },
        { duration: /*7*/ 0.1, offset: [0, 0.9, 0.91] }
      );
      animate(
        '.periodTitle',
        { opacity: [0, 1, 1, 0] },
        { duration: /*7*/ 0.1, offset: [0, 0.01, 0.95] }
      );
      animate('.subtitle', { opacity: [0, 1] }, { duration: /*1*/ 0.1, delay: /*1*/ 0 });
    },
  },
  mounted() {
    this.load();
    this.listen();

    this.showTitle();
  },
  components: {
    news,
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
