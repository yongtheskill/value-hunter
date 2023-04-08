<template>
  <main style="width: 100vw; height: 100vh; padding: 1rem">
    <div style="width: 100%; display: flex; justify-content: center" v-if="classData">
      <h1>Running {{ classData.name }}</h1>
    </div>
    <div style="width: 100%; display: flex">
      <n-grid cols="5">
        <n-gi span="3"
          ><div class="controlCard"><h2>Players</h2></div></n-gi
        >
        <n-gi span="2"
          ><div class="controlCard">
            <h2>Game Period</h2>
            <n-grid cols="2" style="padding-top: 1rem">
              <n-gi
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-direction: column;
                  padding-right: 0.5rem;
                ">
                <span>Current Period</span>
                <h1>{{ classData }}</h1>
              </n-gi>
              <n-gi
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-direction: column;
                  padding-right: 0.5rem;
                ">
                <span>Time Elapsed</span>
                <h1>1</h1>
              </n-gi>
              <n-gi span="2" style="padding-top: 0.8rem; display: flex; justify-content: center"
                ><div>Auto-advance <n-switch v-model:value="autoAdvance" /></div
              ></n-gi>
              <n-gi v-if="!autoAdvance"
                ><div style="padding: 0.4rem 0.6rem 0.6rem 0">
                  <n-button style="width: 100%" type="tertiary">Back</n-button>
                </div></n-gi
              >
              <n-gi v-if="!autoAdvance"
                ><div style="padding: 0.4rem 0 0.6rem 0.5rem">
                  <n-button style="width: 100%" type="success">Forward</n-button>
                </div></n-gi
              >
              <n-gi v-if="autoAdvance" style="padding: 0.4rem 0.6rem 0 0.5rem">
                <n-input-number :min="1" :show-button="false" v-bind:value="autoMin">
                  <template #suffix> min </template>
                </n-input-number></n-gi
              >
              <n-gi v-if="autoAdvance" style="padding: 0.4rem 0 0.6rem 0.5rem">
                <n-input-number :min="0" :max="59" :show-button="false" v-bind:value="autoSec">
                  <template #suffix> sec </template>
                </n-input-number></n-gi
              >
            </n-grid>
          </div></n-gi
        ></n-grid
      >
    </div>
  </main>
</template>

<script>
import { getDoc } from '../utils/firestore';
export default {
  data() {
    return {
      classData: null,
      autoAdvance: false,
      autoMin: 5,
      autoSec: 0,
    };
  },
  methods: {
    async fetchGame() {
      const classID = this.$route.params.id;

      const classData = await getDoc('classes', classID);
      this.classData = classData;
    },
  },
  beforeMount() {
    this.fetchGame();
  },
};
</script>

<style>
.controlCard {
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius);
  margin: 1rem;
  padding: 0.8rem 1.6rem;
}
.controlCard h2 {
  text-align: center;
}
</style>
