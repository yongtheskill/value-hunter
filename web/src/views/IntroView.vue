<template>
  <main
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    ">
    <div class="slideCardContainer">
      <Transition :name="inc ? 'hslidel' : 'hslider'">
        <div class="slideCard" v-if="card == 0"><card0 v-model:shown="shown[0]" n="0" /></div>
        <div class="slideCard" v-else-if="card == 1"><card1 v-model:shown="shown[1]" n="1" /></div>
        <div class="slideCard" v-else-if="card == 2"><card2 v-model:shown="shown[2]" n="2" /></div>
      </Transition>
    </div>
    <div
      style="
        height: 70px;
        padding-top: 25px;
        width: 100vw;
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
        :disabled="card >= 2"
        >Next
        <template #icon
          ><n-icon><forward-arrow /></n-icon> </template
      ></n-button>
    </div>
  </main>
</template>

<script>
import { ChevronForward as ForwardArrow, ChevronBack as BackArrow } from '@vicons/ionicons5';
import Card0 from '@/components/onboardingCards/Card0.vue';
import Card1 from '@/components/onboardingCards/Card1.vue';
import Card2 from '@/components/onboardingCards/Card2.vue';
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
  },
};
</script>

<style>
.slideCardContainer {
  width: calc(100vw - 50px);
  height: calc(100vh - 120px);
}
.slideCard {
  width: calc(100vw - 50px);
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
  right: 100vw;
}
.hslider-enter-to {
  right: 0;
}
.hslider-leave-from {
  left: 0;
}
.hslider-leave-to {
  left: 100vw;
}
.hslidel-enter-from {
  left: 100vw;
}
.hslidel-enter-to {
  left: 0;
}
.hslidel-leave-from {
  right: 0;
}
.hslidel-leave-to {
  right: 100vw;
}
</style>
