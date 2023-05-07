<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 2rem;
      position: relative;
    ">
    <h1>Manage Classes</h1>
    <n-button
      style="position: absolute; right: 0"
      secondary
      type="success"
      @click="newClassOpen = true">
      <template #icon>
        <n-icon>
          <add-icon />
        </n-icon> </template
      >New class
    </n-button>
  </div>
  <modal :show="newClassOpen">
    <h1 style="font-weight: 700; padding-bottom: 1rem">New Class</h1>
    <span class="inputLabel"
      >Name
      <span class="errorLabel" v-if="newClassName == '' && validateNewClassName"
        >*required</span
      ></span
    >
    <n-input
      :disabled="loadCreate"
      size="large"
      placeholder="Name"
      class="bpad"
      v-model:value="newClassName"
      @blur="validateNewClassName = true"
      :status="newClassName == '' && validateNewClassName ? 'error' : ''" />
    <span class="inputLabel"
      >Number of Periods
      <span class="errorLabel" v-if="newClassNPeriods == null && validateNewClassNPeriods"
        >*required</span
      ></span
    >
    <n-input-number
      :disabled="loadCreate"
      size="large"
      placeholder="Number of Periods"
      class="bpad"
      v-model:value="newClassNPeriods"
      :min="1"
      :max="30"
      @blur="validateNewClassNPeriods = true"
      :status="newClassNPeriods == null && validateNewClassNPeriods ? 'error' : ''" />
    <span class="inputLabel"
      >Initial Balance
      <span
        class="errorLabel"
        v-if="newClassInitialBalance == null && validateNewClassInitialBalance"
        >*required</span
      ></span
    >
    <n-input-number
      :disabled="loadCreate"
      size="large"
      placeholder="Initial Balance"
      class="bpad"
      v-model:value="newClassInitialBalance"
      :min="10"
      :step="10"
      @blur="validateNewClassInitialBalance = true"
      :status="newClassInitialBalance == null && validateNewClassInitialBalance ? 'error' : ''">
      <template #prefix> $ </template></n-input-number
    >
    <span class="inputLabel" v-if="newClassShortSelling"
      >Holding Cost
      <span class="errorLabel" v-if="newClassHoldingCost == null && validateNewClassHoldingCost"
        >*required</span
      ></span
    >
    <n-input-number
      v-if="newClassShortSelling"
      :disabled="loadCreate"
      size="large"
      placeholder="Holding Cost"
      class="bpad"
      v-model:value="newClassHoldingCost"
      :min="0"
      :step="0.1"
      @blur="validateNewClassHoldingCost = true"
      :status="newClassHoldingCost == null && validateNewClassHoldingCost ? 'error' : ''">
      <template #suffix> % </template></n-input-number
    >
    <div style="width: 100%; display: flex; align-items: flex-start">
      <n-switch :disabled="loadCreate" v-model:value="newClassShortSelling" size="large" />
      <span style="margin-left: 0.9rem; margin-top: 0.15rem">Short Selling</span>
    </div>
    <h2 style="padding-top: 1rem; padding-bottom: 0.4rem">Financials</h2>
    <n-space vertical style="width: 100%">
      <div style="width: 100%; display: flex; align-items: flex-start">
        <n-switch
          :disabled="loadCreate"
          v-model:value="newClassquarterlyRevenueEnabled"
          size="large" />
        <span style="margin-left: 0.9rem; margin-top: 0.15rem">Quarterly Revenue</span>
      </div>
      <div style="width: 100%; display: flex; align-items: flex-start">
        <n-switch :disabled="loadCreate" v-model:value="newClassebitEnabled" size="large" />
        <span style="margin-left: 0.9rem; margin-top: 0.15rem">EBIT</span>
      </div>
      <div style="width: 100%; display: flex; align-items: flex-start">
        <n-switch :disabled="loadCreate" v-model:value="newClassprofitMarginEnabled" size="large" />
        <span style="margin-left: 0.9rem; margin-top: 0.15rem">Profit Margin</span>
      </div>
      <div style="width: 100%; display: flex; align-items: flex-start">
        <n-switch :disabled="loadCreate" v-model:value="newClasspeRatioEnabled" size="large" />
        <span style="margin-left: 0.9rem; margin-top: 0.15rem">PE Ratio</span>
      </div>
      <div style="width: 100%; display: flex; align-items: flex-start">
        <n-switch :disabled="loadCreate" v-model:value="newClasscashEnabled" size="large" />
        <span style="margin-left: 0.9rem; margin-top: 0.15rem">Cash</span>
      </div>
      <div style="width: 100%; display: flex; align-items: flex-start">
        <n-switch :disabled="loadCreate" v-model:value="newClassdebtEnabled" size="large" />
        <span style="margin-left: 0.9rem; margin-top: 0.15rem">Debt</span>
      </div>
      <div style="width: 100%; display: flex; align-items: flex-start">
        <n-switch
          :disabled="loadCreate"
          v-model:value="newClassmarginOfSafetyEnabled"
          size="large" />
        <span style="margin-left: 0.9rem; margin-top: 0.15rem">Margin of Safety</span>
      </div>
    </n-space>

    <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 1rem">
      <n-button secondary type="error" @click="newClassOpen = false">
        <template #icon>
          <n-icon>
            <close-icon />
          </n-icon>
        </template>
        Cancel
      </n-button>
      <n-button
        type="success"
        style="margin-left: 1rem"
        @click="createClass()"
        :disabled="!formValid"
        :loading="loadCreate">
        <template #icon>
          <n-icon>
            <checkmark-icon />
          </n-icon>
        </template>
        Create
      </n-button>
    </div>
  </modal>
  <n-grid :cols="3" x-gap="25" y-gap="25" v-if="classData.length > 0">
    <n-gi v-for="c in classData" key="c.id">
      <class-card :classData="c" :refetch="loadClasses" />
    </n-gi>
  </n-grid>
  <div style="width: 100%; padding-top: 3rem; text-align: center" v-else>
    <h3 style="font-weight: 700">No classes created.</h3>
  </div>
</template>

<script>
import { Add as AddIcon, Checkmark as CheckmarkIcon, Close as CloseIcon } from '@vicons/ionicons5';
import ClassCard from '../components/ClassCard.vue';
import Modal from '../components/Modal.vue';
import { forceUser } from '../utils/auth';
import {
  getDoc,
  setDoc,
  serverTimestamp,
  createCollectionRef,
  orderBy,
  query,
  queryDocs,
} from '../utils/firestore';

export default {
  components: { ClassCard, AddIcon, Modal, CheckmarkIcon, CloseIcon },
  data() {
    return {
      newClassOpen: false,
      newClassName: '',
      newClassNPeriods: 8,
      newClassInitialBalance: 5000,
      newClassShortSelling: false,
      newClassquarterlyRevenueEnabled: false,
      newClassebitEnabled: false,
      newClassprofitMarginEnabled: false,
      newClasspeRatioEnabled: false,
      newClasscashEnabled: false,
      newClassdebtEnabled: false,
      newClassmarginOfSafetyEnabled: false,
      newClassHoldingCost: 2,
      validateNewClassName: false,
      validateNewClassNPeriods: false,
      validateNewClassInitialBalance: false,
      validateNewClassHoldingCost: false,
      loadCreate: false,
      classData: [],
    };
  },
  computed: {
    formValid() {
      return !(
        this.newClassName == '' ||
        this.newClassNPeriods == null ||
        this.newClassInitialBalance == null ||
        this.newClassNPeriods < 1 ||
        this.newClassInitialBalance < 10 ||
        this.newClassHoldingCost < 0
      );
    },
  },
  methods: {
    async loadClasses() {
      const q = query(createCollectionRef('classes'), orderBy('created'));
      const classes = await queryDocs(q);
      const newClassData = [];
      classes.forEach((c) => {
        newClassData.push({ ...c.data(), id: c.id });
      });
      this.classData = newClassData;
    },
    async createClass() {
      if (this.formValid) {
        this.loadCreate = true;
        let newID = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
        while (await getDoc('classes', newID)) {
          newID = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
        }
        await setDoc('classes', newID, {
          name: this.newClassName,
          ownerID: forceUser().uid,
          nPeriods: this.newClassNPeriods,
          initialBalance: this.newClassInitialBalance,
          shortSelling: this.newClassShortSelling,
          quarterlyRevenueEnabled: this.newClassquarterlyRevenueEnabled,
          ebitEnabled: this.newClassebitEnabled,
          profitMarginEnabled: this.newClassprofitMarginEnabled,
          peRatioEnabled: this.newClasspeRatioEnabled,
          cashEnabled: this.newClasscashEnabled,
          debtEnabled: this.newClassdebtEnabled,
          marginOfSafetyEnabled: this.newClassmarginOfSafetyEnabled,
          created: serverTimestamp(),
          nextPeriod: serverTimestamp(),
          started: false,
          period: 0,
          autoAdvance: false,
          autoAdvanceMin: 5,
          autoAdvanceSec: 0,
          holdingCost: this.newClassHoldingCost,
        });
        this.loadCreate = false;
        this.newClassOpen = false;
        this.loadClasses();
        this.newClassOpen = false;

        await this.loadDefaults();
      }
    },
    async loadDefaults() {
      const settings = await getDoc('settings', '0');
      this.newClassName = '';
      this.newClassNPeriods = settings.nPeriods;
      this.newClassInitialBalance = settings.initialBalance;
      this.newClassShortSelling = settings.shortSelling;
      this.newClassquarterlyRevenueEnabled = settings.quarterlyRevenueEnabled;
      this.newClassebitEnabled = settings.ebitEnabled;
      this.newClassprofitMarginEnabled = settings.profitMarginEnabled;
      this.newClasspeRatioEnabled = settings.peRatioEnabled;
      this.newClasscashEnabled = settings.cashEnabled;
      this.newClassdebtEnabled = settings.debtEnabled;
      this.newClassmarginOfSafetyEnabled = settings.marginOfSafetyEnabled;
      this.newClassHoldingCost = settings.holdingCost;
      this.validateNewClassName = false;
      this.validateNewClassNPeriods = false;
      this.validateNewClassInitialBalance = false;
      this.validateNewClassHoldingCost = false;
    },
  },
  async beforeMount() {
    this.loadClasses();
    this.loadDefaults();
  },
};
</script>
