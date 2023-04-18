<template>
  <main>logging out...</main>
</template>

<script>
import { signOut } from '../utils/auth';
import { useClassStore } from '../utils/classStore';
import { mapActions } from 'pinia';

export default {
  methods: {
    ...mapActions(useClassStore, ['clear']),
    async logout() {
      this.clear();
      await signOut();
      this.$router.push('/');
    },
  },
  mounted() {
    this.logout();
  },
};
</script>
