<template>
  <n-config-provider :theme="null">
    <div class="contrastcard">
      <div class="maincontent">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          ">
          <h1 style="font-weight: 700">Class name</h1>

          <n-button circle text style="font-size: 1.4rem">
            <n-icon class="hoverRotate"><settings-icon /></n-icon>
          </n-button>
        </div>
        <div style="display: flex; justify-content: space-between">
          <div class="cardStat">
            <h1>3</h1>
            <h4>Players</h4>
          </div>
          <div class="cardStat">
            <h1>3</h1>
            <h4>Players</h4>
          </div>
          <div class="cardStat">
            <h1>3</h1>
            <h4>Players</h4>
          </div>
        </div>
      </div>
      <div class="footer">
        <n-button secondary type="error">
          <template #icon>
            <n-icon>
              <bin-icon />
            </n-icon>
          </template>
          Delete
        </n-button>
        <n-button type="success" style="margin-left: 1rem">
          <template #icon>
            <n-icon>
              <play-icon />
            </n-icon>
          </template>
          Start
        </n-button>
      </div>
    </div>
  </n-config-provider>
</template>

<script>
import {
  SettingsOutline as SettingsIcon,
  TrashBinOutline as BinIcon,
  Play as PlayIcon,
} from '@vicons/ionicons5';

export default {
  components: { SettingsIcon, BinIcon, PlayIcon },
};
</script>

<style scoped>
.cardStat {
  display: flex;
  flex-direction: column;
  line-height: normal;
}
.cardStat h1 {
  font-weight: 700;
}

.hoverRotate {
  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.hoverRotate:hover {
  transform: rotate(45deg);
}
</style>
