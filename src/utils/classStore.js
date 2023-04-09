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
    },
    async load(classID) {
      if (!!classID) {
        this.classID = classID;
      }
      const gottenClass = await getDoc('classes', this.classID);
      this.setData(gottenClass);
    },
    listen(classID) {
      if (!!unsubscribe) {
        if (this.classID == classID) return;
        unsubscribe();
      }
      if (!!classID) {
        this.classID = classID;
      }
      unsubscribe = listenDoc('classes', this.classID, (doc) => {
        const gottenClass = doc.data();
        this.setData(gottenClass);
      });
    },
  },
  persist: true,
});
