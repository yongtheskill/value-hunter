<template>
  <main style="width: 100vw; height: 100vh; padding: 1rem">
    <div style="width: 100%; display: flex; justify-content: space-between" v-if="classData">
      <div>
        <n-button
          style="position: fixed; top: 1rem; left: 1.2rem; z-index: 9999"
          @click="$router.push('/manage')"
          >Back</n-button
        >
      </div>
      <div>
        <h1>Running {{ classData.name }}</h1>
      </div>
      <div></div>
    </div>
    <div style="width: 100%; display: flex">
      <n-grid cols="5">
        <n-gi span="3"
          ><div class="controlCard">
            <h2 style="padding-bottom: 1rem">Players</h2>
            <div
              v-for="player in players"
              :key="player.id"
              :style="{
                'background-color':
                  calcValue(player) < 0 ? 'var(--color-error)' : 'var(--color-background-mute)',
                padding: '0.5rem 1rem',
                'border-radius': 'var(--border-radius)',
                'margin-bottom': '1rem',
              }">
              <n-collapse>
                <n-collapse-item name="1">
                  <template #header
                    ><h3 style="font-weight: 600; padding-bottom: 4px">
                      {{ player.name }}
                    </h3></template
                  >
                  <template #header-extra
                    ><div>
                      <n-grid :cols="2" :x-gap="12">
                        <n-gi class="lcol">Transactions</n-gi>
                        <n-gi class="rcol">{{ player.transactions.length - 1 }}</n-gi>
                        <n-gi class="lcol">Holdings</n-gi>
                        <n-gi class="rcol">{{ calcHoldings(player.holdings) }}</n-gi>
                        <n-gi class="lcol">Shorts</n-gi>
                        <n-gi class="rcol">{{ calcShorts(player.shortRecords) }}</n-gi>
                        <n-gi class="lcol">Cash</n-gi>
                        <n-gi class="rcol">{{ formatMoney(player.money) }}</n-gi>
                        <n-gi class="lcol">Total Value</n-gi>
                        <n-gi class="rcol">{{ formatMoney(calcValue(player)) }}</n-gi>
                      </n-grid>
                    </div>
                  </template>
                  <h2 style="padding-left: 1.5rem; padding-top: 0rem; font-weight: 600">
                    Transactions
                  </h2>
                  <div
                    style="padding: 1rem; padding-top: 0.5rem"
                    v-if="Object.keys(counters).length > 0">
                    <div
                      class="transactionrow"
                      v-for="transaction in player.transactions"
                      style="display: flex; justify-content: space-between">
                      <div v-if="transaction.isStock || transaction.isShort" style="display: flex">
                        <div style="width: 6.5rem">
                          {{
                            transaction.isStock
                              ? transaction.isBuy
                                ? 'Buy '
                                : 'Sell '
                              : transaction.isShort
                              ? transaction.isCover
                                ? 'Short Cover '
                                : 'Short Sell '
                              : ''
                          }}
                        </div>
                        {{ counters[transaction.counterId].name }}
                      </div>
                      <div v-else>
                        {{ transaction.label }}
                      </div>
                      <div v-if="transaction.isStock || transaction.isShort">
                        <span style="padding-right: 0.5rem"
                          >({{ transaction.nShares }} x {{ formatMoney(transaction.price) }})</span
                        ><span>{{ formatMoney(transaction.nShares * transaction.price) }}</span>
                      </div>
                      <div v-else>
                        {{ formatMoney(transaction.price) }}
                      </div>
                    </div>
                  </div>
                </n-collapse-item>
              </n-collapse>
            </div>
            <div v-if="players.length == 0">
              <h2 style="font-weight: 700; opacity: 0.5; padding: 3rem 0">No players</h2>
            </div>
          </div></n-gi
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
                <h1 style="font-weight: 700">
                  {{ classData ? classData.period : '0' }}
                  {{ classData && classData.period == classData.nPeriods - 1 ? '(End)' : '' }}
                </h1>
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
                <time-elapsed
                  :style="{ opacity: autoAdvance ? '1' : '0.3' }"
                  v-if="classData != null"
                  :from="classData.nextPeriod"
                  :autoAdvance="
                    autoAdvance && !(classData && classData.period == classData.nPeriods - 1)
                  "
                  :autoTime="autoTime"
                  :nextPeriod="nextPeriod" />
                <h1 v-else style="font-weight: 700" :style="{ opacity: autoAdvance ? '1' : '0.3' }">
                  --:--
                </h1>
              </n-gi>
              <n-gi
                span="2"
                style="padding: 1rem 0 0.5rem 0; display: flex; justify-content: center"
                ><div>
                  Auto-advance
                  <n-switch
                    v-model:value="autoAdvance"
                    :loading="periodLoading"
                    :disabled="periodLoading" /></div
              ></n-gi>
              <n-gi v-if="!autoAdvance"
                ><div style="padding: 1rem 0.6rem 0.6rem 0">
                  <n-button
                    style="width: 100%"
                    type="tertiary"
                    @click="prevPeriod()"
                    :loading="periodLoading"
                    :disabled="periodLoading || (classData && classData.period == 0)"
                    >Back</n-button
                  >
                </div></n-gi
              >
              <n-gi v-if="!autoAdvance"
                ><div style="padding: 1rem 0 0.6rem 0.5rem">
                  <n-button
                    style="width: 100%"
                    type="success"
                    @click="nextPeriod()"
                    :loading="periodLoading"
                    :disabled="
                      periodLoading || (classData && classData.period == classData.nPeriods - 1)
                    "
                    >Forward</n-button
                  >
                </div></n-gi
              >
              <n-gi v-if="autoAdvance" style="padding: 1rem 0.6rem 0.6rem 0">
                <n-input-number
                  :min="1"
                  :show-button="false"
                  v-model:value="autoMin"
                  :disabled="periodLoading">
                  <template #suffix> min </template>
                </n-input-number></n-gi
              >
              <n-gi v-if="autoAdvance" style="padding: 1rem 0 0.6rem 0.5rem">
                <n-input-number
                  :min="0"
                  :max="59"
                  :show-button="false"
                  v-model:value="autoSec"
                  :disabled="periodLoading">
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
import {
  getDoc,
  serverTimestamp,
  updateDoc,
  listenQuery,
  query,
  createCollectionRef,
  where,
} from '../utils/firestore';
import { getFn } from '../utils/functions';
import { formatMoney } from '../utils/format';
import { getCountersObj } from '../utils/dataStore';
import timeElapsed from '../components/TimeElapsed.vue';
export default {
  data() {
    return {
      classData: null,
      autoAdvance: false,
      autoMin: 5,
      autoSec: 0,
      periodLoading: false,
      players: [],
      counters: {},
    };
  },
  watch: {
    autoAdvance(n) {
      updateDoc('classes', this.$route.params.id, { autoAdvance: n });
    },
    autoMin(n) {
      updateDoc('classes', this.$route.params.id, { autoAdvanceMin: n });
    },
    autoSec(n) {
      updateDoc('classes', this.$route.params.id, { autoAdvanceSec: n });
    },
  },
  computed: {
    autoTime() {
      return this.autoMin * 60 + this.autoSec;
    },
  },
  methods: {
    calcValue(player) {
      if (Object.keys(this.counters).length == 0) {
        return 0;
      }
      let stockValues = 0;
      for (const holding in player.holdings) {
        stockValues +=
          player.holdings[holding] * this.counters[holding].priceHistory[this.classData.period];
      }

      let shortValue = 0;
      for (const counter in player.shortRecords) {
        for (const cperiod in player.shortRecords[counter]) {
          const t = player.shortRecords[counter][cperiod];
          const count = t.nSold - t.nCovered;
          const buyTotal = count * t.price;
          const val = buyTotal - this.counters[counter].priceHistory[this.classData.period];
          shortValue += val;
        }
      }

      return stockValues + shortValue + player.money;
    },
    calcHoldings(data) {
      let count = 0;
      for (const holding in data) {
        count += data[holding];
      }
      return count;
    },
    calcShorts(data) {
      let count = 0;
      for (const counter in data) {
        for (const cperiod in data[counter]) {
          const t = data[counter][cperiod];
          count += t.nSold - t.nCovered;
        }
      }
      return count;
    },
    formatMoney,
    listenPlayers() {
      listenQuery(
        query(createCollectionRef('players'), where('classID', '==', this.$route.params.id)),
        (res) => {
          const newPlayers = [];
          res.forEach((p) => {
            const dat = p.data();
            dat.id = p.id;
            newPlayers.push(dat);
          });
          this.players = newPlayers;
        }
      );
    },
    async nextPeriod() {
      this.periodLoading = true;
      const advancePeriod = getFn('advancePeriod');
      await advancePeriod({
        classId: this.$route.params.id,
        period: this.classData.period,
        holdingCost: this.classData.holdingCost,
        shorting: this.classData.shortSelling,
      });
      await this.fetchGame();
      this.periodLoading = false;
    },
    async prevPeriod() {
      this.periodLoading = true;
      if (this.classData.period <= 0) return;
      await updateDoc('classes', this.$route.params.id, {
        period: this.classData.period - 1,
        nextPeriod: serverTimestamp(),
      });
      await this.fetchGame();
      this.periodLoading = false;
    },
    async fetchGame() {
      const classID = this.$route.params.id;

      const classData = await getDoc('classes', classID);
      this.classData = classData;
      this.autoAdvance = classData.autoAdvance ? true : false;
      this.autoMin = classData.autoAdvanceMin;
      this.autoSec = classData.autoAdvanceSec;
    },
  },
  async beforeMount() {
    this.fetchGame();
    this.listenPlayers();
    this.counters = await getCountersObj();
  },
  components: {
    timeElapsed,
  },
};
</script>

<style>
.controlCard {
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius);
  margin: 1rem;
  padding: 0.8rem 1.6rem;
}
.controlCard h2 {
  text-align: center;
}
.rcol {
  text-align: right;
}
.transactionrow {
  background-color: var(--color-background-mute);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}
.transactionrow:nth-child(even) {
  filter: brightness(0.92);
}
</style>
