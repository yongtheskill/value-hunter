<template>
  <div class="slideCard tradeBg">
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
      <h1 :class="cl" style="line-height: normal">Trade!</h1>
      <h4 :class="cl" style="padding-top: 1rem">
        After understanding the news, it is time to trade.
      </h4>
      <h4 :class="cl" style="padding-top: 1rem">Buy and sell, make the most money!</h4>
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
.tradeBg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/trade.webp');
  background-size: cover;
  background-position: center;
  filter: blur(5px) brightness(30%);
}
</style>

<style scoped>
h1 {
  font-weight: 700;
}
</style>
