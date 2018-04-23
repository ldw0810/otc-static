<template>
  <div id="content">
    <BreadCrumb
        :breadcrumbText='breadcrumbText'
    />
    <div class="content_1">
      <div class="title" v-text="$t('user.passwordSetting')"></div>
      <div class="border"></div>
      <div class="setting password">
        <div class="img">
          <img class="icon" src="../../../static/images/icon/Lock-FFFFFF.svg">
        </div>
        <div class="info">
          <div class="text_1" v-text="$t('user.password_login')"></div>
          <div class="text_2" v-text="$t('user.password_login_info')"></div>
        </div>
        <span class="operation">
                    <i-button class="submitButton" @click="submit(1, 1)">
                        {{$t('public.modify')}}
                    </i-button>
                </span>
      </div>
    </div>
    <div class="content_2">
      <div class="title" v-text="$t('user.authSetting')"></div>
      <div class="border"></div>
      <div class="setting phone">
        <div class="img">
          <img class="icon" src="../../../static/images/icon/Phone-FFFFFF.svg">
        </div>
        <div class="info">
          <div class="text_1" v-text="$t('user.auth_phone')"></div>
          <div class="text_2" v-text="$t('user.auth_phone_info')"></div>
        </div>
        <span class="operation">
                    <i-button class="submitButton" type="primary" @click="submit(2, 1)"
                              v-text="$t('public.enable')" v-if="!auth_flag_phone"></i-button>
                    <i-button class="submitButton" @click="submit(2, 1)"
                              v-text="$t('public.disable')" v-else></i-button>
                </span>
      </div>
      <div class="setting google">
        <div class="img">
          <img class="icon" src="../../../static/images/icon/Google-FFFFFF.svg">
        </div>
        <div class="info">
          <div class="text_1" v-text="$t('user.auth_google')"></div>
          <div class="text_2" v-text="$t('user.auth_google_info')"></div>
        </div>
        <span class="operation">
                    <i-button class="submitButton" type="primary" @click="submit(2, 2)"
                              v-text="$t('public.enable')" v-if="!auth_flag_google"></i-button>
                    <i-button class="submitButton" @click="submit(2, 2)"
                              v-text="$t('public.disable')" v-else></i-button>
                </span>
      </div>
    </div>
    <Modal v-model="pop_phone" class-name="m-ivu-modal" width='480' :mask-closable="true"
           :closable="false" @on-visible-change="popPhoneTrigger">
      <auth_phone_pop ref='autoPhonePop' :pop_phone_show="pop_phone_show" @cancel='closePopPhone'/>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="pop_google" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <auth_google_pop @close='closePopGoogle'/>
      <div slot="footer"></div>
    </Modal>
    <div style="clear: both"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import auth_google_pop from "./auth_google_pop.vue";
  import auth_phone_pop from "./auth_phone_pop.vue";
  import BreadCrumb from "./breadcrumb";

  export default {
    data() {
      return {
        breadcrumbText: this.$t("user.securitySetting"),
        popIndex: 0,
        pop_phone: false,
        pop_google: false,
        pop_phone_show:false
      };
    },
    computed: {
      layer_index() {
        return this.$store.state.layer_index;
      },
      auth_flag_phone() {
        return this.$store.state.userInfo.mobile;
      },
      auth_flag_google() {
        return this.$store.state.userInfo.app_two_factor;
      }
    },
    watch:{
      $route: function (val) {
        this.init();
      }
    },
    methods: {
      submit(contentIndex, settingIndex) {
        if (+contentIndex === 1) {
          if (+settingIndex === 1) {
            this.$goRouter("/user/userCenter/modify_password");
          }
        } else if (+contentIndex === 2) {
          if (+settingIndex === 1) {
            if (this.$store.state.userInfo.activated) {
              this.pop_phone = true;
            } else {
              this.$store.commit("showAuthEmail_setter", 1);
            }
          } else if (+settingIndex === 2) {
            if (this.auth_flag_google) {
              this.pop_google = true;
            } else {
              this.$goRouter("/user/userCenter/auth_google");
            }
          }
        }
      },
      popPhoneTrigger(val) {
        this.pop_phone_show = val;
        this.$refs.autoPhonePop.resetForm()
      },
      closePopGoogle(val) {
        val && this.$store.dispatch("ajax_me");
        this.pop_google = false;
      },
      closePopPhone(val) {
        val && this.$store.dispatch("ajax_me");
        this.pop_phone = false;
      },
      init(){
        this.$store.commit("user_sider_index_setter", 1);
      }
    },
    components: {
      auth_phone_pop,
      auth_google_pop,
      BreadCrumb
    },
    mounted() {
      this.init();
    }
  };
</script>
<style lang='scss' scoped>
  #content div {
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
    word-wrap: break-word;
  }

  #content .breadcrumb {
    height: 44px;
    background: #fafbfd;
  }

  #content .breadcrumb div {
    height: 44px;
    line-height: 44px;
    margin-left: 30px;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
  }

  #content .content_1 {
    margin: 35px 60px 0 60px;
    width: 850px;
  }

  #content .content_2 {
    margin: 90px 60px 0 60px;
    width: 850px;
  }

  #content .title {
    font-size: 14px;
    height: 20px;
    line-height: 20px;
  }

  #content .content_1 .border,
  #content .content_2 .border {
    width: 850px;
    height: 1px;
    margin-top: 10px;
    background: #eeeeee;
  }

  #content .setting {
    width: 850px;
    height: 44px;
    margin-top: 40px;
  }

  #content .password div,
  #content .phone div,
  #content .google div {
    float: left;
  }

  #content .password .img {
    height: 44px;
    width: 44px;
    border-radius: 44px;
    background-image: linear-gradient(-134deg, #0bbfd5 0%, #6dd7b2 100%);
  }

  #content .phone .img {
    height: 44px;
    width: 44px;
    border-radius: 44px;
    background-image: linear-gradient(-134deg, #44b4ff 0%, #467cf6 100%);
  }

  #content .google .img {
    height: 44px;
    width: 44px;
    border-radius: 44px;
    background-image: linear-gradient(45deg, #f5515f 0%, #e01937 100%);
  }

  #content .icon {
    margin: 14px 15px;
    height: 16px;
    width: 14px;
    text-align: center;
  }

  #content .info {
    margin-left: 20px;
  }

  #content .info .text_1 {
    float: none;
    font-size: 14px;
    letter-spacing: 0;
  }

  #content .info .text_2 {
    float: none;
    font-size: 12px;
    color: #999999;
    line-height: 21px;
  }

  #content .operation {
    float: right;
  }

  #content .submitButton {
    width: 100px;
  }

  /* #content .content_1 .submitButton {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.10);
          box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.03);
          border-radius: 2px;
          font-size: 14px;
          color: #666666;
          line-height: 21px;
      } */
</style>