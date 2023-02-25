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
              :status="valid ? '' : 'error'" />

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
              autofocus />

            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              "
              class="bpad">
              <n-button type="success" v-if="valid" :disabled="!joinable" @click="join()">
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
import { getDoc, query, queryDocs, where, createCollectionRef } from '../utils/firestore';
const auth = getAuth();

export default {
  data() {
    return {
      code: '',
      name: '',
      eMessage: '',
      valid: false,
      joinable: false,
    };
  },
  watch: {
    async code(n) {
      this.valid = false;
      if (n.length != 4) return;
      const targetClass = await getDoc('classes', n);
      if (!targetClass) {
        this.eMessage = 'Invalid code!';
        return;
      }
      this.eMessage = '';
      this.valid = true;
    },
    async name(n) {
      this.joinable = false;
      if (!this.valid) return;
      if (n.length < 2) {
        this.eMessage = 'Name too short!';
        return;
      }
      if (n.length > 12) {
        this.eMessage = 'Name too long!';
        return;
      }
      const existingPlayer = await queryDocs(
        query(
          createCollectionRef('players'),
          where('gameID', '==', this.code),
          where('name', '==', this.name)
        )
      );
      if (!existingPlayer.empty) {
        this.eMessage = 'Name taken!';
        return;
      }
      this.eMessage = '';
      this.joinable = true;
    },
  },
  beforeMount() {
    const loadedCode = this.$route.query.c;
    if (loadedCode) {
      this.code = loadedCode;
    }
    const registerAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$router.push('/manage');
      }
    });
  },
  methods: {
    join() {
      //create account
      //update database
      //switch to start screen
    },
    numberOnly(v) {
      return !v || /^\d+$/.test(v);
    },
  },
};
</script>
