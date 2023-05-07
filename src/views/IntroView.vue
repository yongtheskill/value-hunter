<template>
  <main
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
    ">
    <div
      style="
        width: min(500px, 100vw);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      ">
      <div class="slideCardContainer">
        <Transition :name="inc ? 'hslidel' : 'hslider'">
          <div v-if="card == 0"><card0 v-model:shown="shown[0]" n="0" /></div>
          <div v-else-if="card == 1"><card1 v-model:shown="shown[1]" n="1" /></div>
          <div v-else-if="card == 2"><card2 v-model:shown="shown[2]" n="2" /></div>
          <div v-else-if="card == 3"><card3 v-model:shown="shown[3]" n="3" /></div>
        </Transition>
      </div>
      <div
        style="
          height: 70px;
          padding-top: 25px;
          width: min(500px, 100vw);
          display: flex;
          align-items: center;
          justify-content: space-around;
        ">
        <n-button
          @click="
            inc = false;
            card -= 1;
          "
          type="tertiary"
          size="large"
          :disabled="card <= 0"
          >Back<template #icon
            ><n-icon><back-arrow /></n-icon> </template></n-button
        ><n-button
          icon-placement="right"
          @click="
            inc = true;
            card += 1;
          "
          type="success"
          size="large"
          :disabled="card >= 3"
          >Next
          <template #icon
            ><n-icon><forward-arrow /></n-icon> </template
        ></n-button>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useClassStore } from '../utils/classStore';

import { ChevronForward as ForwardArrow, ChevronBack as BackArrow } from '@vicons/ionicons5';
import Card0 from '@/components/onboardingCards/Card0.vue';
import Card1 from '@/components/onboardingCards/Card1.vue';
import Card2 from '@/components/onboardingCards/Card2.vue';
import Card3 from '@/components/onboardingCards/Card3.vue';
export default {
  data() {
    return {
      card: 0,
      inc: true,
      shown: [false, false, false],
    };
  },
  components: {
    ForwardArrow,
    BackArrow,
    Card0,
    Card1,
    Card2,
    Card3,
  },
  computed: {
    ...mapState(useClassStore, ['started', 'period']),
  },
  methods: {
    ...mapActions(useClassStore, ['listen', 'load']),
  },
  watch: {
    started(n) {
      if (!n) return;
      this.$router.push('/p');
    },
  },
  mounted() {
    try {
      this.load();
    } catch (e) {
      console.log(e);
    }
    if (this.started) {
      this.$router.push('/p');
    }
  },
};
</script>

<style>
.slideCardContainer {
  width: calc(min(500px, 100vw) - 50px);
  height: calc(100vh - 120px);
}
.slideCard {
  width: calc(min(500px, 100vw) - 50px);
  height: calc(100vh - 120px);
  background-color: var(--color-background-mute);
  position: absolute;
  border-radius: var(--border-radius);
  padding: 1.2rem 2rem;
}
.hslider-enter-active,
.hslider-leave-active,
.hslidel-enter-active,
.hslidel-leave-active {
  transition-property: left, right;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hslider-enter-from {
  right: min(500px, 100vw);
}
.hslider-enter-to {
  right: 0;
}
.hslider-leave-from {
  left: 0;
}
.hslider-leave-to {
  left: min(500px, 100vw);
}
.hslidel-enter-from {
  left: min(500px, 100vw);
}
.hslidel-enter-to {
  left: 0;
}
.hslidel-leave-from {
  right: 0;
}
.hslidel-leave-to {
  right: min(500px, 100vw);
}
</style>
