<template>
  <div class='invite'>
    <div class="banner" :style="{backgroundImage: 'url('+CONF_INVITE_BANNER+')'}">
    </div>
    <article class='invite-container'>
      <section class="invite-target g-shadow">
        <div class='invite-target-desc'>
          {{$t('public.invite_title')}}
          <a class='invite-target-desc-sub' @click="goArticle">{{$t('public.invite_question')}}</a>
        </div>
        <div class='copy-area'>
          <div class='copy-input' v-text="link"></div>
          <div class='copy-btn-wrapper'>
            <i-button type="primary" class="copy-btn" v-clipboard:copy="link"
                      v-clipboard:success="copySuccess">
              {{$t("public.invite_copy")}}
            </i-button>
          </div>
        </div>
        <div class="copy-image">
          <div @click="showImage" class='copy-image-input' v-text="$t('public.invite_image_content')"></div>
          <div class='copy-btn-wrapper'>
            <i-button type="primary" class="copy-btn" @click="downloadImage">
              {{$t("public.invite_image_text")}}
            </i-button>
          </div>
        </div>
        <div class="score-cards">
          <div class="score-cards-item">
            {{$t("public.invite_invited")}}: {{invite.count}}
          </div>
          <div class="score-cards-item">
            {{$t("public.invite_omt")}}: {{invite.amount}}
          </div>
        </div>
      </section>
      <section class="invite-rules g-shadow">
        <h3 class='invite-rules-title'>
          {{$t("public.invite_rules")}}
        </h3>
        <div class='invite-rules-content' v-html='$t("public.invite_rules_content")'>
        </div>
      </section>
    </article>
    <Modal v-model="popImageFlag" class-name="m-ivu-modal" :mask-closable="true"
           :closable="false" @on-visible-change="popImageTrigger">
      <div id="pop-image" class="pop-image" :style="{backgroundImage: 'url('+CONF_INVITE_IMAGE+')'}">
      </div>
      <div class="pop-button"></div>
    </Modal>
  </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';
  import {CONF_INVITE_BANNER, CONF_INVITE_IMAGE, ZENDESK_DOMAIN_URL} from 'config/config';

  const domain = `${ZENDESK_DOMAIN_URL}/hc/${(window.localStorage.getItem("language") || "zh-TW").replace('HK', 'TW').toLowerCase()}`;

  export default {
    name: '',
    components: {
      QrcodeVue,
    },
    data() {
      return {
        articlesLink: `${domain}/articles/360001929553`,
        CONF_INVITE_BANNER,
        CONF_INVITE_IMAGE,
        invite: {
          amount: 0,
          count: 0
        },
        popImageFlag: false
      }
    },
    computed: {
      link() {
        return this.$t("public.invite_content") + "\n" + this.linkUrl;
      },
      linkUrl() {
        return window.location.href.replace("invite", "user/register?invitationCode=" + this.$store.state.userInfo.invite);
      }
    },
    methods: {
      copySuccess() {
        this.$Message.success(this.$t("public.invite_copy_success"));
      },
      getInviteDetail() {
        this.$store.dispatch("ajax_invited_detail").then(res => {
          if (res && res.data === 0) {
            this.invite = res.data;
          } else {

          }
        }).catch(err => {

        });
      },
      goArticle() {
        if (this.$store.state.userToken) {
          this.$store.dispatch("ajax_zendesk").then(res => {
            if (res.data && +res.data.error === 0) {
              window.location.href = `${ZENDESK_DOMAIN_URL}/access/jwt?jwt=${res.data.token}&return_to=${encodeURI(this.articlesLink)}`;
            } else {
              window.location.href = `${domain}/categories/360001929553`;
            }
          }).catch(err => {
            window.location.href = `${domain}/categories/360001929553`;
          });
        } else if (this.footerList[index].url) {
          window.location.href = this.articlesLink;
        }
      },
      showImage() {
        this.popImageFlag = true;
        this.createImage();
      },
      createImage() {
      },
      downloadImage() {
        this.popImageFlag = true;
      },
      popImageTrigger(val) {
        if (!val) {
          this.popImageFlag = false;
        }
      }
    },
    mounted() {
      this.$store.commit("header_index_setter", "4");
      this.getInviteDetail();
    }
  }
</script>
<style lang='scss' scoped>
  $baseImage: '~images';
  .banner {
    height: 20vh;
    width: 100vw;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .invite {
    &-container {
      width: 100vw;
    }
    &-target {
      background-color: #fff;
      border-radius: 0.2vw;
      padding: 2vh 5vw 2vh 5vw;
      &-desc {
        font-size: 0.8rem;
        color: #ED1C24;
        margin-bottom: 2vh;
        &-sub {
          color: #2EA2F8;
        }
      }
      .copy-area {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
      }
      .copy-input {
        width: 100%;
        border: 1px solid #CCCCCC;
        border-radius: 2px;
        font-size: 0.8rem;
        word-break: break-all;
        cursor: text;
        padding: 0 2vw 0 2vw;
      }
      .copy-btn-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 8vh;
      }
      .copy-image {
        padding-top: 2.5vh;
        &-input {
          width: 90vw;
          height: 20vw;
          background: #FFFFFF url(#{$baseImage}/Invite-pic-bg.png) no-repeat center;
          background-size: 100%;
          color: #ffffff;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
          padding: 0 2vw 0 2vw;
        }
      }
    }
    .score-cards {
      width: 90vw;
      display: flex;
      justify-content: space-between;
      background: #3DCBC3 100%;
      margin: 4vh 0 4vh 0;
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: normal;
        flex: 1;
        height: 10vh;
        font-size: 1rem;
        color: #FFFFFF;
      }
    }
    &-rules {
      width: 100vw;
      background: #FFFFFF;
      border-radius: 2px;
      padding: 5vh 10vw 5vh 10vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      &-title {
        font-weight: normal;
        font-size: 1.5rem;
        margin-bottom: 2.5vh;
      }
      &-content {
        border-top: 1px solid #eee;
        padding-top: 20px;
        font-size: 1rem;
        letter-spacing: 0;
        line-height: 2rem;
      }
    }
  }

  .pop {
    &-image {
      background: #FFFFFF url(#{$baseImage}/Invite-pic-bg.png) no-repeat center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 600px;
      width: 300px;
      &-qrCode {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &-button {

    }
  }
</style>
