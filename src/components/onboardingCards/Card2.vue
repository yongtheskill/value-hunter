<template>
  <div
    style="
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    ">
    <h4 :class="cl">Welcome to...</h4>
    <h1 :class="cl" style="line-height: normal">Value Hunter!</h1>
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
</style>
