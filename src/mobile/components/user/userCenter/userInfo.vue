<template>
  <div id="content">
    <!--<BreadCrumb-->
    <!--:breadcrumbText='breadcrumbText'-->
    <!--/>-->
    <div class="user">
      <div class="g-mobile-shadow avator">
        <img class='avator-img' src="../../../../static/images/DefaultHead.jpg">
      </div>
      <div class="name" v-text="nickname"></div>
      <div></div>
    </div>
    <div class="infoPage" v-show="userInfo.id">
      <div class="info">
        <span class="title">{{$t('user.authentication_email')}}:</span>
        <span class="text_red" v-text="$t('user.authentication_wait')" v-if="!userInfo.activated"></span>
        <span class="link" v-text="$t('user.authentication_email_reSend')"
              v-if="!userInfo.activated" @click="reSendEmail"></span>
        <span class="text" v-text="$t('user.authenticated')" v-if="userInfo.activated"></span>
        <span v-if="userInfo.activated"></span>
      </div>
      <div class="info">
        <span class="title">{{$t('user.authentication_phone')}}:</span>
        <span class="link" @click="showAuthPhone" v-text="$t('user.unAuthenticated')"
              v-if="!userInfo.mobile"></span>
        <span class="text" v-else>{{ $t('user.authenticated')}}({{userInfo.phone_number}})</span>
        <span></span>
      </div>
      <div class="info">
        <span class="tip text_red">{{$t('user.user_phone_verify_tip')}}</span>
      </div>
      <div class="info">
        <span class="title">{{$t('user.default_receivables')}}:</span>
        <span class="text" v-if="Object.keys(userInfo.default_collection).length">{{ default_receiver }}</span>
        <span class="link" @click="$goRouter('/user/userCenter/payment')"
              v-text="$t('public.setting')"></span>
        <span v-if="!Object.keys(userInfo.default_collection).length"></span>
      </div>
      <div class="info">
        <span class="title">{{$t('user.transaction_record')}}:</span>
        <span v-text="userInfo.stat.trade_count"></span>
        <span></span>
      </div>
      <div class="info">
        <span class="title">{{$t('user.evaluate')}}:</span>
        <span v-text="userInfo.stat.trade_count ? (userInfo.stat.good_rate + '%') : $t('user.evaluate_noValid')"></span>
        <span></span>`
      </div>
      <!--<div class="info">-->
        <!--<span class="title">{{$t('user.integral')}}:</span>-->
        <!--<span v-text="userInfo.omt.amount"></span>-->
        <!--<span></span>-->
      <!--</div>-->
      <!--<div class="info" :class="{'omt-hide': !omt_show}">-->
        <!--<span class="text" style="color: red;">** 注册后将实名信息和手机号发给内测群主，才可以获得积分 **</span>-->
        <!--<span v-text="userInfo.omt.amount"></span>-->
        <!--<span></span>-->
      <!--</div>-->
    </div>
    <Modal v-model="pop_email" class-name="m-ivu-modal" width='480' :mask-closable="true"
           :closable="false" @on-visible-change="popEmailTrigger">
      <auth_email_send ref="auth_email_send" @close="pop_email = false"/>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="pop_phone" class-name="m-ivu-modal" width='480' :mask-closable="true"
           :closable="false" @on-visible-change="popPhoneTrigger">
      <auth_phone_pop :pop_phone_show="pop_phone_show" @cancel='closePopPhone'/>
      <div slot="footer"></div>
    </Modal>
    <div style="clear: both"></div>
  </div>
</template>

<script>
  import auth_email_send from "./auth_email_send_pop.vue";
  import auth_phone_pop from "./auth_phone_pop.vue";
  import BreadCrumb from "./breadcrumb";
  import {OMT_SHOW} from "config/config";

  export default {
    data() {
      return {
        breadcrumbText: this.$t("user.info"),
        user: {},
        pop_email: false,
        pop_phone: false,
        pop_phone_show: false
      };
    },
    computed: {
      layer_index() {
        return this.$store.state.layer_index;
      },
      userInfo() {
        return this.$store.state.userInfo;
      },
      nickname() {
        return this.userInfo.nickname || window.localStorage.getItem("nickname");
      },
      default_receiver() {
        let default_collection = this.userInfo.default_collection;
        if (Object.keys(default_collection).length) {
          if ("" + default_collection.kind === "bank") {
            // return default_collection.bank_name + "(" + default_collection.account_display + ")";
            return default_collection.bank_name;
          } else {
            // return (this.$t("public.alipay") + "(" + default_collection.account_display + ")");
            return (this.$t("public.alipay"));
          }
        } else {
          return "";
        }
      },
      omt_show() {
        return OMT_SHOW;
      }
    },
    watch: {
      $route: function (val) {
        this.init();
      }
    },
    methods: {
      showAuthPhone() {
        if (this.userInfo.activated) {
          this.pop_phone = true;
        } else {
          this.$store.commit("showAuthEmail_setter", 1);
        }
      },
      reSendEmail() {
        this.pop_email = true;
        this.$refs.auth_email_send.init();
      },
      popEmailTrigger(val) {
        if (!val) {
          this.$refs.auth_email_send.close();
        }
      },
      popPhoneTrigger(val) {
        this.pop_phone_show = val;
      },
      closePopPhone(val) {
        val && this.$store.dispatch("ajax_me");
        this.pop_phone = false;
      },
      init(){
        this.$store.commit("user_sider_index_setter", 0);

      }
    },
    components: {
      auth_phone_pop,
      BreadCrumb,
      auth_email_send
    },
    mounted() {
      this.init();
    }
  };
</script>
<style lang='scss' scoped>
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

  #content .user {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 18vh;
    width: 100vw;
  }

  #content .user .avator {
    height: 10vh;
    width: 10vh;
    padding: 0.1vw;
    border-radius: 50%;
  }

  #content .user .avator-img {
    object-fit: cover;
    object-position: 0 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  #content .user .name {
    font-size: 1.5rem;
    letter-spacing: 0;
  }

  #content .infoPage {
  }

  #content .info {
    display: flex;
    padding: 0 10vw 4vh 10vw;
    font-size: 0.85rem;
    letter-spacing: 0;
  }

  #content .info span {
    flex: 1;
  }
  #content .info span.title {
    flex: 2;
  }
  #content .info span.tip {
    margin-top: -3vh;
    margin-left: 40vw;
  }
  #content .info .text_red {
    color: red;
  }

  #content .info .link {
    color: #4a90e2;
    cursor: pointer;
  }

  #content .omt-hide {
    display: none;
  }
</style>
