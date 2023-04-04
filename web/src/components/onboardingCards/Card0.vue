<template>
  <div class="slideCard stonksBg" style="backdrop-filter: blur(3px)">
    <div
      style="
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
      <h4 :class="cl">Welcome to...</h4>
      <h1 :class="cl" style="line-height: normal">Value Hunter!</h1>
      <h4 :class="cl" style="padding-top: 1rem">Here is a quick intro on how to play</h4>
    </div>
  </div>
</template>

<script>
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
.stonksBg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/stonks.webp');
  background-size: cover;
  background-position: right;
  filter: blur(5px) brightness(50%);
}
</style>

<style scoped>
h1 {
  font-weight: 700;
}
</style>
