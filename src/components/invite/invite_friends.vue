<template>
  <div class='invite'>
    <div class="banner">
      <img :class="{'banner-button': bannerList[0].jump_to}" :src="getImg(bannerList[0])" :alt="bannerList[0].name"
           @click.stop="goBanner(bannerList[0].jump_to)"
           v-if="bannerList && bannerList.length">
    </div>
    <article class='invite-container'>
      <section class="invite-target g-shadow">
        <div class='invite-target-desc'>
          {{$t('public.invite_title')}}
          <a class='invite-target-desc-sub' @click="goArticle">{{$t('public.invite_question')}}</a>
        </div>
        <div class="copy-content">
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
            <div class='copy-image-input' v-html="$t('public.invite_image_content')"></div>
            <div class='copy-btn-wrapper copy-image-btn'>
              <i-button type="primary" class="copy-btn" @click="showImage">
                {{$t("public.invite_image_show_text")}}
              </i-button>
            </div>
          </div>
        </div>
      </section>
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
      <section class="invite-rules g-shadow">
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
        <i-button class="pop-popDownload" @click="downloadImage">
          {{$t('public.invite_image_download_text')}}
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
          img: require("../../static/images/invite/top1.svg")
        }, {
          img: require("../../static/images/invite/top2.svg")
        }, {
          img: require("../../static/images/invite/top3.svg")
        }]
      }
    },
    watch: {
      $route: function (val) {
        this.init();
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
          imagePath: require("../../static/images/home/QC-Code-BG.png"),
          filter: "canvas",
          size: 245,
        }
      },
      isZh() {
        return window.localStorage.getItem('language') === 'zh-CN';
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
            console.log(this.inviteTopArray);
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
      getImg(item) {
        const language = window.localStorage.getItem('language');
        if (language === 'zh-CN') {
          return item.zh_img_src || "";
        } else if (language === 'zh-HK' || language === "zh-TW") {
          return item.tw_img_src || "";
        } else {
          return item.en_img_src || "";
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
                // if (this.isZh) {
                ctx.drawImage(img, 246, 955, 245, 245);
                // } else {
                //   ctx.drawImage(img, 270, 760, 210, 210);
                // }
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
    height: 530px;
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
    margin-bottom: 40px;
    &-container {
      width: 970px;
      margin: 370px - 530px auto 0;
    }
    &-target {
      background-color: #fff;
      border-radius: 2px;
      padding: 48px 70px 0;
      margin-bottom: 30px;
      &-desc {
        font-size: 16px;
        color: #ED1C24;
        margin-bottom: 26px;
        &-sub {
          color: #2EA2F8;
        }
      }
      .copy-content {
        display: flex;
      }
      .copy-area {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
      }
      .copy-input-wrapper {
        width: 700px;
      }
      .copy-input {
        font-family: Arial-Black sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 400px;
        border: 1px solid #CCCCCC;
        border-radius: 2px;
        height: 140px;
        font-size: 16px;
        padding: 8px 16px;
        word-break: break-all;
        cursor: text;
      }
      .copy-btn-wrapper {
        width: 400px;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .copy-btn {
        width: 156px;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.10);
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.03);
        border-radius: 2px;
        font-family: SFUIDisplay-Light sans-serif;
        font-size: 14px;
        color: #333333;
        text-align: center;
        line-height: 21px;
      }
      .copy-image {
        &-input {
          font-family: Arial-Black sans-serif;
          font-size: 16px;
          color: #ffffff;
          text-align: center;
          line-height: 22px;
          padding: 0 8px 0 8px;
          margin-left: 40px;
          width: 400px;
          height: 150px;
          background: #FFFFFF url(#{$baseImage}/Invite-pic-bg.png) no-repeat center;
          background-size: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        &-btn {
          margin: -10px 0 0 40px;
        }
      }
    }
    .score-cards {
      display: flex;
      justify-content: space-around;
      height: 68px;
      background-image: linear-gradient(-180deg, #E43636 0%, #E83E3E 70%);
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: normal;
        width: 370px;
        font-family: PingFangSC-Light sans-serif;
        font-size: 23px;
        color: #FFFFFF;
        letter-spacing: 0;
        .number {
          margin-top: 50px;
          font-size: 41px;
          line-height: 57px;
          color: #FFFFFF;
        }
        .border {
          height: 1px;
          width: 58px;
          background-color: #fff;
          margin-top: 22px;
          margin-bottom: 10px;
        }
        .text {
          font-size: 26px;
          line-height: 37px;
          color: #FFFFFF;
        }
      }
    }
    &-rules {
      width: 970px;
      height: 424px;
      background: #FFFFFF;
      border-radius: 2px;
      margin-top: 40px;
      padding: 40px 70px 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      &-title {
        font-weight: normal;
        font-size: 26px;
        line-height: 37px;
        margin-bottom: 20px;
      }
      &-content {
        border-top: 1px solid #eee;
        padding-top: 20px;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 32px;
      }
    }
    &-top {
      min-width: 970px;
      min-height: 404px;
      margin-top: 30px;
      background: #FFFFFF;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
      display: flex;
      flex-direction: column;
      align-items: center;
      &-title {
        margin-top: 35px;
        width: 710px;
        height: 95px;
        background-image: url("../../static/images/invite/toptittle.svg");
        background-size: cover;
      }
      &-content {
        width: 710px;
        height: 95px;
        display: flex;
        &-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          &-icon {
            margin-top: 175px;
            width: 115px;
            img {
              object-fit: cover;
              object-position: 0 0;
              width: 100%;
              height: 100%;
            }
          }
          &-name {
            margin-top: 25px;
            font-family: PingFangSC-Regular sans-serif;
            font-size: 16px;
            color: #000000;
          }
          &-number {
            margin-top: 5px;
            font-family: PingFangSC-Regular sans-serif;
            font-size: 16px;
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
      padding-bottom: 20px;
    }
    &-popDownload {
      min-width: 156px;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.10);
      box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.03);
      border-radius: 2px;
      font-family: SFUIDisplay-Light sans-serif;
      font-size: 14px;
      color: #333333;
      text-align: center;
      line-height: 21px;
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
