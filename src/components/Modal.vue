<template>
  <div
    v-if="show"
    style="
      width: 100vw;
      height: 100vh;
      background-color: #000000aa;
      backdrop-filter: blur(2px);
      position: fixed;
      z-index: 999999;
      left: 0;
      top: 0;
    ">
    <n-config-provider :theme="null">
      <div class="floatingCardContainer">
        <div class="floatingCard">
          <slot></slot>
        </div>
      </div>
    </n-config-provider>
  </div>
</template>

<script>
export default {
  props: {
    show: false,
  },
};
</script>
