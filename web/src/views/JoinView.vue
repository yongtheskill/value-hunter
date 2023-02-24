<template>
  <main>Join game</main>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const auth = getAuth();

export default {
  mounted: {
    mounted() {
      const registerAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          this.$router.push('/manage');
        }
      });
    },
  },
};
</script>
