<template>
  <div class="adShare" v-if="id">
    <div class="content">
      <qrcode-vue ref="qrCode" class="content-qrCode" :value='qrCodeConfig.value'
                  :size='qrCodeConfig.size'/>
      <div class="content-image" ref="image"></div>
      <!--mt-button(class="popDownload" @click="success") {{$t('public.invite_image_info_text')}}-->
    </div>
  </div>
</template>
<script type="es6">
  import QrcodeVue from 'qrcode.vue';
  import {qrCode_adShare, CONF_INVITE_IMAGE} from 'config/config';

  export default {
    name: 'adShare',
    components: {
      QrcodeVue,
    },
    data () {
      return {};
    },
    computed: {
      id () {
        return this.$route.query.id || '';
      },
      link () {
        return this.$t('public.invite_content') + '\n' + this.linkUrl;
      },
      linkUrl () {
        return window.location.href.replace('adShare', 'ad');
      },
      qrCodeConfig() {
        return {
          value: location.protocol + '//' + location.host + '/ad?id=' + this.id + '&shareId=' + this.id,
          imagePath: require("../../static/images/home/QC-Code-BG.png"),
          filter: "canvas",
          size: 245,
        }
      }
    },
    methods: {
      success () {
        this.$emit('close', 1);
        this.$emit('success', 1);
      },
      convertCanvasToImage (canvas) {
        let image = new Image();
        image.src = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        return image.src;
      },
      createImage () {
        let qrCodeImg = this.convertCanvasToImage(this.$refs.qrCode.$el.children[0]);
        let imgArr = [CONF_INVITE_IMAGE, qrCodeImg];
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');
        c.width = 500;
        c.height = 890;
        ctx.rect(0, 0, c.width, c.height);
        ctx.fillStyle = '#ccc';
        ctx.fill();
        const drawing = (number) => {
          let index = +number || 0;
          if (index < imgArr.length) {
            let img = new Image();
            img.src = imgArr[index];
            img.onload = () => {
              if (index === 1) {
                ctx.drawImage(img, qrCode_adShare.left, qrCode_adShare.top, qrCode_adShare.size, qrCode_adShare.size);
                drawing(++index);
              } else {
                ctx.drawImage(img, 0, 0, c.width, c.height);
                drawing(++index);
              }
            };
          } else {
            this.imageData = c.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            this.$refs.image.innerHTML = '<img width=\'' + this.clientHeight * 0.45 +
              '\' height=\'' + this.clientHeight * 0.8 + '\' src=\'' + this.imageData + '\'>';
          }
        };
        drawing();
      },
      downloadImage () {
        if (this.imageData) {
          let a = document.createElement('a');
          a.href = this.imageData;
          a.download = 'img.png';
          this.$refs.popImage.appendChild(a);
          a.click();
          a.remove();
        }
      },
      init () {
        this.createImage();
      },
    },
    mounted () {
      this.init();
    },
  };
</script>
<style lang='scss' scoped>
  .content {
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
  .submit {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 15vh;
    margin-top: 5vh;
  }
  .submitBtn {
    margin-bottom: 2.5vh;
  }
</style>
