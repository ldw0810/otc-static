<template>
  <div id="content">
    <BreadCrumb
        :breadcrumbText='breadcrumbText'
    />
    <div class="user">
      <div class="g-shadow avator">
        <img class='avator-img' src="../../../static/images/DefaultHead.jpg">
      </div>
      <div class="name" v-text="userInfo.nickname || ''"></div>
    </div>
    <div class="infoPage">
      <div class="info">
        <span>{{$t('user.authentication_email')}}:</span>
        <span class="text_red" v-text="$t('user.authentication_wait')" v-if="!userInfo.activated"></span>
        <span class="text" v-text="$t('user.authenticated')" v-else></span>
        <span class="link" v-text="$t('user.authentication_email_reSend')"
              v-if="!userInfo.activated" @click="reSendEmail"></span>
      </div>
      <div class="info">
        <span class="text">{{$t('user.authentication_phone')}}:</span>
        <span class="link" @click="showAuthPhone" v-text="$t('user.unAuthenticated')"
              v-if="!userInfo.mobile"></span>
        <span class="text" v-else>{{ $t('user.authenticated')}}({{userInfo.phone_number}})</span>
      </div>
      <div class="info">
        <span class="text">{{$t('user.default_receivables')}}:</span>
        <span class="text" v-if="Object.keys(userInfo.default_collection).length">{{ default_receiver }}</span>
        <span class="link" @click="$goRouter('/user/userCenter/payment')"
              v-text="$t('public.setting')"></span>
      </div>
      <div class="info">
        <span class="text">{{$t('user.transaction_record')}}:</span>
        <span v-text="userInfo.stat.trade_count"></span>
      </div>
      <div class="info">
        <span class="text">{{$t('user.evaluate')}}:</span>
        <span v-text="userInfo.stat.trade_count ? (userInfo.stat.good_rate + '%') : $t('user.evaluate_noValid')"></span>
      </div>
      <div class="info">
        <span class="text">{{$t('user.integral')}}:</span>
        <span v-text="userInfo.omt.amount"></span>
      </div>
      <div class="info">
        <span class="text" style="color: red;">** 注册后将实名信息和手机号发给内测群主，才可以获得积分 **</span>
        <!--<span v-text="userInfo.omt.amount"></span>-->
      </div>
    </div>
    <Modal v-model="pop_email" class-name="m-ivu-modal" width='480' :mask-closable="true"
           :closable="false">
      <auth_email_send ref="auth_email_send" @close="pop_email = false" />
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="pop_phone" class-name="m-ivu-modal" width='480' :mask-closable="true"
           :closable="false" @on-visible-change="popPhoneTrigger">
      <auth_phone_pop :pop_phone_show="pop_phone_show" @cancel='pop_phone = false'/>
      <div slot="footer"></div>
    </Modal>
    <div style="clear: both"></div>
  </div>
</template>

<script>
  import auth_email_send from "./auth_email_send_pop.vue";
  import auth_phone_pop from "./auth_phone_pop.vue";
  import BreadCrumb from "./breadcrumb";
  import store from "../../../store/store";

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
      default_receiver() {
        let default_collection = this.userInfo.default_collection;
        if (Object.keys(default_collection).length) {
          if (default_collection.kind == "bank") {
            return (
              default_collection.bank_name +
              "(" +
              default_collection.account_display +
              ")"
            );
          } else {
            return (this.$t("public.alipay") + "(" + default_collection.account_display + ")");
          }
        } else {
          return "";
        }
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
      popPhoneTrigger(val) {
        this.pop_phone_show = val;
      }
    },
    components: {
      auth_phone_pop,
      BreadCrumb,
      auth_email_send
    },
    mounted() {
      this.$store.commit("user_sider_index_setter", 0);
    },
    beforeRouteEnter(to, from, next) {
      if (from.name && from.name.indexOf("/user/login") <= -1) {
        store.dispatch("ajax_me");
      }
      next();
    }
  };
</script>
<style lang='scss' scoped>
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

  #content .user {
    margin-top: 40px;
    height: 74px;
  }

  #content .user .avator {
    float: left;
    margin-left: 70px;
    height: 74px;
    width: 74px;
    border-radius: 50%;
    padding: 2px;
    background-color: #fff;
  }

  #content .user .avator-img {
    object-fit: cover;
    object-position: 0 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  #content .user .name {
    float: left;
    margin-left: 44px;
    font-size: 24px;
    letter-spacing: 0;
    height: 74px;
    line-height: 74px;
  }

  #content .infoPage {
    margin-left: 175px;
    margin-top: 6px;
    height: 418px;
  }

  #content .info {
    margin-top: 20px;
    font-size: 14px;
    letter-spacing: 0;
  }

  #content .info span {
    margin-left: 16px;
  }

  #content .info .text_red {
    color: red;
  }

  #content .info .link {
    color: #4a90e2;
    cursor: pointer;
  }
</style>
