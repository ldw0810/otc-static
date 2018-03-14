<template>
  <div class='container'>
    <div class="mainLayer">
      <headerBar id="header" class='g-shadow'/>
      <transition name="fade" mode="out-in">
        <router-view id="page"/>
      </transition>
      <footerBar id="footer" :class="{'fixed': isFooter}"/>
    </div>
    <Modal v-model="pop_email" class-name="m-ivu-modal" width='480' :mask-closable="true"
           :closable="false" @on-visible-change="popEmailTrigger">
      <auth_email ref="auth_email" @close="pop_email = false"/>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import headerBar from "../components/public/header.vue"
  import footerBar from "../components/public/footer.vue"
  import auth_email from '@/components/public/auth_email_pop';

  export default {
    name: 'index',
    data() {
      return {
        isFooter: false,
        pop_email: false
      };
    },
    mounted() {
      this.$Message.config({
        duration: 3
      });
      if (this.$route.query) {
        // if (this.$route.query.error) {
        //     if (+this.$route.query.error === 10001) {
        //         this.$Message.info({
        //             content: this.$t('public.activation_link_notValid'),
        //             onClose: this.$goRouter("/"),
        //         });
        //     }
        // } else if (this.$route.query.success) {
        //     if (+this.$route.query.success === 10000) {
        //         this.$Message.info({
        //             content: this.$t('public.email_activation_success'),
        //             onClose: this.$goRouter("/"),
        //         });
        //     }
        // } else
        if (this.$route.query.withdraw_token) {
          this.$store.dispatch("ajax_withdraw_confirm", {
            code: this.$route.query.withdraw_token
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$Message.success(this.$t("asset.asset_withdraw_confirm_success"));
            } else {
              this.$Modal.error({
                title: this.$t("public.error_title_default"),
                content: this.$t("asset.asset_withdraw_confirm_fail")
              })
            }
          }).catch(err => {
            // this.$Message.error(this.$t("asset.asset_withdraw_confirm_fail"));
          });
        } else if (this.$route.query.invitationCode) {
//                    window.localStorage.setItem("invitationCode", this.$route.query.invitationCode);
        } else if (this.$route.query.activation_token) {
          this.$store.dispatch("ajax_email_verified", {
            token: this.$route.query.activation_token
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$Message.success({
                content: this.$t('public.email_activation_success'),
                // onClose: this.$goRouter("/"),
              });
            } else {
              this.$Modal.error({
                title: this.$t("public.error_title_default"),
                content: this.$t("public.activation_link_notValid")
              })
            }
          }).catch(err => {
            // this.$Message.error({
              // content: this.$t('public.activation_link_notValid'),
              // onClose: this.$goRouter("/"),
            // });
          });
        }
      }

    },
    watch: {
      showAuthEmail(val) {
        this.pop_email = !!val;
      }
    },
    computed: {
      showAuthEmail() {
        return this.$store.state.showAuthEmail;
      },
      userInfo() {
        return this.$store.state.userInfo;
      }
    },
    methods: {
      popEmailTrigger(val) {
        if (!val) {
          this.$store.commit("showAuthEmail_setter", 0);
        }
      }
    },
    components: {
      headerBar,
      footerBar,
      auth_email
    }
  }
</script>
<style>
  .container, .mainLayer {
    min-height: 100vh;
  }

  .popLayer {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }

  .mainLayer {
    display: flex;
    flex-direction: column;
    background-color: #fafbfd;
  }

  #header {
    height: 76px;
    z-index: 2;
  }

  #footer {
    height: 60px;
    z-index: 2;
  }

  #page {
    /* z-index: 0; */
    flex:1;
    /* padding-bottom: 30px; */
  }
</style>
