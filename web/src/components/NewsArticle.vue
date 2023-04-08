<template>
  <div style="border-radius: var(--border-radius-inset1)">
    <div style="width: 100%; aspect-ratio: 3/2">
      <img
        :src="formatStorageUrl(img)"
        style="
          width: 100%;
          height: 100%;
          display: flex;
          object-fit: cover;
          border-radius: var(--border-radius-inset1);
        " />
    </div>
  </div>
</template>

<script>
import { formatStorageUrl } from '../utils/storage';

export default {
  props: ['img', 'headline'],
  methods: {
    formatStorageUrl,
  },
};
</script>
