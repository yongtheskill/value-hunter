<template>
  <main
    style="
      width: 100vw;
      height: 100vh;
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
    aaa
  </main>
</template>

<script>
import { getDoc } from '../utils/firestore';
export default {
  methods: {
    async fetchGame() {
      const classID = this.$route.params.id;

      const classData = await getDoc('classes', classID);
      console.log(classData);
    },
  },
  beforeMount() {
    this.fetchGame();
  },
};
</script>
