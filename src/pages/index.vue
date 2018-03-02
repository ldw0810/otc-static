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
           :closable="false">
      <auth_email ref="auth_email"/>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import headerBar from "../components/public/header1.vue"
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
              this.$Message.info(this.$t("asset.asset_withdraw_confirm_success"))
              this.$goRouter("/")
            } else {
              this.$Message.error(this.$t("asset.asset_withdraw_confirm_fail"));
              this.$goRouter("/")
            }
          }).catch(err => {
            this.$Message.error(this.$t("asset.asset_withdraw_confirm_fail"));
            this.$goRouter("/")
          });
        } else if (this.$route.query.invitationCode) {
//                    window.localStorage.setItem("invitationCode", this.$route.query.invitationCode);
        } else if (this.$route.query.activation_token) {
          this.$store.dispatch("ajax_email_verified", {
            token: this.$route.query.activation_token
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$Message.info({
                content: this.$t('public.email_activation_success'),
                onClose: this.$goRouter("/"),
              });
            } else {
              this.$Message.info({
                content: this.$t('public.activation_link_notValid'),
                onClose: this.$goRouter("/"),
              });
            }
          }).catch(err => {
            this.$Message.info({
              content: this.$t('public.activation_link_notValid'),
              onClose: this.$goRouter("/"),
            });
          });
        }
      }

    },
    watch: {
      "showAuthEmail": function (val) {
        this.pop_email = !!val;
      }
    },
    computed: {
      showAuthEmail() {
        return this.$store.state.showAuthEmail;
      }
    },
    methods: {
      changeClientHeight() {
//                this.isFooter = document.body.clientHeight > document.documentElement.clientHeight;
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
    flex: 1;
    /* padding-bottom: 30px; */
  }
</style>
