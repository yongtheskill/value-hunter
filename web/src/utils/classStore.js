import { defineStore } from 'pinia';
import { getDoc } from './firestore';

export const useClassStore = defineStore('gclass', {
  state: () => ({ gclass: {} }),
  getters: {
    timeForNext() {
      return false;
    },
  },
  actions: {
    async load(classID) {
      this.gclass = await getDoc('classes', classID);
      console.log(this.gclass);
    },
  },
  persist: true,
});
