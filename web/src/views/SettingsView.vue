<template>
  <h1 style="padding-bottom: 1rem">Settings</h1>

  <h2 style="padding-bottom: 0.3rem">Game Defaults</h2>
  <div style="width: 500px; min-width: 300px">
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
</template>

<script>
import { getDoc, updateDoc } from '../utils/firestore';

export default {
  data() {
    return {
      dataLoaded: false,
      nPeriods: 8,
      initialBalance: 5000,
      shortSelling: false,
    };
  },
  watch: {
    nPeriods(n) {
      console.log(n);
      updateDoc('settings', '0', { nPeriods: this.nPeriods });
    },
    initialBalance(n) {
      console.log(n);
      updateDoc('settings', '0', { initialBalance: this.initialBalance });
    },
    shortSelling(n) {
      console.log(n);
      updateDoc('settings', '0', { shortSelling: this.shortSelling });
    },
  },
  methods: {
    async loadSettings() {
      const settings = await getDoc('settings', '0');
      this.nPeriods = settings.nPeriods;
      this.initialBalance = settings.initialBalance;
      this.shortSelling = settings.shortSelling;
      this.dataLoaded = true;
    },
  },
  beforeMount() {
    this.loadSettings();
  },
};
</script>
