<template>
  <div class="home">
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
        <section class="content-hots-wrapper g-mobile-container">
          <h2 class='content-common-title'>{{$t('public.public_ad_title')}}</h2>
          <h3 class='content-common-sub-title'>
            <span class=''>{{$t('public.public_ad_info')}}</span>
            <!-- <router-link to="/foo">Go to Foo</router-link> -->
          </h3>
          <h3 class='content-common-sub-title'>
            <router-link to="/buy?currency=dai" class='content-common-title-link'>
              {{$t('public.public_ad_go_adList')}}
            </router-link>
          </h3>
          <div class="content-hots-list">
            <div class="content-hots-list-item" v-for="(ad, index) in ads" :key="index">
              <Card :ad="ad" :classType=" index + 1 "></Card>
            </div>
          </div>
        </section>
      </div>
      <div class="content-features">
        <section class="content-features-wrapper g-mobile-container">
          <div class="content-features-item">
            <div class="content-features-item-avator">
              <img class='avator-image' src="../../static/images/home/Home-Iocn1.jpg" alt="">
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
              <img class='avator-image' src="../../static/images/home/Home-Icon2.jpg" alt="">
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
              <img class='avator-image' src="../../static/images/home/Home-Icon3.jpg" alt="">
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
  import Card from 'mobile/components/public/deal-cards';

  export default {
    name: 'home',
    data () {
      return {
        carousel: {
          value: HOME_CAROUSEL.defaultIndex - 1,
          speed: HOME_CAROUSEL.speed,
          list: HOME_CAROUSEL.list,
        },
        ads: [],
        announcements: {},
      };
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
            // this.$Message.error(this.$t("public.ads_request_fail"));
          }
        }).catch(err => {
          // this.$Message.error(this.$t("public.ads_request_fail"));
        });
      },
      getAnnouncements () {
        this.$store.dispatch('ajax_announcements', {
          ln: window.localStorage.getItem('language').toLowerCase(),
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.announcements = res.data.data;
          } else {
          }
        }).catch(err => {
        });
      },
      goCarousel (url) {
        this.$goRouter(url);
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
      },
    },
    mounted () {
      this.init();
    },
  };
</script>
<style lang="scss" scoped>
  @import "../../style/variables";

  .content {
    &-common {
      &-title {
        font-weight: normal;
        font-size: 1.5rem;
        color: $font-color;
        display: flex;
        width: 100vw;
        align-items: center;
        justify-content: center;
      }
      &-sub-title {
        font-weight: normal;
        color: #666;
        font-size: 1rem;
        display: flex;
        width: 100vw;
        align-items: center;
        justify-content: center;
        &:last-of-type {
          margin-bottom: 5vh;
        }
      }
      &-title-link {
        text-decoration: underline;
      }
    }
    &-hots {
      padding-top: 5vh;
      // background-color: #f4f6f9;
      &-wrapper {
        display: flex;
        width: 100vw;
        flex-direction: column;
        align-items: center;
        padding-bottom: 5vh;
        margin-bottom: 0;
      }
      &-list {
        width: 100vw;
        &-item {
          display: flex;
          width: 100vw;
          flex-direction: column;
          align-items: center;
          padding-bottom: 5vh;
        }
      }
    }
    &-features {
      background-color: #fff;
      &-wrapper {
        display: flex;
        width: 100vw;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      &-item {
        display: flex;
        width: 100vw;
        flex-direction: column;
        align-items: center;
        &-avator {
          width: 20vh;
          height: 20vh;
          margin-bottom: 1vh;
          .avator-image {
            width: 100%;
            height: 100%;
          }
        }
        &-title {
          font-size: 1rem;
          font-weight: normal;
        }
        &-content {
          text-align: center;
          font-size: 0.8rem;
          color: #666666;
        }
        &:first-of-type {
          padding-top: 5vh;
        }
        &:last-of-type {
          padding-bottom: 5vh;
        }
      }
    }
  }

  .announcements {
    background: #000000;
    height: 2rem;
    width: 100vw;
    text-align: center;
  }

  .announcements span {
    font-family: PingFangSC-Semibold sans-serif;
    font-size: 0.85rem;
    color: #FFFFFF;
    line-height: 2rem;
    letter-spacing: 0;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>