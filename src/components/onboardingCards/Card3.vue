<template>
  <div class="slideCard portfolioBg">
    <div
      style="
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      ">
      <h1 :class="cl" style="line-height: normal">Portfolio!</h1>
      <h4 :class="cl" style="padding-top: 1rem">You can review your portfolio at any time.</h4>
      <h4 :class="cl" style="padding-top: 1rem">
        See how your investments are doing, see your transaction history and see how good a trader
        you are!
      </h4>
    </div>
  </div>
</template>

<script>
//motion one (motion.dev)
import { animate, stagger } from 'motion';
export default {
  props: ['shown', 'n'],
  emits: ['update:shown'],
  data() {
    return {
      cl: 'an' + this.n + ' transp',
    };
  },
  mounted() {
    if (!this.shown) {
      animate('.an' + this.n, { opacity: 1 }, { delay: stagger(1, { start: 0.2 }), duration: 0.5 });
      this.$emit('update:shown', true);
      return;
    }
    const animates = document.querySelectorAll('.an' + this.n);
    animates.forEach((elem) => {
      elem.classList = [];
    });
  },
};
</script>
<style>
.transp {
  opacity: 0;
}
.portfolioBg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/portfolio.webp');
  background-size: cover;
  background-position: center;
  filter: blur(5px) brightness(50%);
}
</style>

<style scoped>
h1 {
  font-weight: 700;
}
</style>
