<template>
  <div class='invite'>
    <div class="banner" :class="{'banner-button': bannerList[0] && bannerList[0].jump_to}"
         :style="{backgroundImage: 'url('+getImg(bannerList[0])+')'}"
         @click.stop="goBanner(bannerList[0] && bannerList[0].jump_to)">
    </div>
    <article class='invite-container'>
      <section class="invite-target g-mobile-shadow">
        <div class="score-cards">
          <div class="score-cards-item">
            {{$t("public.invite_invited")}}: {{inviteCount}}
          </div>
          <div class="score-cards-item">
            {{$t("public.invite_omt")}}: {{inviteAmount}}
          </div>
        </div>
        <div class="invite-top">
          <div class="invite-top-title"></div>
          <div class="invite-top-content">
            <div class="invite-top-content-item" v-for="(item, index) in inviteTopArray" :key="index" v-show="item.id">
              <div class="invite-top-content-item-icon">
                <img :src="item.img">
              </div>
              <div class="invite-top-content-item-name">{{interceptEmail(item.email || "")}}</div>
              <div class="invite-top-content-item-number">{{$t("public.invite_people")}}:{{item.count || 0}}</div>
            </div>
          </div>
        </div>
        <div class='invite-target-desc'>
          {{$t('public.invite_title')}}
          <a class='invite-target-desc-sub' @click="goArticle">{{$t('public.invite_question')}}</a>
        </div>
        <div class='copy-area'>
          <div class='copy-input' v-html="link"></div>
          <div class='copy-btn-wrapper'>
            <i-button type="primary" class="copy-btn" v-clipboard:copy="link"
                      v-clipboard:success="copySuccess">
              {{$t("public.invite_copy")}}
            </i-button>
          </div>
        </div>
        <div class="copy-image">
          <div @click="showImage" class='copy-image-input' v-html="$t('public.invite_image_content')"></div>
          <div class='copy-btn-wrapper'>
            <i-button type="primary" class="copy-btn" @click="showImage">
              {{$t("public.invite_image_show_text")}}
            </i-button>
          </div>
        </div>
      </section>
      <section class="invite-rules g-mobile-shadow">
        <h3 class='invite-rules-title'>
          {{$t("public.invite_rules")}}
        </h3>
        <div class='invite-rules-content' v-html='$t("public.invite_rules_content")'>
        </div>
      </section>
    </article>
    <Modal v-model="popImageFlag" class-name="m-ivu-modal" :mask-closable="true" @on-visible-change="popImageTrigger">
      <qrcode-vue v-if="qrCodeFlag" ref="qrCode" class="pop-qrCode" :value='qrCodeConfig.value'
                  :size='qrCodeConfig.size'/>
      <div ref="popImage" class="pop-image"></div>
      <div slot="footer">
        <i-button class="pop-popDownload">
          {{$t('public.invite_image_info_text')}}
        </i-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';
  import {CONF_INVITE_IMAGE, ZENDESK_DOMAIN_URL} from 'config/config';
  import {interceptEmail} from "utils/tools";

  const domain = `${ZENDESK_DOMAIN_URL}/hc/${(window.localStorage.getItem("language") || "zh-TW").replace('HK', 'TW').toLowerCase()}`;
  export default {
    name: '',
    components: {
      QrcodeVue,
    },
    data() {
      return {
        articlesLink: `${domain}/articles/360001929553`,
        CONF_INVITE_IMAGE,
        inviteAmount: 0,
        inviteCount: 0,
        qrCodeFlag: true,
        popImageFlag: false,
        imageData: "",
        clientHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        inviteTopArray: [{
          img: require("../../../static/images/invite/top1.svg")
        }, {
          img: require("../../../static/images/invite/top2.svg")
        }, {
          img: require("../../../static/images/invite/top3.svg")
        }]
      }
    },
    computed: {
      bannerList() {
        return this.$store.state.inviteBannerList;
      },
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
          size: 245,
        }
      },
      isZh() {
        return window.localStorage.getItem('language') === 'zh-CN';
      }
    },
    watch: {
      $route: function (val) {
        this.init();
      }
    },
    methods: {
      copySuccess() {
        this.$Message.success(this.$t("public.invite_copy_success"));
      },
      getInviteDetail() {
        this.$store.dispatch("ajax_invited_detail").then(res => {
          if (res.data && +res.data.error === 0) {
            this.inviteAmount = +res.data.amount || 0;
            this.inviteCount = +res.data.count || 0;
          } else {
          }
        }).catch(err => {
        });
      },
      getInvitedActivity() {
        this.$store.dispatch("ajax_invited_activity").then(res => {
          if (res.data && +res.data.error === 0) {
            for (let i = 0; i < this.inviteTopArray.length; i++) {
              this.$set(this.inviteTopArray, i, Object.assign(this.inviteTopArray[i], res.data.list[i]));
            }
          } else {
          }
        }).catch(err => {
        });
      },
      getImg(item) {
        const language = window.localStorage.getItem('language');
        if(!item){
          return "";
        } else if (language === 'zh-CN') {
          return item.zh_img_src || "";
        } else if (language === 'zh-HK' || language === "zh-TW") {
          return item.tw_img_src || "";
        } else {
          return item.en_img_src || "";
        }
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
      goBanner(url) {
        if (url && url.length) {
          this.$goRouter(url);
        }
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
        c.width = 750;
        c.height = 1334;
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
                ctx.drawImage(img, 246, 955, 245, 245);
                drawing(++index);
              } else {
                ctx.drawImage(img, 0, 0, c.width, c.height);
                drawing(++index);
              }
            }
          } else {
            this.qrCodeFlag = false;
            this.imageData = c.toDataURL("image/png").replace("image/png", "image/octet-stream");
            this.$refs.popImage.innerHTML = "<img width='" + this.clientHeight * 0.45 +
              "' height='" + this.clientHeight * 0.8 + "' src='" + this.imageData + "'>";
          }
        };
        drawing();
      }
      ,
      downloadImage() {
        if (this.imageData) {
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
      },
      interceptEmail(str) {
        return interceptEmail(str);
      },
      init() {
        this.$store.commit("header_index_setter", "4");
        this.getInviteDetail();
        this.getInvitedActivity();
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.dispatch("ajax_banner", {
          activity_type: 1
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            vm.$store.commit("inviteBannerList_setter", res.data.list);
          } else {
          }
        }).catch(err => {
        });
      });
    },
    mounted() {
      this.init();
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
    &-button {
      cursor: pointer;
    }
  }
  .home img {
    object-fit: cover;
    object-position: 0 0;
    width: 100%;
    height: 100%;
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
        font-family: SFUIDisplay-Light sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 20vw;
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
        height: 10vh;
        background: #FFFFFF;
      }
      .copy-btn {
        width: 36vw;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.10);
        box-shadow: 0 1vw 1vw 0 rgba(0, 0, 0, 0.03);
        border-radius: 2px;
        font-family: SFUIDisplay-Light sans-serif;
        font-size: 0.85rem;
        color: #333333;
        text-align: center;
      }
      .copy-image {
        padding: 2vh 0 2vh 0;
        &-input {
          font-family: SFUIDisplay-Light sans-serif;
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
      justify-content: space-around;
      background-image: linear-gradient(-180deg, #E43636 0%, #E83E3E 70%);
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
      font-family: PingFangSC-Light sans-serif;
      &-title {
        font-weight: normal;
        font-size: 1.25rem;
        margin-bottom: 2.5vh;
      }
      &-content {
        border-top: 1px solid #eee;
        padding-top: 4vh;
        font-size: 0.85rem;
        letter-spacing: 0;
        line-height: 2rem;
      }
    }
    &-top {
      width: 90vw;
      min-height: 40vh;
      margin-top: 2vh;
      background: #FFFFFF;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
      display: flex;
      flex-direction: column;
      align-items: center;
      &-title {
        width: 90vw;
        height: 25.5vw;
        background-image: url("../../../static/images/invite/toptittle-phone.svg");
        background-size: cover;
      }
      &-content {
        width: 90vw;
        display: flex;
        justify-content: space-around;
        &-item {
          margin-top: 2.5vh;
          padding-bottom: 2.5vh;
          width: 25vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          &-icon {
            img {
              object-fit: cover;
              object-position: 0 0;
              width: 100%;
              height: 100%;
            }
          }
          &-name {
            margin-top: 1.5vh;
            word-break: break-all;
            font-family: PingFangSC-Regular sans-serif;
            font-size: 0.8rem;
            color: #000000;
          }
          &-number {
            margin-top: 0.5vh;
            font-family: PingFangSC-Regular sans-serif;
            font-size: 0.85rem;
            color: #999999;
          }
        }
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
      padding-bottom: 2.5vh;
    }
    &-popDownload {
      min-width: 36vw;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.10);
      box-shadow: 0 1vw 1vw 0 rgba(0, 0, 0, 0.03);
      border-radius: 2px;
      font-family: SFUIDisplay-Light sans-serif;
      font-size: 0.85rem;
      color: #333333;
      text-align: center;
    }
  }

  /deep/ .ivu-modal-content {
    background: transparent;
  }

  /deep/ .ivu-modal-footer {
    display: flex;
    justify-content: center;
  }
</style>
