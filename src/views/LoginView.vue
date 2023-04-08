<template>
  <main class="floatingCardContainer">
    <div class="floatingCard">
      <n-config-provider :theme="null">
        <h1 style="font-weight: 700; margin-bottom: 0.5rem">Log In</h1>

        <n-input size="large" round placeholder="Email" class="bpad" v-model:value="email" />
        <n-input
          size="large"
          type="password"
          show-password-on="mousedown"
          round
          placeholder="Password"
          v-model:value="password" />
        <div class="bpad" :style="`opacity:${errored ? 1 : 0}`" style="color: var(--color-error)">
          Invalid credentials
        </div>

        <n-button type="success" class="bpad" style="align-self: flex-end" @click="login()">
          Log In
        </n-button>
      </n-config-provider>
    </div>
  </main>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { isAdmin } from '@/utils/auth';

const auth = getAuth();

export default {
  data() {
    return {
      email: '',
      password: '',
      errored: false,
    };
  },
  mounted() {
    const registerAuth = onAuthStateChanged(auth, async (user) => {
      if (await isAdmin(user)) {
        this.$router.push('/manage');
      }
    });
  },
  methods: {
    login() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          this.$router.push('/manage');
        })
        .catch((error) => {
          this.errored = true;
        });
    },
  },
};
</script>
