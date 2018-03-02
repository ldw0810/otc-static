<template>
  <div id="content">
    <BreadCrumb
        :breadcrumbText='breadcrumbText'
    />
    <div class="stepContent">
      <div class="step_1">
        <div class="img1">1</div>
        <div class="text" v-text="$t('user.add_auth_google_download')"></div>
        <div class="img2" v-on:click="redirect('apple')"></div>
        <div class="img3" v-on:click="redirect('google')"></div>
      </div>
      <div class="border"></div>
      <div class="step_2">
        <div class="img1">2</div>
        <div class="text" v-text="$t('user.add_auth_google_scan')"></div>
        <!-- <qart class="qrCode" :config="qrCodeConfig"></qart> -->
        <qrcode-vue
            class="qrCode"
            :value='qrCodeConfig.value'
            :size='qrCodeConfig.size'/>
      </div>
      <div class="border"></div>
      <div class="step_3">
        <div class="img1">3</div>
        <div class="text" v-text="$t('user.add_auth_google_saveKey')"></div>
        <div class="key" v-text="key"></div>
        <div class="info" v-text="$t('user.add_auth_google_keyInfo')"></div>
      </div>
    </div>
    <div class="submitBg">
      <i-button class="submitButton" type="primary" @click="submit">
        {{$t('user.add_auth_google_commit')}}
      </i-button>
    </div>
    <Modal v-model="popUpStatus" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <auth_google_pop @cancel='cancelPopup'/>
      <div slot="footer"></div>
    </Modal>

    <div style="clear: both"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import auth_google_pop from "./auth_google_pop.vue";
  import BreadCrumb from "./breadcrumb";
  import QrcodeVue from 'qrcode.vue';

  export default {
    data() {
      return {
        popUpStatus: false,
        breadcrumbText:
        this.$t("user.securitySetting") + " - " + this.$t("user.auth_google"),
        qrCodeConfig: {
          value: "",
          imagePath: require("../../../static/images/home/QC-Code-BG.png"),
          filter: "canvas",
          size: 129
        }
      };
    },
    mounted() {
      this.$store.dispatch("ajax_google_auth", {
        refresh: 1
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit("googleKey_setter", res.data.otp_secret);
          this.qrCodeConfig.value = res.data.uri;
          this.$store.commit("googleCode_setter", res.data.uri);
        }
      }).catch(err => {
        if (err.error === "100011") {
          this.$goRouter("/user/userCenter/securitySetting");
        } else {
          this.$Message.error(this.$t("user.auth_google_request_fail"));
        }
      });
    },
    computed: {
      key() {
        return this.$store.state.googleKey;
      },
      layer_index() {
        return this.$store.state.layer_index;
      }
    },
    methods: {
      submit() {
        if (this.$store.state.userInfo.activated) {
          this.popUpStatus = true;
        } else {
          this.$store.commit("showAuthEmail_setter", 1);
        }
      },
      cancelPopup() {
        this.popUpStatus = false;
      },
      redirect(type) {
        let href =
          type === "apple"
            ? "https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8"
            : "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2";
        window.open(href);
      }
    },
    components: {
      auth_google_pop,
      QrcodeVue,
      BreadCrumb
    }
  };
</script>
<style scoped>
  #content div {
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
    word-wrap: break-word;
  }

  .breadcrumb {
    height: 44px;
    background: #fafbfd;
  }

  .breadcrumb div {
    height: 44px;
    line-height: 44px;
    margin-left: 30px;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
  }

  .stepContent {
    height: 452px;
    width: 970px;
  }

  .step_1,
  .step_2,
  .step_3 {
    float: left;
    width: 321px;
    height: 452px;
  }

  .step_1 .img1,
  .step_2 .img1,
  .step_3 .img1 {
    margin: 82px auto 0 auto;
    width: 54px;
    height: 54px;
    border-radius: 54px;
    background-image: linear-gradient(-134deg, #0bbfd5 0%, #6dd7b2 100%);
    line-height: 54px;
    text-align: center;
    font-size: 20px;
    color: #ffffff;
  }

  .step_1 .text,
  .step_2 .text,
  .step_3 .text {
    margin-top: 20px;
    width: 321px;
    text-align: center;
    font-size: 16px;
  }

  .step_1 .img2 {
    width: 200px;
    height: 54px;
    margin: 60px auto 0 auto;
    background-image: url("../../../static/images/AppStore.png");
    background-size: cover;
    cursor: pointer;
  }

  .step_1 .img3 {
    width: 200px;
    height: 54px;
    margin: 20px auto 0 auto;
    background-image: url("../../../static/images/GooglePlay.png");
    background-size: cover;
    cursor: pointer;
  }

  .step_2 .qrCode {
    width: 129px;
    height: 129px;
    margin: 60px auto 0;
  }

  .step_3 .key {
    width: 321px;
    text-align: center;
    font-size: 16px;
    color: #666666;
    margin-top: 83px;
  }

  .step_3 .info {
    width: 200px;
    margin: 20px auto 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }

  .border {
    float: left;
    width: 1px;
    background: #cccccc;
    height: 108px;
    margin-top: 248px;
  }

  .submitBg {
    height: 99px;
    width: 970px;
    background: #fafbfd;
  }

  .submitBg .submitButton {
    min-width: 200px;
    margin: 32px 385px;
  }
</style>