<template>
  <div class="home">
    <div class="carousel" v-if="carousel.list.length === 1">
      <div class="img" :style="{backgroundImage: 'url('+getImg(carousel.list[0])+')'}"
           @click.stop="goCarousel(carousel.list[0].jump_to)">
      </div>
    </div>
    <div class="carousel" v-else-if="carousel.list.length > 1">
      <Carousel class='m-ivu-carousel' autoplay :autoplay-speed="carousel.speed" v-model="carousel.value" loop
                :radius-dot='true'>
        <CarouselItem v-for="(item, index) in carousel.list" :key="index">
          <div class="img" :style="{backgroundImage: 'url('+getImg(item)+')'}" @click.stop="goCarousel(item.jump_to)"
               v-show="item.is_show">
          </div>
        </CarouselItem>
      </Carousel>
    </div>
    <div class="announcements" v-if="announcements.title">
      <span @click="goAnnouncements(announcements.url)">
        {{announcements.title}}
      </span>
      <span v-if="announcements.breadcrumbs && announcements.breadcrumbs.length"
            @click="goAnnouncements(announcements.breadcrumbs[0].url)">
        ({{$t('public.public_see_more')}})
      </span>
    </div>
    <section class="content">
      <div class="content-hots">
        <section class="content-hots-wrapper g-container">
          <h2 class='content-common-title'>{{$t('public.public_ad_title')}}</h2>
          <h3 class='content-common-sub-title'>
            <span class=''>{{$t('public.public_ad_info')}}</span>
            <router-link to="/buy?currency=dai" class='content-common-title-link'>
              {{$t('public.public_ad_go_adList')}}
            </router-link>
            <!-- <router-link to="/foo">Go to Foo</router-link> -->
          </h3>
          <div class="content-hots-list">
            <div class="g-shadow content-hots-list-item" v-for="(ad, index) in ads" :key="index">
              <Card :ad="ad" :classType=" index + 1 "></Card>
            </div>
          </div>
        </section>
      </div>
      <div class="content-features">
        <section class="content-features-wrapper g-container">
          <div class="content-features-item">
            <div class="content-features-item-avator">
              <img class='avator-image' src="../static/images/home/Home-Iocn1.jpg" alt="">
            </div>
            <h3 class="content-features-item-title">
              {{$t('public.public_info_title_1')}}
            </h3>
            <p class='content-features-item-content'>
              {{$t('public.public_info_1')}}
            </p>
          </div>
          <div class="content-features-item">
            <div class="content-features-item-avator">
              <img class='avator-image' src="../static/images/home/Home-Icon2.jpg" alt="">
            </div>
            <h3 class="content-features-item-title">
              {{$t('public.public_info_title_2')}}
            </h3>
            <p class='content-features-item-content'>
              {{$t('public.public_info_2')}}
            </p>
          </div>
          <div class="content-features-item">
            <div class="content-features-item-avator">
              <img class='avator-image' src="../static/images/home/Home-Icon3.jpg" alt="">
            </div>
            <h3 class="content-features-item-title">
              {{$t('public.public_info_title_3')}}
            </h3>
            <p class='content-features-item-content'>
              {{$t('public.public_info_3')}}
            </p>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
  import {Carousel, CarouselItem} from 'iview';
  import {HOME_CAROUSEL, ZENDESK_DOMAIN_URL} from 'config/config';
  import Card from '@/components/public/deal-cards';

  export default {
    name: 'home',
    data () {
      return {
        ads: [],
        announcements: {},
      };
    },
    computed: {
      carousel () {
        return {
          value: HOME_CAROUSEL.defaultIndex - 1,
          speed: HOME_CAROUSEL.speed,
          list: this.$store.state.homeCarouselList,
        }
      },
    },
    components: {
      Carousel,
      CarouselItem,
      Card,
    },
    watch: {
      $route: function (val) {
        this.init();
      },
    },
    methods: {
      getAds () {
        this.$store.dispatch('ajax_ads_main').then(res => {
          if (res.data && +res.data.error === 0) {
            this.ads = res.data.sell_ads.concat(res.data.buy_ads);
          } else {
          }
        }).catch(err => {
        });
      },
      getAnnouncements () {
        this.$store.dispatch('ajax_announcements', {
          ln: (window.localStorage.getItem("language") || "zh-TW").replace('HK', 'TW').toLowerCase()
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.announcements = res.data.data;
          } else {
          }
        }).catch(err => {
        });
      },
      getImg (item) {
        const language = window.localStorage.getItem('language');
        if (language === 'zh-CN') {
          return item.zh_img_src || '';
        } else if (language === 'zh-HK' || language === 'zh-TW') {
          return item.tw_img_src || '';
        } else {
          return item.en_img_src || '';
        }
      },
      goCarousel (url) {
        if (url && url.length) {
          window.location.href = url;
        }
      },
      goAnnouncements (url) {
        if (url && url.indexOf('http') === -1) {
          window.location.href = ZENDESK_DOMAIN_URL + url;
        } else {
          window.location.href = url;
        }
      },
      init () {
        this.$store.commit('header_index_setter', 0);
        this.getAds();
        this.getAnnouncements();
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.dispatch("ajax_banner", {
          activity_type: 0,
          device_type: "pc"
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            vm.$store.commit("homeCarouselList_setter", res.data.list);
          } else {
          }
        }).catch(err => {
        });
      });
    },
    mounted() {
      this.init();
    },
  };
</script>
<style lang="scss" scoped>
  @import "../style/variables";

  .content {
    &-common {
      &-title {
        font-weight: normal;
        font-size: 24px;
        color: $font-color;
        margin-bottom: 10px;
      }
      &-sub-title {
        font-weight: normal;
        font-size: 16px;
        color: #666;
        margin-bottom: 40px;
      }
      &-title-link {
        text-decoration: underline;
      }
    }
    &-hots {
      padding-top: 50px;
      // background-color: #f4f6f9;
      &-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 90px;
        margin-bottom: 0;
      }
      &-list {
        width: 100%;
        display: flex;
        &-item {
          margin-right: 30px;
        }
      }
    }
    &-features {
      background-color: #fff;
      &-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: (108px - 70px + 30px);
        padding-top: 70px;
        margin-bottom: 0;
      }
      &-item {
        width: 33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        &-avator {
          width: 100px;
          height: 100px;
          margin-bottom: 26px;
          .avator-image {
            width: 100%;
            height: 100%;
          }
        }
        &-title {
          font-size: 20px;
          font-weight: normal;
          margin-bottom: 8px;
        }
        &-content {
          text-align: center;
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }
</style>

<style lang='scss' scoped>
  .home img {
    object-fit: cover;
    object-position: 0 0;
    width: 100%;
    height: 100%;
  }

  .home .carousel {
    height: 440px;
    width: 100%;
    min-width: 1080px;
  }

  .imgCursor {
    cursor: pointer;
  }

  .home .carousel .img {
    height: 440px;
    width: 100%;
    min-width: 1080px;
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .announcements {
    background: #000000;
    height: 34px;
    width: 100%;
    min-width: 1080px;
    text-align: center;
  }

  .announcements span {
    font-family: PingFangSC-Semibold sans-serif;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 34px;
    letter-spacing: 0;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
