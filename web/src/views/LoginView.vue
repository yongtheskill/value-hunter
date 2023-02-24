<template>
  <main class="floatingCardContainer">
    <div class="floatingCard">
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
    </div>
  </main>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
const auth = getAuth();

export default {
  data() {
    return {
      email: 'ahah',
      password: '',
      errored: false,
    };
  },
  mounted() {
    const registerAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
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
          console.log(user);
          this.$router.push('/manage');
        })
        .catch((error) => {
          this.errored = true;
        });
    },
  },
};
</script>

<style>
.floatingCardContainer {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.floatingCard {
  background-color: var(--color-background-contrast);
  color: var(--color-text-contrast);
  border-radius: var(--border-radius);
  padding: 1rem 2rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
  width: 400px;
}
.bpad {
  margin-bottom: 1rem;
}
</style>
