<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 2rem;
      position: relative;
    ">
    <h1>Manage Classes</h1>
    <n-button style="position: absolute; right: 0" secondary type="success">
      <template #icon>
        <n-icon>
          <add-icon />
        </n-icon> </template
      >New class
    </n-button>
  </div>
  <n-grid :cols="3" x-gap="12" y-gap="12">
    <n-gi>
      <class-card />
    </n-gi>
  </n-grid>
</template>

<script>
import { Add as AddIcon } from '@vicons/ionicons5';
import ClassCard from '../components/ClassCard.vue';

export default {
  components: { ClassCard, AddIcon },
};
</script>
