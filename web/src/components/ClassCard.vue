<template>
  <n-config-provider :theme="null">
    <div class="contrastcard">
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
            <h1>3</h1>
            <h4>Players</h4>
          </div>
          <div class="cardStat">
            <h1>3</h1>
            <h4>Players</h4>
          </div>
          <div class="cardStat">
            <h1>3</h1>
            <h4>Players</h4>
          </div>
        </div>
      </div>
      <div class="footer">
        <n-button secondary type="error" @click="deleteClass">
          <template #icon>
            <n-icon>
              <bin-icon />
            </n-icon>
          </template>
          Delete
        </n-button>
        <n-button type="success" style="margin-left: 1rem" @click="startGame()">
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
      <div style="width: 100%; display: flex; align-items: flex-start">
        <span style="margin-left: 0.9rem; margin-right: 1rem">Short Selling</span>
        <n-switch :disabled="loadCreate" v-model:value="editClassShortSelling" size="large" />
      </div>
      <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 1rem">
        <n-button secondary type="error" @click="editClassOpen = false">
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
          @click="updateClass()"
          :disabled="!formValid"
          :loading="loadCreate">
          <template #icon>
            <n-icon>
              <checkmark-icon />
            </n-icon>
          </template>
          Update
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
import { deleteDoc, updateDoc } from '../utils/firestore';

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
  },
  data() {
    return {
      editClassOpen: false,
      editClassName: '',
      editClassNPeriods: 8,
      editClassInitialBalance: 5000,
      editClassShortSelling: false,
      validateEditClassName: false,
      validateEditClassNPeriods: false,
      validateEditClassInitialBalance: false,
      loadCreate: false,
    };
  },
  computed: {
    formValid() {
      return !(
        this.editClassName == '' ||
        this.editClassNPeriods == null ||
        this.editClassInitialBalance == null ||
        this.editClassNPeriods < 1 ||
        this.editClassInitialBalance < 10
      );
    },
  },
  methods: {
    startGame() {
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
        });
        this.loadCreate = false;
        this.editClassOpen = false;
        this.refetch();
      }
    },
    async deleteClass() {
      await deleteDoc('classes', this.classData.id);
      this.refetch();
    },
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
