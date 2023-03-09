<template>
  <main>
    <n-button
      style="position: fixed; top: 1rem; left: 1.2rem; z-index: 9999"
      @click="$router.back()"
      >Back</n-button
    >
    <n-button
      type="success"
      style="position: fixed; bottom: 1rem; right: 1.2rem; z-index: 9999"
      @click="$router.push(`/run/${$route.params.id}/c`)"
      >Start Game</n-button
    >
    <div
      style="
        width: 100vw;
        height: 100vh;
        max-width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      ">
      <div
        style="
          background-color: var(--color-background-mute);
          border-radius: var(--border-radius);
          padding: 0 2.3vw 2.3vw 2.3vw;
          margin-bottom: 2vw;
        ">
        <h1
          style="
            font-size: 1.9vw;
            line-height: normal;
            text-align: center;
            padding: 1vw 0;
            font-weight: 700;
          ">
          Scan to join game
        </h1>
        <qrcode-vue
          :value="`https://vhunter.star-horizon.com/?c=${$route.params.id}`"
          :size="0.2 * $vssWidth"
          :margin="1"></qrcode-vue>
      </div>
      <div style="display: flex; align-items: center; flex-direction: column">
        <div
          style="
            background-color: var(--color-background-mute);
            border-radius: var(--border-radius);
            padding: 1vw 2.5vw;
          ">
          <h1 style="font-size: 2vw">
            Or join the game at
            <span style="font-weight: 700; margin: 0 1vw">vhunter.star-horizon.com</span> with the
            code
          </h1>
        </div>
        <div
          style="
            background-color: var(--color-background-mute);
            width: min-content;
            padding: 0 2.5vw 1.3vw 2.5vw;
            border-radius: 0 0 var(--border-radius) var(--border-radius);
          ">
          <h1 style="font-size: 4vw; font-weight: 900; line-height: normal">
            {{ $route.params.id }}
          </h1>
        </div>
      </div>

      <n-icon
        size="24"
        style="position: absolute; bottom: 0.4vw; left: 50%; transform: translate(-50%, 0)"
        class="gelatine">
        <down-icon />
      </n-icon>
    </div>
    <div style="margin: 3vw 6vw; display: flex; flex-direction: column; align-items: center">
      <h1 style="font-size: 2vw; margin-bottom: 2vw">Players</h1>
      <n-grid x-gap="14" y-gap="14" :cols="6">
        <n-gi v-for="player in players">
          <div class="nameDisplay" @click="deletePlayer(player.uid)">
            <div
              style="
                background-color: var(--color-background-mute);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--border-radius);
              ">
              <h2 style="font-size: 1.2vw; margin: 0.8vw 1vw">{{ player.name }}</h2>
            </div>

            <n-icon
              :size="0.023 * $vssWidth"
              style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
              <bin-icon />
            </n-icon>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </main>
</template>

<script>
import {
  createCollectionRef,
  getDoc,
  query,
  where,
  listenQuery,
  deleteDoc,
} from '@/utils/firestore';
import QrcodeVue from 'qrcode.vue';
import { VueScreenSizeMixin } from 'vue-screen-size';
import { ChevronDown as DownIcon, TrashBin as BinIcon } from '@vicons/ionicons5';

export default {
  components: { QrcodeVue, DownIcon, BinIcon },
  mixins: [VueScreenSizeMixin],
  data() {
    return { clasData: {}, classID: this.$route.params.id, unsub: {}, players: [] };
  },
  methods: {
    async fetchGame() {
      this.classData = await getDoc('classes', this.classID);
    },
    async deletePlayer(id) {
      deleteDoc('players', id);
    },
  },
  beforeMount() {
    this.fetchGame();

    //listen to students
    const coll = createCollectionRef('players');
    const q = query(coll, where('classID', '==', this.classID));
    this.unsub = listenQuery(q, (querySnapshot) => {
      const players = [];
      querySnapshot.forEach((doc) => {
        const newPlayer = doc.data();
        newPlayer['uid'] = doc.id;
        players.push(newPlayer);
      });
      this.players = players;
    });
  },
};
</script>

<style>
.gelatine {
  animation: gelatine 1s infinite;
}
@keyframes gelatine {
  from,
  to {
    transform: translate(-50%, 0) scale(1, 1);
  }
  15% {
    transform: translate(-50%, 0) scale(0.9, 1.1);
  }
  30% {
    transform: translate(-50%, 0) scale(1.1, 0.9);
  }
  45% {
    transform: translate(-50%, 0) scale(0.95, 1.05);
  }
}
.nameDisplay * {
  transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.nameDisplay:hover :not(:last-child) {
  opacity: 0.3;
}
.nameDisplay:hover :not(:first-child) {
  opacity: 1;
}
.nameDisplay :not(:first-child) {
  opacity: 0;
}
</style>
