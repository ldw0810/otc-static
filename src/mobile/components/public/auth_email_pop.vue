<template>
  <div id="popPage">
    <logoDiv/>
    <div class="content">
      <div class="content_1" v-text="$t('user.user_email_not_auth')"></div>
      <div class="content_2" v-html="$t('user.user_email_not_auth_tip').format('<a href=\'/user/userCenter\'>' +
      this.$t('user.userCenter') + '</a>')">
      </div>
      <i-button class="submitButton" type="primary" :loading='loading' @click="submit">
        {{$t('public.confirm')}}
      </i-button>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script type="es6">
  import logoDiv from "./logo.vue";

  export default {
    data() {
      return {
        loading: false
      };
    },
    methods: {
      submit() {
        this.$emit("close", 0);
      }
    },
    components: {
      logoDiv
    }
  };
</script>
<style lang='scss' scoped>
  #popPage {
    /* position: fixed;
          left: 35%;
          top: 5%;
          width: 480px;
          height: 472px;
          margin: 0 auto;
          z-index: 100; */
  }

  #popPage .content {
    margin: 0 auto 5px auto;
    width: 480px;
    height: 372px;
    background: #ffffff;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
  }

  #popPage .content div {
    word-wrap: break-word;
  }

  #popPage .content .content_1 {
    width: 480px;
    text-align: center;
    padding-top: 50px;
    font-size: 24px;
    color: #666666;
  }

  #popPage .content .content_2 {
    width: 480px;
    text-align: center;
    margin-top: 50px;
    font-size: 16px;
    padding: 0 50px;
    color: #666666;
  }

  #popPage .submitButton {
    margin: 50px 0 0 94px;
    width: 292px;
  }
</style>