<!--手机发送验证码按钮-->
<template>
  <div class='send'>
    <a @click="send" class='send-btn send-primary' v-if="once">{{text || $t("user.auth_phone_code_send")}}</a>
    <a disabled class='send-btn send-disabled' v-else-if="time > 0">{{$t("user.auth_phone_code_reSend_seconds").format(time)}}</a>
    <a @click="send" class='send-btn send-primary' v-else>{{reText || $t("user.auth_phone_code_reSend")}}</a>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ""
      },
      reText: {
        type: String,
        default: ""
      },
      time: {
        type: Number,
        default: 60
      },
      maxTime: {
        type: Number,
        default: 60
      },
      once: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        timer: 0
      }
    },
    methods: {
      send() {
        this.once && (this.once = false);
        this.$emit("sendCode", 1);
        this.time = this.maxTime + 1;
        this.countDown();
      },
      countDown() {
        if (this.time) {
          this.time--;
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(this.countDown, 1000);
        }
      },
      refresh() {
        this.once = true;
      },
      init() {
        if (this.time && !this.once) {
          this.countDown();
        }
      }
    },
    destroyed(){
      this.timer && clearTimeout(this.timer);
    }
  }
</script>
<style scoped>
  /* #sendButton {
      width: 100px;
      height: 50px;
  } */
</style>
<style lang="less" scoped>
  @import '~style/lib/custom';

  .send {
    margin-left: 16px;
    &-btn {
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
    }
    &-primary {
      color: @primary-color;
    }
    &-disabled {
      color: #999;
    }
  }
</style>

