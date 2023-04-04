import { defineStore } from 'pinia';
import { getDoc, listenDoc } from './firestore';

export const useClassStore = defineStore('gclass', {
  state: () => {
    return {
      id: '',
      period: 0,
      nextPeriod: 0,
      initialBalance: 0,
      nPeriods: 0,
      name: '',
      shortSelling: false,
      started: false,
      unsubscribe: null,
    };
  },
  getters: {
    timeForNext() {
      return false;
    },
  },
  actions: {
    setData(classData) {
      console.log('class updated');
      this.period = classData.period;
      this.nextPeriod = classData.nextPeriod;
      this.initialBalance = classData.initialBalance;
      this.nPeriods = classData.nPeriods;
      this.name = classData.name;
      this.shortSelling = classData.shortSelling;
      this.started = classData.started;
    },
    async load(classID) {
      this.classID = classID;
      const gottenClass = await getDoc('classes', classID);
      this.setData(gottenClass);
    },
    listen(classID) {
      if (!!this.unsubscribe) {
        if (this.classID == classID) return;
        this.unsubscribe();
      }
      this.classID = classID;
      this.unsubscribe = listenDoc('classes', classID, (doc) => {
        const gottenClass = doc.data();
        this.setData(gottenClass);
      });
    },
  },
  persist: true,
});
