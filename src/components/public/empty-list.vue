<template>
  <div class='empty'>
    <div class="empty-show" v-show='!loading'>
      <div class='empty-asset'>
        <img src="../../static/images/icon/advertisement-ccc.svg" width="55" height="48" v-if='iconType === 1'>
        <img src="../../static/images/icon/order-ccc.svg" width="55" height="55" v-if='iconType === 2'>
      </div>
      <p class='empty-text'>{{text}}</p>
    </div>
    <div class='loading-show' v-show='loading'>
      <c-loading/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: '您没有未完成的订单',
    },
    iconType: {
      type: Number,
      default: 1,
    }
  },  
}
</script>

<style lang="scss" scoped>
  .empty {
    .empty-show,.loading-show {
      height: 640px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .loading-show{
      height: 320px;
      margin-top: 40px;
      justify-content: flex-start;
    }
    &-asset {
      margin-bottom: 54px;
    }
    &-text {
      font-size: 16px;
      color: #666666;
      line-height: 22px;
    }
  }
</style>

