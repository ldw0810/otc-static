<template>
  <div id="popPage">
    <logoDiv/>
    <div class="content">
      <div class="content_1" v-text="$t('user.authentication_email_beenSend')"></div>
      <div class="content_2" v-text="email"></div>
      <div class="content_3" v-text="$t('user.authentication_email_beenSend_info')"></div>
      <sendCodeButton ref="sendCodeButton" class="content_4" :text="$t('user.authentication_email_reSend_link')"
                      :reText="$t('user.authentication_email_reSend_link')" :time="remainTime"
                      :maxTime="maxTime" :once="!+remainTime" @sendCode="sendEmail"/>
      <i-button class="submitButton" type="primary" :loading='loading' @click="submit">
        {{$t('public.confirm')}}
      </i-button>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script type="es6">
  import logoDiv from "../../public/logo.vue";
  import sendCodeButton from "../../public/sendCode.vue";

  export default {
    data() {
      return {
        loading: false,
        remainTime: 120,
        maxTime: 120
      };
    },
    computed: {
      email: function () {
        return this.$store.state.userInfo.email;
      }
    },
    methods: {
      init() {
        this.sendEmail().then(() => {
          this.$refs.sendCodeButton.init();
        });
      },
      close(){
        // this.$refs.sendCodeButton.clear();
      },
      sendEmail() {
        return new Promise((resolve, reject) => {
          this.loading = true;
          this.$store.dispatch("ajax_send_activation", {
            email: this.email
          }).then((res) => {
            this.loading = false;
            if (res.data && +res.data.error === 0) {
              this.remainTime = +res.data.remain || 120;
            }
            resolve();
          }).catch((err) => {
            this.loading = false;
            resolve();
          });
        });
      },
      submit() {
        this.$emit("close", 0);
      }
    },
    components: {
      logoDiv,
      sendCodeButton
    }
  };
</script>
<style scoped>
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
    line-height: 33px;
    padding-top: 63px;
    font-size: 24px;
    color: #666666;
  }

  #popPage .content .content_2 {
    width: 480px;
    text-align: center;
    line-height: 33px;
    font-size: 24px;
    color: #666666;
    margin-bottom: 26px;
  }

  #popPage .content .content_3 {
    width: 480px;
    text-align: center;
    font-size: 16px;
    color: #666666;
    line-height: 21px;
    margin-bottom: 20px;
  }

  #popPage .content .content_4 {
    width: 480px;
    text-align: center;
    font-size: 16px;
    color: #00a6ae;
    letter-spacing: 0;
    margin-bottom: 67px;
    margin-left: 0;
  }

  #popPage .submitButton {
    margin-left: 94px;
    width: 292px;
  }
</style>