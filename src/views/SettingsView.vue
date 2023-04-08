<template>
  <h1 style="padding-bottom: 1.5rem">Settings</h1>

  <h2 style="padding-bottom: 0.3rem">Game Defaults</h2>
  <div style="max-width: 500px">
    <span class="inputLabel"
      >Number of Periods
      <span class="errorLabel" v-if="nPeriods == null && dataLoaded">*required</span></span
    >
    <n-input-number
      :loading="!dataLoaded"
      :disabled="!dataLoaded"
      size="large"
      placeholder="Number of Periods"
      class="bpad"
      v-model:value="nPeriods"
      :min="1"
      :max="30"
      :status="nPeriods == null && dataLooaded ? 'error' : ''" />

    <span class="inputLabel"
      >Initial Balance
      <span class="errorLabel" v-if="initialBalance == null && dataLoaded">*required</span></span
    >
    <n-input-number
      :loading="!dataLoaded"
      :disabled="!dataLoaded"
      size="large"
      placeholder="Initial Balance"
      class="bpad"
      v-model:value="initialBalance"
      :min="10"
      :step="10"
      :status="initialBalance == null && dataLoaded ? 'error' : ''">
      <template #prefix> $ </template></n-input-number
    >
    <div style="width: 100%; display: flex; align-items: flex-start">
      <span style="padding-left: 0.3rem; margin-right: 1rem">Short Selling</span>
      <n-switch
        :loading="!dataLoaded"
        :disabled="!dataLoaded"
        v-model:value="shortSelling"
        size="large" />
    </div>
  </div>

  <h1 style="padding-top: 2.5rem">Game Data</h1>
  <div style="padding-bottom: 0.3rem; padding-top: 1rem; display: flex; align-items: center">
    <h2 style="padding-right: 1rem">Counters</h2>
    <n-button size="small" type="success" @click="addCounter()">Add</n-button>
  </div>
  <counter-edit
    v-for="counter in counters"
    :counter="counter"
    :refetch="loadCounters"
    :key="counter.id"
    style="margin-bottom: 1rem" />
  <div style="width: 100%; display: flex; justify-content: center; margin: 1rem 0; height: 34px">
    <n-spin size="medium" v-if="countersLoading" />
  </div>
  <div style="padding: 0.1rem"></div>

  <div style="padding-bottom: 0.3rem; display: flex; align-items: center">
    <h2 style="padding-right: 1rem">News</h2>
    <n-button size="small" type="success" @click="addNewsPeriod()">Add Period</n-button>
  </div>

  <news-period
    v-for="(period, i) in newsPeriods"
    :key="period.created"
    :periodData="period"
    :periodN="i"
    :updateArticle="updateArticle"
    :addArticle="addArticle"
    :removeArticle="removeArticle"
    :removePeriod="removePeriod" />
  <div style="width: 100%; display: flex; justify-content: center; margin: 1rem 0; height: 34px">
    <n-spin size="medium" v-if="newsPeriodsLoading" />
  </div>
  <div style="padding: 0.1rem"></div>
</template>

<script>
import {
  getDoc,
  updateDoc,
  listDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
} from '../utils/firestore';
import { deleteFile } from '../utils/storage';
import CounterEdit from '../components/CounterEdit.vue';
import NewsPeriod from '../components/NewsPeriod.vue';

export default {
  data() {
    return {
      dataLoaded: false,
      nPeriods: 8,
      initialBalance: 5000,
      shortSelling: false,
      counters: [],
      historicalData: [],
      gameData: [],
      countersLoading: false,
      newsPeriods: [],
      newsPeriodsLoading: false,
    };
  },
  watch: {
    nPeriods(n) {
      updateDoc('settings', '0', { nPeriods: this.nPeriods });
    },
    initialBalance(n) {
      updateDoc('settings', '0', { initialBalance: this.initialBalance });
    },
    shortSelling(n) {
      updateDoc('settings', '0', { shortSelling: this.shortSelling });
    },
  },
  methods: {
    async removePeriod(periodN) {
      const imagePaths = this.newsPeriods[periodN].articles.map((article) => article.image);
      for (const imagePath of imagePaths) {
        await deleteFile(imagePath);
      }
      this.newsPeriods.splice(periodN, 1);
      await updateDoc('news', '0', { periods: this.newsPeriods });
    },
    async removeArticle(periodN, articleN) {
      try {
        //delete previous file
        const oldPath = this.newsPeriods[periodN].articles[articleN]['image'];
        if (oldPath != '') {
          deleteFile(oldPath);
        }
      } catch {
        console.log('error deleting old file');
      }
      this.newsPeriods[periodN].articles.splice(articleN, 1);
      await updateDoc('news', '0', {
        periods: this.newsPeriods,
      });
    },
    async updateArticle(periodN, articleN, value, isImage) {
      if (isImage) {
        try {
          //delete previous file
          const oldPath = this.newsPeriods[periodN].articles[articleN]['image'];
          if (oldPath != '') {
            deleteFile(oldPath);
          }
        } catch {
          console.log('error deleting old file');
        }
      }
      this.newsPeriods[periodN].articles[articleN][isImage ? 'image' : 'headline'] = value;
      await updateDoc('news', '0', {
        periods: this.newsPeriods,
      });
    },
    async addArticle(periodN) {
      this.newsPeriods[periodN].articles.push({
        created: Timestamp.fromDate(new Date()),
        headline: '',
        image: '',
      });
      await updateDoc('news', '0', {
        periods: this.newsPeriods,
      });
    },
    async addNewsPeriod() {
      this.newsPeriodsLoading = true;
      await updateDoc('news', '0', {
        periods: [...this.newsPeriods, { articles: [], created: Timestamp.fromDate(new Date()) }],
      });
      await this.getNewsPeriods();
      this.newsPeriodsLoading = false;
    },
    async getNewsPeriods() {
      this.newsPeriods = (await getDoc('news', '0')).periods;
    },
    counterNameChanged(val, id) {
      updateDoc('counters', id, { name: val });
    },
    counterSymbolChanged(val, id) {
      updateDoc('counters', id, { stockSymbol: val });
    },
    async loadSettings() {
      const settings = await getDoc('settings', '0');
      this.nPeriods = settings.nPeriods;
      this.initialBalance = settings.initialBalance;
      this.shortSelling = settings.shortSelling;
      this.dataLoaded = true;
    },
    async loadCounters() {
      const countersList = await listDocs('counters', true);
      const newCounters = [];
      countersList.forEach((e) => {
        const data = e.data();
        data.id = e.id;
        newCounters.push(data);
      });
      this.counters = newCounters;
    },
    async addCounter() {
      this.countersLoading = true;
      await addDoc('counters', {
        name: '',
        stockSymbol: '',
        priceHistory: [],
        created: serverTimestamp(),
      });
      await this.loadCounters();
      this.countersLoading = false;
    },
  },
  beforeMount() {
    this.loadSettings();
    this.loadCounters();
    this.getNewsPeriods();
  },
  components: {
    CounterEdit,
    NewsPeriod,
  },
};
</script>
