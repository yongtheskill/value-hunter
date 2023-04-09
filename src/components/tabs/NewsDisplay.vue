<template>
  <div style="padding: 1.4rem 1.5rem 0 1.5rem; display: flex; justify-content: center">
    <h1>NEWS</h1>
  </div>
  <div v-if="loading">
    <div v-for="i in Array(5)">
      <n-skeleton
        height="250px"
        width="100%"
        style="border-radius: var(--border-radius-inset1); margin-bottom: 1rem" />
      <n-divider v-if="i != 4" />
    </div>
  </div>
  <div v-else>
    <div v-for="(news, i) in newsData" :key="news.created">
      <div style="padding: 1.5rem 1.5rem 0 1.5rem">
        <NewsItem :img="news.image" :headline="news.headline" />
        <h2 class="newsHeadline">{{ news.headline }}</h2>
      </div>
      <n-divider v-if="i + 1 != newsData.length" style="margin: 0" />
    </div>
  </div>
</template>

<script>
import { getNewsData } from '../../utils/dataStore';
import NewsItem from './NewsArticle.vue';

export default {
  data() {
    return { newsData: [], loading: true };
  },
  props: ['period'],
  async beforeMount() {
    this.loadArticles();
  },
  watch: {
    period() {
      this.loadArticles();
    },
  },
  methods: {
    async loadArticles() {
      this.loading = true;
      this.newsData = (await getNewsData())[this.period].articles;
      this.loading = false;
    },
  },
  components: {
    NewsItem,
  },
};
</script>

<style>
h2.newsHeadline {
  padding-top: 0.5rem;
  font-size: 1.3rem !important;
  font-weight: 500;
  padding-bottom: 1.1rem;
}
</style>
