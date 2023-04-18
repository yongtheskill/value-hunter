<template>
  <n-grid :cols="3">
    <n-gi style="display: flex; justify-content: flex-start; align-items: center"
      ><n-button style="margin-left: 1.5rem" @click="close()"
        ><template #icon
          ><n-icon><back-icon /></n-icon></template
        >Back</n-button
      ></n-gi
    >
    <n-gi style="display: flex; justify-content: center; align-items: center"
      ><h1>{{ counter.stockSymbol }}</h1></n-gi
    >
    <n-gi></n-gi>
  </n-grid>
  <span style="opacity: 0.5">{{ counter.name }}</span>

  <div style="padding-top: 2.5rem; font-size: 3.5rem; font-weight: 700">
    {{ formatMoney(counter.priceHistory[period]) }}
  </div>
  <h2
    style="padding-bottom: 2.5rem"
    :class="{
      trendLabel: true,
      positiveTrend: counter.priceHistory[period] - counter.priceHistory[period - 1] > 0,
      negativeTrend: counter.priceHistory[period] - counter.priceHistory[period - 1] < 0,
    }">
    {{ formatMoney(counter.priceHistory[period] - counter.priceHistory[period - 1])
    }}<n-icon style="margin-left: 2px"
      ><up-icon
        v-if="counter.priceHistory[period] - counter.priceHistory[period - 1] > 0" /><down-icon
        v-else-if="
          counter.priceHistory[period] - counter.priceHistory[period - 1] < 0
        " /><neutral-icon v-else
    /></n-icon>
  </h2>

  <div style="width: 100%; height: 12rem" class="chartContainer">
    <canvas ref="chart"></canvas>
  </div>

  <n-radio-group
    v-model:value="action"
    style="width: 100%; padding: 1.8rem 1.5rem 1rem 1.5rem; display: flex; z-index: 9999">
    <n-radio-button :value="0" label="Buy" />
    <n-radio-button :value="1" label="Sell" :disabled="qtyOwned < 1" />
    <n-radio-button :value="2" label="Short" v-if="doShort" />
  </n-radio-group>

  <div
    v-if="action == 0"
    style="padding-top: 3.5rem; width: 100%; padding-left: 1.5rem; padding-right: 1.5rem">
    <n-grid :cols="2" :x-gap="16" :y-gap="16">
      <n-gi
        ><span>Purchasing Power</span>
        <h2 style="font-weight: 600">{{ formatMoney(playerData.money) }}</h2></n-gi
      >
      <n-gi
        ><span>Available Quantity</span>
        <h2 style="font-weight: 600">{{ availableQty }}</h2></n-gi
      >
      <n-gi :span="2"
        ><span>Quantity</span
        ><n-input-number
          placeholder="Number"
          style="padding-top: 0.3rem"
          :min="1"
          :max="availableQty"
          v-model:value="buyCount" />
      </n-gi>
      <n-gi style="padding-top: 0.5rem">
        <span>Order Total</span>
        <h2 style="font-weight: 600">{{ formatMoney(buyOrderTotal) }}</h2>
      </n-gi>
      <n-gi style="padding-top: 0.5rem">
        <n-button
          style="width: 100%; height: 100%"
          type="success"
          @click="buy()"
          :loading="buyLoading"
          :disabled="buyLoading"
          >Place Order</n-button
        >
      </n-gi>
    </n-grid>
  </div>

  <div
    v-else-if="action == 1"
    style="padding-top: 3.5rem; width: 100%; padding-left: 1.5rem; padding-right: 1.5rem">
    <n-grid :cols="2" :x-gap="16" :y-gap="16">
      <n-gi
        ><span>Quantity Owned</span>
        <h2 style="font-weight: 600">{{ qtyOwned }}</h2></n-gi
      >
      <n-gi
        ><span>Value Owned</span>
        <h2 style="font-weight: 600">{{ formatMoney(ownedValue) }}</h2></n-gi
      >
      <n-gi :span="2"
        ><span>Quantity</span
        ><n-input-number
          placeholder="Number"
          style="padding-top: 0.3rem"
          :min="1"
          :max="qtyOwned"
          v-model:value="sellCount" />
      </n-gi>
      <n-gi style="padding-top: 0.5rem">
        <span>Order Total</span>
        <h2 style="font-weight: 600">{{ formatMoney(sellOrderTotal) }}</h2>
      </n-gi>
      <n-gi style="padding-top: 0.5rem">
        <n-button
          style="width: 100%; height: 100%"
          type="success"
          @click="sell()"
          :loading="buyLoading"
          :disabled="buyLoading"
          >Place Order</n-button
        >
      </n-gi>
    </n-grid>
  </div>

  <div v-else style="padding-top: 3.5rem; width: 100%; padding-left: 1.5rem; padding-right: 1.5rem">
    <n-grid :cols="2" :x-gap="16" :y-gap="16">
      <n-gi
        ><span>Quantity Shorted</span>
        <h2 style="font-weight: 600">{{ totalNShorts }}</h2></n-gi
      >
      <n-gi
        ><span>Total Value Shorted</span>
        <h2 style="font-weight: 600">{{ formatMoney(totalShortedValue) }}</h2>
        <span style="font-size: 0.6rem"
          ><n-icon style="margin-right: 2px"><info-icon /></n-icon>Max. $100,000</span
        ></n-gi
      >
    </n-grid>
    <n-radio-group
      v-model:value="isShortSelling"
      style="width: 100%; display: flex; z-index: 9999; margin-top: 1.5rem">
      <n-radio-button :value="true" label="Sell" />
      <n-radio-button :value="false" label="Cover" :disabled="totalNShorts <= 0" />
    </n-radio-group>

    <div style="padding: 1rem 0" v-if="isShortSelling">
      <n-grid :cols="2" :x-gap="16" :y-gap="16">
        <n-gi :span="2"
          ><span>Quantity</span
          ><n-input-number
            placeholder="Number"
            style="padding-top: 0.3rem"
            :min="1"
            :max="maxShort"
            v-model:value="shortCount" />
        </n-gi>
        <n-gi style="padding-top: 0.5rem">
          <span>Sell Order Total</span>
          <h2 style="font-weight: 600">{{ formatMoney(shortTotal) }}</h2>
        </n-gi>
        <n-gi style="padding-top: 0.5rem">
          <n-button
            style="width: 100%; height: 100%"
            type="success"
            @click="short()"
            :loading="shortLoading"
            :disabled="shortLoading"
            >Place Order</n-button
          >
        </n-gi>
      </n-grid>
    </div>
    <div style="padding: 1rem 0" v-else>
      <n-grid :cols="2" :x-gap="16" :y-gap="16">
        <n-gi
          ><span>Quantity</span
          ><n-input-number
            placeholder="Number"
            style="padding-top: 0.3rem"
            :min="1"
            :max="totalNShorts"
            v-model:value="coverCount" />
        </n-gi>
        <n-gi style="padding-top: 0.5rem">
          <span>Profit</span>
          <h2 style="font-weight: 600">
            {{ formatMoney(currentProfit) }}
          </h2>
        </n-gi>
        <n-gi style="padding-top: 0.5rem">
          <span>Order Total</span>
          <h2 style="font-weight: 600">{{ formatMoney(coverTotal) }}</h2>
        </n-gi>
        <n-gi style="padding-top: 0.5rem">
          <n-button
            style="width: 100%; height: 100%"
            type="success"
            @click="cover()"
            :loading="shortLoading"
            :disabled="shortLoading"
            >Place Order</n-button
          >
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script>
import {
  CaretBack as backIcon,
  ArrowUp as upIcon,
  ArrowDown as downIcon,
  Remove as neutralIcon,
  InformationCircle as infoIcon,
} from '@vicons/ionicons5';
import { formatMoney, priceHistoryToGraphData } from '../../utils/format';
import { getDoc, updateDoc } from '../../utils/firestore';
import { forceUser } from '../../utils/auth';
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

export default {
  data() {
    return {
      action: 0,
      playerData: {},
      //buying
      buyCount: 1,
      buyLoading: false,
      //selling
      sellCount: 1,
      //shorting
      nShorted: 0,
      shortedValue: 0,
      shortCount: 1,
      coverCount: 1,
      shortLoading: false,
      isShortSelling: true,
    };
  },
  computed: {
    //sell
    availableQty() {
      if (!this.playerData.money) return 0;
      return Math.floor(this.playerData.money / this.counter.priceHistory[this.period]);
    },
    sellOrderTotal() {
      return this.sellCount * this.counter.priceHistory[this.period];
    },
    //buy
    qtyOwned() {
      if (!this.playerData.money) return 0;
      return this.playerData.holdings[this.counter.id];
    },
    ownedValue() {
      return this.qtyOwned * this.counter.priceHistory[this.period];
    },
    buyOrderTotal() {
      return this.buyCount * this.counter.priceHistory[this.period];
    },
    //short
    maxShort() {
      return Math.floor((100000 - this.totalShortedValue) / this.counter.priceHistory[this.period]);
    },
    shortTotal() {
      return this.shortCount * this.counter.priceHistory[this.period];
    },
    coverTotal() {
      return this.coverCount * this.counter.priceHistory[this.period];
    },
    totalNShorts() {
      if (!this.playerData.money) return 0;
      return this.calcTotalNShorts(this.playerData.shortRecords[this.counter.id]);
    },
    totalShortedValue() {
      if (!this.playerData.money) return 0;
      return this.calcTotalShortedValue(this.playerData.shortRecords[this.counter.id]);
    },
    currentProfit() {
      if (!this.playerData.money) return 0;
      return (
        this.calcTotalShortProfits(this.calcShortCover()) -
        this.calcTotalShortProfits(this.playerData.shortRecords[this.counter.id])
      );
    },
  },
  methods: {
    calcTotalOwnedValue() {
      let value = 0;
      for (const transaction of this.playerData.transactions) {
        if (!transaction.isStock) continue;
        if (transaction.isBuy) {
          value += transaction.nShares * transaction.price;
          continue;
        }
        value -= transaction.nShares * transaction.price;
      }
      return value;
    },
    calcShortCover() {
      const shortData = this.playerData.shortRecords[this.counter.id];
      const shortList = [];
      for (const period in shortData) {
        const newPeriod = { ...shortData[period], period: period };
        shortList.push(newPeriod);
      }
      shortList.sort((a, b) => b.price - a.price);

      //start covering from highest value
      const currentPrice = this.counter.priceHistory[this.period];
      let remainingN = this.coverCount;
      for (const period of shortList) {
        const diff = period.nSold - period.nCovered;
        if (diff <= 0) continue;
        if (diff > remainingN) {
          period.nCovered += remainingN;
          period.profit += remainingN * (period.price - currentPrice);
          break;
        }
        remainingN -= diff;
        period.profit += diff * (period.price - currentPrice);
        period.nCovered = period.nSold;
      }

      //return formatting to object after done
      const newData = {};
      for (const p of shortList) {
        const { period, ...rest } = p;
        newData[p.period] = rest;
      }
      return newData;
    },
    async cover() {
      this.shortLoading = true;
      const userData = await this.loadPlayerAsync();
      userData.shortRecords[this.counter.id] = this.calcShortCover();

      userData.transactions.push({
        isStock: false,
        isShort: true,
        isCover: true,
        counterId: this.counter.id,
        nShares: this.coverCount,
        period: this.period,
        price: this.counter.priceHistory[this.period],
      });

      await updateDoc('players', forceUser().uid, userData);
      await this.loadPlayerAsync();
      window.$message.success('Short cover order placed!');
      if (this.calcTotalNShorts(userData.shortRecords[this.counter.id]) == 0)
        this.isShortSelling = true;
      this.coverCount = 1;
      this.shortLoading = false;
    },
    async short() {
      this.shortLoading = true;
      const userData = await this.loadPlayerAsync();

      //add record for this counter
      if (!userData.shortRecords[this.counter.id]) userData.shortRecords[this.counter.id] = {};
      //add record for this time period
      if (!userData.shortRecords[this.counter.id][this.period.toString()])
        userData.shortRecords[this.counter.id][this.period.toString()] = {
          nSold: 0,
          price: 0,
          nCovered: 0,
          profit: 0,
        };
      const shortRecord = userData.shortRecords[this.counter.id][this.period.toString()];
      shortRecord.nSold += this.shortCount;
      shortRecord.price = this.counter.priceHistory[this.period];

      userData.transactions.push({
        isStock: false,
        isShort: true,
        isCover: false,
        counterId: this.counter.id,
        nShares: this.shortCount,
        period: this.period,
        price: this.counter.priceHistory[this.period],
      });

      await updateDoc('players', forceUser().uid, userData);
      await this.loadPlayerAsync();
      window.$message.success('Short sell order placed!');
      this.shortCount = 1;
      this.shortLoading = false;
    },
    async sell() {
      this.buyLoading = true;
      const userData = await this.loadPlayerAsync();
      //add to transactions
      userData.transactions.push({
        isStock: true,
        isBuy: false,
        counterId: this.counter.id,
        nShares: this.sellCount,
        period: this.period,
        price: this.counter.priceHistory[this.period],
      });

      //add to holdings
      userData.holdings[this.counter.id] -= this.sellCount;

      //update money
      userData.money += this.sellCount * this.counter.priceHistory[this.period];

      await updateDoc('players', forceUser().uid, userData);

      await this.loadPlayerAsync();
      window.$message.success('Sell order placed!');
      if (userData.holdings[this.counter.id] == 0) this.action = 0;
      this.sellCount = 1;
      this.buyLoading = false;
    },
    async buy() {
      this.buyLoading = true;
      const userData = await this.loadPlayerAsync();
      //add to transactions
      userData.transactions.push({
        isStock: true,
        isBuy: true,
        counterId: this.counter.id,
        nShares: this.buyCount,
        period: this.period,
        price: this.counter.priceHistory[this.period],
      });

      //add to holdings
      if (!!userData.holdings[this.counter.id]) {
        userData.holdings[this.counter.id] += this.buyCount;
      } else {
        userData.holdings[this.counter.id] = this.buyCount;
      }

      //update money
      userData.money -= this.buyCount * this.counter.priceHistory[this.period];

      await updateDoc('players', forceUser().uid, userData);

      await this.loadPlayerAsync();
      window.$message.success('Buy order placed!');
      this.buyCount = 1;
      this.buyLoading = false;
    },
    calcTotalShortProfits(records) {
      if (!records) return 0;
      let totalProfit = 0;
      for (const period in records) {
        totalProfit += records[period].profit;
      }
      return totalProfit;
    },
    calcTotalNShorts(records) {
      if (!records) return 0;
      let totalNShorted = 0;
      for (const period in records) {
        const shortBal = records[period].nSold - records[period].nCovered;
        totalNShorted += shortBal;
      }
      return totalNShorted;
    },
    calcTotalShortedValue(records) {
      if (!records) return 0;
      let totalShortedValue = 0;

      for (const period in records) {
        const shortBal = records[period].nSold - records[period].nCovered;
        const shortAmt = shortBal * records[period].price;
        totalShortedValue += shortAmt;
      }
      return totalShortedValue;
    },
    async loadPlayerAsync() {
      const player = await getDoc('players', forceUser().uid);
      this.playerData = player;
      return player;
    },
    forceUser,
    formatMoney,
  },
  mounted() {
    this.loadPlayerAsync();

    const ctx = this.$refs.chart;

    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);

    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            data: priceHistoryToGraphData(this.counter.priceHistory, this.period),
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: false,
            grid: { display: false, drawOnChartArea: false },
          },
          y: {
            grid: { display: true, color: '#fff3', drawTicks: false },
            ticks: {
              callback(value, index, ticks) {
                return '$' + value;
              },
            },
          },
        },
        datasets: {
          line: {
            pointStyle: false,
            borderColor: '#63e2b7',
            borderCapStyle: 'round',
          },
        },
      },
    });
  },
  props: ['counter', 'period', 'doShort', 'close'],
  components: {
    infoIcon,
    backIcon,
    upIcon,
    downIcon,
    neutralIcon,
  },
  setup() {
    window.$message = useMessage();
  },
};
</script>

<style>
.n-radio-button {
  flex-grow: 1;
}
.n-radio-button-hand {
  display: flex;
  text-align: center;
}
.n-radio-group .n-radio__label {
  display: flex;
  justify-content: center;
}
</style>
