<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider placement="bottom"> <RouterView /></n-message-provider>
  </n-config-provider>
</template>

<script>
import { darkTheme } from 'naive-ui';

export default {
  setup() {
    return {
      darkTheme,
    };
  },
};
</script>
