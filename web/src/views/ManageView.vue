<template>
  <header>
    <nav>
      <div>
        <h1 style="font-weight: 700">Trading Game</h1>
      </div>
      <div class="navLinks">
        <RouterLink to="/manage">Classes</RouterLink>
        <RouterLink to="/manage/users">Users</RouterLink>
        <RouterLink to="/manage/settings">Settings</RouterLink>
        <n-button secondary type="error" style="margin-left: 1.5rem" @click="logout()"
          >Log Out</n-button
        >
      </div>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<script>
import { RouterView } from 'vue-router';
import { signOut } from '../utils/auth';
export default {
  components: [RouterView],
  methods: {
    async logout() {
      await signOut();
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
nav {
  width: 100vw;
  height: 65px;
  background-color: var(--color-background-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}
.navLinks {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.navLinks a {
  color: var(--color-heading);
  margin-left: 1.5rem;
  text-decoration: none;
}
.navLinks a:hover {
  color: var(---color-text);
}
main {
  margin: 2rem;
}
</style>
