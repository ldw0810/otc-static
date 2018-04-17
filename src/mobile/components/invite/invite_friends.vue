<template>
  <div class='invite'>
    <div class="banner" :style="{backgroundImage: 'url('+CONF_INVITE_BANNER+')'}">
    </div>
    <article class='invite-container'>
      <section class="invite-target g-shadow">
        <div class="score-cards">
          <div class="score-cards-item">
            {{$t("public.invite_invited")}}: {{invite.count}}
          </div>
          <div class="score-cards-item">
            {{$t("public.invite_omt")}}: {{invite.amount}}
          </div>
        </div>
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
            <i-button type="primary" class="copy-btn" @click="showImage">
              {{$t("public.invite_image_show_text")}}
            </i-button>
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
    <Modal v-model="popImageFlag" class-name="m-ivu-modal" :mask-closable="true" @on-visible-change="popImageTrigger">
      <qrcode-vue v-if="qrCodeFlag" ref="qrCode" class="pop-qrCode" :value='qrCodeConfig.value' :size='qrCodeConfig.size'/>
      <div ref="popImage" class="pop-image"></div>
      <div slot="footer">
        <i-button class="pop-popDownload submitButton" type="primary" @click="downloadImage">
          {{$t('public.invite_image_download_text')}}
        </i-button>
      </div>
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
        qrCodeFlag: true,
        popImageFlag: false,
        imageData: "",
        clientHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      }
    },
    computed: {
      link() {
        return this.$t("public.invite_content") + "\n" + this.linkUrl;
      },
      linkUrl() {
        return window.location.href.replace("invite", "user/register?invitationCode=" + this.$store.state.userInfo.invite);
      },
      qrCodeConfig() {
        return {
          value: window.location.href.replace("invite", "user/register?invitationCode=" + this.$store.state.userInfo.invite),
          imagePath: require("../../../static/images/home/QC-Code-BG.png"),
          filter: "canvas",
          size: this.clientHeight * 0.1,
        }
      },
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
      },
      convertCanvasToImage(canvas) {
        let image = new Image();
        image.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        return image.src;
      },
      createImage() {
        let qrCodeImg = this.convertCanvasToImage(this.$refs.qrCode.$el.children[0]);
        let imgArr = [CONF_INVITE_IMAGE, qrCodeImg];
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');
        c.width = this.clientHeight * 0.395;
        c.height = this.clientHeight * 0.7;
        ctx.rect(0, 0, c.width, c.height);
        ctx.fillStyle = '#ccc';
        ctx.fill();
        const drawing = (number) => {
          let index = +number || 0;
          if (index < imgArr.length) {
            let img = new Image;
            img.src = imgArr[index];
            img.onload = () => {
              if (index === 1) {
                ctx.drawImage(img, this.clientHeight * 0.145, this.clientHeight * 0.402, this.clientHeight * 0.105, this.clientHeight * 0.105);
                drawing(++index);
              } else {
                ctx.drawImage(img, 0, 0, c.width, c.height);
                drawing(++index);
              }
            }
          } else {
            this.qrCodeFlag = false;
            this.imageData = c.toDataURL("image/png").replace("image/png", "image/octet-stream");
            this.$refs.popImage.innerHTML = "<img src='" + this.imageData + "'>";
          }
        };
        drawing();
      }
      ,
      downloadImage() {
        if(this.imageData) {
          let a = document.createElement('a');
          a.href = this.imageData;
          a.download = "img.png";
          this.$refs.popImage.appendChild(a);
          a.click();
          a.remove();
        }
      },
      popImageTrigger(val) {
        if (!val) {
          this.popImageFlag = false;
        } else {
          if (this.qrCodeFlag) {
            this.createImage();
          }
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
        margin: 2vh 0 2vh 0;
        &-sub {
          color: #2EA2F8;
        }
      }
      .copy-area {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 2vh 0 0 0;
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
        padding: 2vh 0 2vh 0;
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
      padding: 0;
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
    &-qrCode {
      position: absolute;
      top: -100vh;
      left: -100vw;
      visibility: hidden;
    }
    &-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  /deep/ .ivu-modal-footer {
    display: flex;
    justify-content: center;
  }
</style>
