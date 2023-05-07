<template>
  <n-config-provider :theme="null">
    <div class="contrastcard" :style="{ filter: loading ? 'blur(3px) brightness(50%)' : '' }">
      <div class="maincontent">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          ">
          <h1 style="font-weight: 700">{{ classData.name }}</h1>

          <n-button circle text style="font-size: 1.4rem" @click="editClassOpen = true">
            <n-icon class="hoverRotate"><settings-icon /></n-icon>
          </n-button>
        </div>
        <div style="display: flex; justify-content: space-between">
          <div class="cardStat">
            <h1>{{ nPlayers }}</h1>
            <h4>Player{{ nPlayers == 1 ? '' : 's' }}</h4>
          </div>
          <div class="cardStat">
            <h1>{{ classData.started ? 'YES' : 'NO' }}</h1>
            <h4>Started</h4>
          </div>
          <div class="cardStat">
            <h1>{{ classData.period }}</h1>
            <h4>Period</h4>
          </div>
        </div>
      </div>
      <div class="footer">
        <n-button
          secondary
          type="error"
          @click="deleteClass"
          :loading="loading"
          :disabled="loading">
          <template #icon>
            <n-icon>
              <bin-icon />
            </n-icon>
          </template>
          Delete
        </n-button>
        <n-button type="success" style="margin-left: 1rem" @click="startGame()" :disabled="loading">
          <template #icon>
            <n-icon>
              <play-icon />
            </n-icon>
          </template>
          Start
        </n-button>
      </div>
    </div>
    <modal :show="editClassOpen">
      <h1 style="font-weight: 700; padding-bottom: 1rem">{{ classData.name }} Settings</h1>
      <span class="inputLabel"
        >Name
        <span class="errorLabel" v-if="editClassName == '' && validateEditClassName"
          >*required</span
        ></span
      >
      <n-input
        :disabled="loadCreate"
        size="large"
        placeholder="Name"
        class="bpad"
        v-model:value="editClassName"
        @blur="validateEditClassName = true"
        :status="editClassName == '' && validateEditClassName ? 'error' : ''" />
      <span class="inputLabel"
        >Number of Periods
        <span class="errorLabel" v-if="editClassNPeriods == null && validateEditClassNPeriods"
          >*required</span
        ></span
      >
      <n-input-number
        :disabled="loadCreate"
        size="large"
        placeholder="Number of Periods"
        class="bpad"
        v-model:value="editClassNPeriods"
        :min="1"
        :max="30"
        @blur="validateEditClassNPeriods = true"
        :status="editClassNPeriods == null && validateEditClassNPeriods ? 'error' : ''" />
      <span class="inputLabel"
        >Initial Balance
        <span
          class="errorLabel"
          v-if="editClassInitialBalance == null && validateEditClassInitialBalance"
          >*required</span
        ></span
      >
      <n-input-number
        :disabled="loadCreate"
        size="large"
        placeholder="Initial Balance"
        class="bpad"
        v-model:value="editClassInitialBalance"
        :min="10"
        :step="10"
        @blur="validateEditClassInitialBalance = true"
        :status="editClassInitialBalance == null && validateEditClassInitialBalance ? 'error' : ''">
        <template #prefix> $ </template></n-input-number
      >
      <span class="inputLabel" v-if="editClassShortSelling"
        >Holding Cost
        <span class="errorLabel" v-if="editClassHoldingCost == null && validateEditClassHoldingCost"
          >*required</span
        ></span
      >
      <n-input-number
        v-if="editClassShortSelling"
        :disabled="loadCreate"
        size="large"
        placeholder="Holding Cost"
        class="bpad"
        v-model:value="editClassHoldingCost"
        :min="0"
        :step="0.1"
        @blur="validateEditClassHoldingCost = true"
        :status="editClassHoldingCost == null && validateEditClassHoldingCost ? 'error' : ''">
        <template #suffix> % </template></n-input-number
      >
      <div style="width: 100%; display: flex; align-items: flex-start">
        <n-switch :disabled="loadCreate" v-model:value="editClassShortSelling" size="large" />
        <span style="margin-left: 0.9rem; margin-top: 0.15rem">Short Selling</span>
      </div>
      <h2 style="padding-top: 1rem; padding-bottom: 0.4rem">Financials</h2>
      <n-space vertical style="width: 100%">
        <div style="width: 100%; display: flex; align-items: flex-start">
          <n-switch
            :disabled="loadCreate"
            v-model:value="editClassquarterlyRevenueEnabled"
            size="large" />
          <span style="margin-left: 0.9rem; margin-top: 0.15rem">Quarterly Revenue</span>
        </div>
        <div style="width: 100%; display: flex; align-items: flex-start">
          <n-switch :disabled="loadCreate" v-model:value="editClassebitEnabled" size="large" />
          <span style="margin-left: 0.9rem; margin-top: 0.15rem">EBIT</span>
        </div>
        <div style="width: 100%; display: flex; align-items: flex-start">
          <n-switch
            :disabled="loadCreate"
            v-model:value="editClassprofitMarginEnabled"
            size="large" />
          <span style="margin-left: 0.9rem; margin-top: 0.15rem">Profit Margin</span>
        </div>
        <div style="width: 100%; display: flex; align-items: flex-start">
          <n-switch :disabled="loadCreate" v-model:value="editClasspeRatioEnabled" size="large" />
          <span style="margin-left: 0.9rem; margin-top: 0.15rem">PE Ratio</span>
        </div>
        <div style="width: 100%; display: flex; align-items: flex-start">
          <n-switch :disabled="loadCreate" v-model:value="editClasscashEnabled" size="large" />
          <span style="margin-left: 0.9rem; margin-top: 0.15rem">Cash</span>
        </div>
        <div style="width: 100%; display: flex; align-items: flex-start">
          <n-switch :disabled="loadCreate" v-model:value="editClassdebtEnabled" size="large" />
          <span style="margin-left: 0.9rem; margin-top: 0.15rem">Debt</span>
        </div>
        <div style="width: 100%; display: flex; align-items: flex-start">
          <n-switch
            :disabled="loadCreate"
            v-model:value="editClassmarginOfSafetyEnabled"
            size="large" />
          <span style="margin-left: 0.9rem; margin-top: 0.15rem">Margin of Safety</span>
        </div>
      </n-space>
      <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 1rem">
        <n-button
          type="success"
          style="margin-left: 1rem"
          @click="updateClass()"
          :disabled="!formValid"
          :loading="loadCreate">
          <template #icon>
            <n-icon>
              <checkmark-icon />
            </n-icon>
          </template>
          Done
        </n-button>
      </div>
    </modal>
  </n-config-provider>
</template>

<script>
import {
  SettingsOutline as SettingsIcon,
  TrashBinOutline as BinIcon,
  Play as PlayIcon,
  Checkmark as CheckmarkIcon,
  Close as CloseIcon,
} from '@vicons/ionicons5';
import {
  deleteDoc,
  updateDoc,
  query,
  queryDocs,
  where,
  createCollectionRef,
  listenQuery,
} from '../utils/firestore';
import { getFn } from '../utils/functions';
import { formatMoney } from '../utils/format';
import { useMessage } from 'naive-ui';

export default {
  components: { SettingsIcon, BinIcon, PlayIcon, CheckmarkIcon, CloseIcon },
  props: {
    classData: {},
    refetch: {},
  },
  mounted() {
    this.editClassName = this.classData.name;
    this.editClassNPeriods = this.classData.nPeriods;
    this.editClassInitialBalance = this.classData.initialBalance;
    this.editClassShortSelling = this.classData.shortSelling;

    this.editClassquarterlyRevenueEnabled = this.classData.quarterlyRevenueEnabled;
    this.editClassebitEnabled = this.classData.ebitEnabled;
    this.editClassprofitMarginEnabled = this.classData.profitMarginEnabled;
    this.editClasspeRatioEnabled = this.classData.peRatioEnabled;
    this.editClasscashEnabled = this.classData.cashEnabled;
    this.editClassdebtEnabled = this.classData.debtEnabled;
    this.editClassmarginOfSafetyEnabled = this.classData.marginOfSafetyEnabled;
    this.editClassHoldingCost = this.classData.holdingCost;
  },
  data() {
    return {
      editClassOpen: false,
      editClassName: '',
      editClassNPeriods: 8,
      editClassInitialBalance: 5000,
      editClassShortSelling: false,
      editClassquarterlyRevenueEnabled: false,
      editClassebitEnabled: false,
      editClassprofitMarginEnabled: false,
      editClasspeRatioEnabled: false,
      editClasscashEnabled: false,
      editClassdebtEnabled: false,
      editClassmarginOfSafetyEnabled: false,
      editClassHoldingCost: 2,
      validateEditClassName: false,
      validateEditClassNPeriods: false,
      validateEditClassInitialBalance: false,
      validateEditClassHoldingCost: false,
      loadCreate: false,
      loading: false,
      nPlayers: 0,
    };
  },
  computed: {
    formValid() {
      return !(
        this.editClassName == '' ||
        this.editClassNPeriods == null ||
        this.editClassInitialBalance == null ||
        this.editClassNPeriods < 1 ||
        this.editClassInitialBalance < 10 ||
        this.editClassHoldingCost < 0
      );
    },
  },
  created() {
    this.listenPlayers();
  },
  methods: {
    formatMoney,
    listenPlayers() {
      listenQuery(
        query(createCollectionRef('players'), where('classID', '==', this.classData.id)),
        (res) => {
          this.nPlayers = res.size;
        }
      );
    },
    startGame() {
      if (this.classData.started) {
        this.$router.push(`/run/${this.classData.id}/c`);
        return;
      }
      this.$router.push(`/run/${this.classData.id}/s`);
    },
    async updateClass() {
      if (this.formValid) {
        this.loadCreate = true;
        await updateDoc('classes', this.classData.id, {
          name: this.editClassName,
          nPeriods: this.editClassNPeriods,
          initialBalance: this.editClassInitialBalance,
          shortSelling: this.editClassShortSelling,
          quarterlyRevenueEnabled: this.editClassquarterlyRevenueEnabled,
          ebitEnabled: this.editClassebitEnabled,
          profitMarginEnabled: this.editClassprofitMarginEnabled,
          peRatioEnabled: this.editClasspeRatioEnabled,
          cashEnabled: this.editClasscashEnabled,
          debtEnabled: this.editClassdebtEnabled,
          marginOfSafetyEnabled: this.editClassmarginOfSafetyEnabled,
          holdingCost: this.editClassHoldingCost,
        });
        this.loadCreate = false;
        this.editClassOpen = false;
        this.refetch();
      }
    },
    async deleteClass() {
      this.loading = true;
      window.$message.warning('Deleting class, it will take some time, DO NOT close this tab!', {
        duration: 8000,
      });
      const classId = this.classData.id;
      await deleteDoc('classes', classId);

      //delete all players
      const firestorePlayers = await queryDocs(
        query(createCollectionRef('players'), where('classID', '==', classId))
      );
      const playerIds = [];
      firestorePlayers.forEach((p) => {
        deleteDoc('players', p.id);
        playerIds.push(p.id);
      });

      const deleteUsers = getFn('deleteUsers');
      await deleteUsers({ uids: playerIds });

      this.refetch();
      this.loading = false;
    },
  },
  setup() {
    window.$message = useMessage();
  },
};
</script>

<style scoped>
.cardStat {
  display: flex;
  flex-direction: column;
  line-height: normal;
}
.cardStat h1 {
  font-weight: 700;
}

.hoverRotate {
  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.hoverRotate:hover {
  transform: rotate(45deg);
}
</style>
