<template>
  <main
    style="
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
    <div class="contrastcard">
      <div class="maincontent">
        <n-config-provider :theme="null">
          <div style="display: flex; flex-direction: column; align-items: flex-start">
            <h1 style="font-weight: 700; margin-bottom: 0.5rem">Join Game</h1>

            <div style="padding-left: 0.3rem">Game Code</div>
            <n-input
              size="large"
              placeholder="Enter Code"
              class="bpad"
              v-model:value="code"
              :allow-input="numberOnly"
              maxlength="4"
              show-count
              clearable
              pattern="[0-9]*"
              style="width: 200px"
              :status="valid ? '' : 'error'"
              :loading="loadingCode"
              :disabled="disableFields" />

            <div style="padding-left: 0.3rem" v-if="valid">Name</div>
            <n-input
              v-if="valid"
              size="large"
              placeholder="Your Name"
              class="bpad"
              v-model:value="name"
              maxlength="12"
              show-count
              style="width: 200px"
              :loading="loadingName"
              :disabled="disableFields"
              autofocus />

            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              "
              class="bpad">
              <n-button
                type="success"
                v-if="valid"
                :disabled="!joinable || loadJoin"
                :loading="loadJoin"
                @click="join()">
                Join
              </n-button>
              <div v-show="eMessage != ''" style="color: var(--color-error); font-weight: 700">
                {{ eMessage }}
              </div>
            </div>
          </div>
        </n-config-provider>
      </div>
    </div>
  </main>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, query, queryDocs, where, createCollectionRef, setDoc } from '../utils/firestore';
import { registerPlayer, isAdmin } from '@/utils/auth';
import { mapState } from 'pinia';
import { mapActions } from 'pinia';
import { useClassStore } from '../utils/classStore';
const auth = getAuth();

export default {
  data() {
    return {
      code: '',
      name: '',
      eMessage: '',
      valid: false,
      joinable: false,
      loadingCode: false,
      loadingName: false,
      disableFields: false,
      targetClass: null,
      loadJoin: false,
    };
  },
  watch: {
    started(n) {
      console.log('started: ', n);
    },
    async code(n) {
      this.valid = false;
      this.loadingCode = true;
      if (n.length != 4) {
        this.loadingCode = false;
        return;
      }
      const targetClass = await getDoc('classes', n);
      if (!targetClass) {
        this.eMessage = 'Invalid code!';
        this.loadingCode = false;
        return;
      }
      this.targetClass = targetClass;
      this.eMessage = '';
      this.valid = true;
      this.loadingCode = false;
    },
    async name(n) {
      this.joinable = false;
      this.loadingName = true;
      if (!this.valid) {
        this.loadingName = false;
        return;
      }
      if (n.length < 2) {
        this.eMessage = 'Name too short!';
        this.loadingName = false;
        return;
      }
      if (n.length > 12) {
        this.eMessage = 'Name too long!';
        this.loadingName = false;
        return;
      }
      const existingPlayer = await queryDocs(
        query(
          createCollectionRef('players'),
          where('classID', '==', this.code),
          where('name', '==', this.name)
        )
      );
      if (!existingPlayer.empty) {
        this.eMessage = 'Name taken!';
        this.loadingName = false;
        return;
      }
      this.eMessage = '';
      this.joinable = true;
      this.loadingName = false;
    },
  },
  beforeMount() {
    const loadedCode = this.$route.query.c;
    if (loadedCode) {
      this.code = loadedCode;
    }
    const registerAuth = onAuthStateChanged(auth, async (user) => {
      if (await isAdmin(user)) {
        this.$router.push('/manage');
      }
    });
    if (this.classID != undefined && this.classID.length == 4) {
      this.load();
      this.listen();
      if (!this.started) {
        this.$router.push('/p/i');
        return;
      }
      this.$router.push('/p');
    }
  },
  computed: {
    ...mapState(useClassStore, ['classID', 'started', 'period']),
  },
  methods: {
    ...mapActions(useClassStore, ['listen', 'load']),
    async join() {
      this.disableFields = true;
      this.loadJoin = true;
      try {
        const user = await registerPlayer();
        const newPlayerData = {
          name: this.name,
          classID: this.code,
          iMoney: this.targetClass.initialBalance,
          money: this.targetClass.initialBalance,
          holdings: {},
          transactions: [
            {
              nShares: 1,
              price: this.targetClass.initialBalance,
              period: 0,
              isStock: false,
              label: 'Starting Money',
            },
          ],
        };
        await setDoc('players', user.uid, newPlayerData);
        //init class store
        await this.load(this.code);
        this.listen(this.code);

        //switch to game screen
        if (!this.started) {
          this.$router.push('/p/i');
          return;
        }
        this.$router.push('/p');
      } catch (e) {
        console.log(e);
        this.disableFields = false;
        this.loadJoin = false;
      }
    },
    numberOnly(v) {
      return !v || /^\d+$/.test(v);
    },
  },
};
</script>
