import { defineStore } from 'pinia';
import { getDoc, listenDoc } from './firestore';

let unsubscribe = null;

export const useClassStore = defineStore('gclass', {
  state: () => {
    return {
      classID: '',
      period: 0,
      nextPeriod: 0,
      initialBalance: 0,
      nPeriods: 0,
      name: '',
      shortSelling: false,
      started: false,
      quarterlyRevenueEnabled: false,
      ebitEnabled: false,
      profitMarginEnabled: false,
      peRatioEnabled: false,
      cashEnabled: false,
      debtEnabled: false,
      marginOfSafetyEnabled: false,
    };
  },
  getters: {
    timeForNext() {
      return false;
    },
  },
  actions: {
    setData(classData) {
      this.period = classData.period;
      this.nextPeriod = classData.nextPeriod;
      this.initialBalance = classData.initialBalance;
      this.nPeriods = classData.nPeriods;
      this.name = classData.name;
      this.shortSelling = classData.shortSelling;
      this.started = classData.started;
      this.quarterlyRevenueEnabled = classData.quarterlyRevenueEnabled;
      this.ebitEnabled = classData.ebitEnabled;
      this.profitMarginEnabled = classData.profitMarginEnabled;
      this.peRatioEnabled = classData.peRatioEnabled;
      this.cashEnabled = classData.cashEnabled;
      this.debtEnabled = classData.debtEnabled;
      this.marginOfSafetyEnabled = classData.marginOfSafetyEnabled;
    },
    clear() {
      this.classID = '';
      this.period = 0;
      this.nextPeriod = 0;
      this.initialBalance = 0;
      this.nPeriods = 0;
      this.name = '';
      this.shortSelling = false;
      this.started = false;
      this.quarterlyRevenueEnabled = false;
      this.ebitEnabled = false;
      this.profitMarginEnabled = false;
      this.peRatioEnabled = false;
      this.cashEnabled = false;
      this.debtEnabled = false;
      this.marginOfSafetyEnabled = false;
    },
    async load(classID) {
      if (!!classID) {
        this.classID = classID;
      }
      try {
        const gottenClass = await getDoc('classes', this.classID);
        this.setData(gottenClass);
      } catch {
        this.classID = '';
        window.location.href = '/';
      }
    },
    listen(classID) {
      if (!!unsubscribe) {
        if (this.classID == classID) return;
        unsubscribe();
      }
      if (!!classID) {
        this.classID = classID;
      }
      try {
        unsubscribe = listenDoc('classes', this.classID, (doc) => {
          const gottenClass = doc.data();
          this.setData(gottenClass);
        });
      } catch {
        this.classId = '';
        window.location.href = '/';
      }
    },
  },
  persist: true,
});
