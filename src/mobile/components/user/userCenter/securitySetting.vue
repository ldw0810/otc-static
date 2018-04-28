<template>
  <div id="content">
    <!--<BreadCrumb-->
        <!--:breadcrumbText='breadcrumbText'-->
    <!--/>-->
    <div class="content_1">
      <div class="title" v-text="$t('user.passwordSetting')"></div>
      <div class="border"></div>
      <div class="setting password">
        <div class="img">
          <img class="icon" src="../../../../static/images/icon/Lock-FFFFFF.svg">
        </div>
        <div class="info">
          <div class="text_1" v-text="$t('user.password_login')"></div>
          <!--<div class="text_2" v-text="$t('user.password_login_info')"></div>-->
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
          <img class="icon" src="../../../../static/images/icon/Phone-FFFFFF.svg">
        </div>
        <div class="info">
          <div class="text_1" v-text="$t('user.auth_phone')"></div>
          <!--<div class="text_2" v-text="$t('user.auth_phone_info')"></div>-->
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
          <img class="icon" src="../../../../static/images/icon/Google-FFFFFF.svg">
        </div>
        <div class="info">
          <div class="text_1" v-text="$t('user.auth_google')"></div>
          <!--<div class="text_2" v-text="$t('user.auth_google_info')"></div>-->
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
    watch: {
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
    height: 5vh;
    background: #fafbfd;
  }

  #content .breadcrumb div {
    height: 5vh;
    margin-left: 14vw;
    font-size: 0.85rem;
    color: #666666;
    letter-spacing: 0;
  }

  #content .content_1,.content_2 {
    display: flex;
    width: 100vw;
    flex-direction: column;
    padding: 0 10vw 0 10vw;
  }

  #content .title {
    display: flex;
    font-size: 0.9rem;
    height: 6vh;
    align-items: center;
  }

  #content .content_1 .border,
  #content .content_2 .border {
    width: 80vw;
    height: 1px;
    background: #eeeeee;
  }

  #content .setting {
  }

  #content .password,
  #content .phone,
  #content .google {
    display: flex;
    height: 18vh;
    align-items: center;
    justify-content: space-between;
  }

  #content .password .img {
    height: 6vh;
    width: 6vh;
    border-radius: 50%;
    background-image: linear-gradient(-134deg, #0bbfd5 0%, #6dd7b2 100%);
  }

  #content .phone .img {
    height: 6vh;
    width: 6vh;
    border-radius: 50%;
    background-image: linear-gradient(-134deg, #44b4ff 0%, #467cf6 100%);
  }

  #content .google .img {
    height: 6vh;
    width: 6vh;
    border-radius: 50%;
    background-image: linear-gradient(45deg, #f5515f 0%, #e01937 100%);
  }

  #content .icon {
    margin: 1.5vh;
    height: 3vh;
    width: 3vh;
  }

  #content .info {
  }

  #content .info .text_1 {
    font-size: 0.8rem;
    letter-spacing: 0;
  }

  #content .info .text_2 {
    font-size: 0.8rem;
    color: #999999;
  }

  #content .operation {
  }

  #content .submitButton {
    width: 24vw;
  }
</style>