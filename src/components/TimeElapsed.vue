<template>
  <h1 style="font-weight: 700">{{ timeString }}</h1>
</template>

<script>
import { useMessage } from 'naive-ui';

export default {
  setup() {
    window.$message = useMessage();
  },
  data() {
    return {
      timer: '',
      seconds: -1,
      notified: false,
    };
  },
  computed: {
    timeString() {
      if (this.seconds == -1) return '--:--';
      const seconds = this.seconds % 60;
      const minutes = Math.floor(this.seconds / 60);

      return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    },
  },
  methods: {
    updateSeconds() {
      const newSeconds = Math.floor(new Date().getTime() / 1000) - this.from.seconds;
      this.seconds = newSeconds > 0 ? newSeconds : 0;
      if (!this.autoAdvance) return;

      if (this.notified && this.autoTime - this.seconds > 30) {
        this.notified = false;
        return;
      }
      if (!this.notified && this.autoTime - this.seconds < 30) {
        this.notified = true;
        window.$message.warning('About to auto-advance, increase period time if required', {
          duration: 30000,
        });
      }
      if (this.seconds >= this.autoTime && this.autoTime > 30) {
        this.nextPeriod();
      }
    },
    clearTimer() {
      if (this.timer != '') clearInterval(this.timer);
    },
    startTimer() {
      this.clearTimer();
      this.timer = setInterval(this.updateSeconds, 1000);
    },
  },
  created() {
    this.startTimer();
  },
  watch: {
    from() {
      this.updateSeconds();
    },
  },
  beforeUnmount() {
    this.clearTimer();
  },
  props: ['from', 'autoAdvance', 'autoTime', 'nextPeriod'],
};
</script>
