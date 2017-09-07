<template>
  <transition name="ts-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="ts-loading-mask"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="ts-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <p v-if="text" class="ts-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        text: null,
        fullscreen: true,
        visible: false,
        customClass: ''
      };
    },
    methods: {
      handleAfterLeave() {
        this.$emit('after-leave');
      },
      setText(text) {
        this.text = text;
      }
    }
  };
</script>
<style scoped>
@component-namespace ts {
  @component loading-mask {
    position: absolute;
    z-index: 10000;
    background-color: rgba(255, 255, 255, .9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity 0.3s;
  }

  @component loading-spinner {
    top: 50%;
    margin-top: calc(-42px / 2);
    width: 100%;
    text-align: center;
    position: absolute;

    .ts-loading-text {
      color: #4c93fd;
      margin: 3px 0;
      font-size: 14px;
    }

    .circular {
      size: 42px;
      animation: loading-rotate 2s linear infinite;
    }

    .path {
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: #20a0ff;
      stroke-linecap: round;
    }
  }
}

.ts-loading-fade-enter,
.ts-loading-fade-leave-active {
  opacity: 0;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}

</style>
