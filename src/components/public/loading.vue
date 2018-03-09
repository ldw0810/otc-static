<template>
  <div class='loading'>
    <div class="loading-inner">
      <div class='loading-inner-dot' :style="{backgroundColor: bgColor, width: width + 'px', height: height + 'px' }" v-for='(item, i) in length' :key='i'></div>
    </div>
    <p class='loading-text' :style="{color: bgColor}">{{$t("order.order_chat_loading")}}</p>
  </div>
</template>
<script>
export default {
  props: {
    bgColor: {
      type: String,
      default: '#ccc'
    },
    width: {
      type: Number,
      default: 4
    },
    height: {
      type: Number,
      default: 35
    },
  },
  data() {
    return {
      length: new Array(5)
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes line-scale-pulse-out {
  0% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }
  50% {
    -webkit-transform: scaley(0.4);
    transform: scaley(0.4);
  }
  100% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }
}

.loading {
  &-inner {
    &-dot {
      border-radius: 2px;
      margin: 2px;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      display: inline-block;
      animation: line-scale-pulse-out 0.9s -0.6s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
      &:nth-child(2), &:nth-child(4) {
        animation-delay: -0.4s !important;
      }
      &:nth-child(1), &:nth-child(5) {
        animation-delay: -0.2s !important;
      }
    }
  }
}
</style>
