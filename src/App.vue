<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <RouterView />
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
