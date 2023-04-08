<template>
  <n-spin :show="loading">
    <div
      style="background-color: var(--color-background-soft); border-radius: var(--border-radius)">
      <n-grid
        style="width: 100%; padding: 0.8rem 1.4rem 1.4rem 1.4rem; border-bottom: 1px solid #555"
        cols="5"
        x-gap="12">
        <n-gi span="2"
          ><div style="padding-left: 0.2rem">Name</div>
          <n-input v-model:value="counterName" />
        </n-gi>
        <n-gi
          ><div style="padding-left: 0.2rem">Symbol</div>
          <n-input v-model:value="stockSymbol" />
        </n-gi>
      </n-grid>
      <div style="width: 100%; padding: 1rem 1.4rem; border-bottom: 1px solid #555">
        <n-collapse>
          <n-collapse-item title="Click to Edit Data" name="1">
            <div style="display: flex">
              <div style="display: flex; opacity: 0.4; margin-right: 1rem">
                <div
                  style="
                    writing-mode: vertical-lr;
                    transform: scale(-1);
                    text-align: center;
                    margin-bottom: 15px;
                    line-height: normal;
                  ">
                  time
                </div>
                <div>
                  <div class="arrow-1"></div>
                </div>
              </div>
              <div>
                <h3>Historical Data</h3>
                <n-dynamic-input
                  v-model:value="historicalData"
                  placeholder="Value"
                  :min="1"
                  style="width: 220px; margin-top: 0.4rem"
                  :on-create="createRecord">
                  <template #default="{ value }">
                    <n-input-number
                      v-model:value="value.n"
                      style="margin-right: 12px; width: 160px">
                      <template #prefix> $ </template></n-input-number
                    >
                  </template>
                </n-dynamic-input>
                <h3 style="margin-top: 1.4rem">Game Period Data</h3>
                <n-dynamic-input
                  v-model:value="gameData"
                  placeholder="Value"
                  :min="1"
                  style="width: 220px; margin-top: 0.4rem"
                  :on-create="createRecord">
                  <template #default="{ value }">
                    <n-input-number
                      v-model:value="value.n"
                      style="margin-right: 12px; width: 160px">
                      <template #prefix> $ </template></n-input-number
                    >
                  </template>
                </n-dynamic-input>
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>
      <div style="width: 100%; padding: 1rem 1.4rem; display: flex; justify-content: flex-end">
        <n-button type="error" @click="remove()">Delete</n-button>
      </div>
    </div>
  </n-spin>
</template>

<script>
import { updateDoc, deleteDoc } from '../utils/firestore';

export default {
  data() {
    return {
      historicalData: [],
      gameData: [],
      counterName: '',
      stockSymbol: '',
      cid: '',
      loading: false,
    };
  },
  props: ['counter', 'refetch'],
  beforeMount() {
    this.counterName = this.counter.name;
    this.stockSymbol = this.counter.stockSymbol;
    this.cid = this.counter.id;
    //parse data into historical and game data
    const hNs = [];
    const gNs = [];
    for (const t in this.counter.priceHistory) {
      if (t < 0) {
        hNs.push(t);
        continue;
      }
      gNs.push(t);
    }
    hNs.sort((a, b) => a - b);
    gNs.sort();
    const hdata = [];
    const gdata = [];
    hNs.forEach((n) => {
      hdata.push({ n: this.counter.priceHistory[n] });
    });
    gNs.forEach((n) => {
      gdata.push({ n: this.counter.priceHistory[n] });
    });
    this.historicalData = hdata;
    this.gameData = gdata;
  },
  methods: {
    syncData() {
      const newData = {};
      for (let i = 0; i < this.historicalData.length; i++) {
        newData[i - this.historicalData.length] = this.historicalData[i].n;
      }
      for (let i = 0; i < this.gameData.length; i++) {
        newData[i] = this.gameData[i].n;
      }
      updateDoc('counters', this.cid, { priceHistory: newData });
    },
    createRecord() {
      return {
        n: 100,
      };
    },
    async remove() {
      this.loading = true;
      await deleteDoc('counters', this.cid);
      await this.refetch();
    },
  },

  watch: {
    historicalData: {
      handler() {
        this.syncData();
      },
      deep: true,
    },
    gameData: {
      handler() {
        this.syncData();
      },
      deep: true,
    },
    counterName(n) {
      updateDoc('counters', this.cid, { name: n });
    },
    stockSymbol(n) {
      updateDoc('counters', this.cid, { stockSymbol: n });
    },
  },
};
</script>

<style scoped>
.arrow-1 {
  width: 10px;
  height: 100%;
}
.arrow-1 {
  content: '';
  background: currentColor;
  clip-path: polygon(
    6.5px 0,
    6.5px calc(100% - 15px),
    0 calc(100% - 15px),
    50% 100%,
    100% calc(100% - 15px),
    calc(100% - 6.5px) calc(100% - 15px),
    calc(100% - 6.5px) 0
  );
}
</style>
