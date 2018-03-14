<template>
  <div class="myAd">
    <div class="g-container">
      <Tab
          :tabs='tabList'
          tabType='inner'
          :defaultIndex='+tabIndex'
          @changeIndex='changeTab'
      >
        <div class=' myAd-content'>
          <div class="g-list g-list-type-2" v-if="myAds.list.length">
            <header class="g-list-header">
              <Row
                  type="flex"
              >
                <i-col span="3" class='g-list-header-title'>{{$t("ad.ad_id")}}</i-col>
                <i-col span="4" class='g-list-header-title'>{{$t("ad.ad_type")}}</i-col>
                <i-col span="4" class='g-list-header-title'>{{$t("public.price")}}</i-col>
                <i-col span="4" class='g-list-header-title'>{{$t("ad.ad_premium")}}</i-col>
                <i-col span="3" class='g-list-header-title'>{{$t("ad.ad_time")}}</i-col>
                <i-col span="3" class='g-list-header-title'>{{$t("ad.ad_payment")}}</i-col>
                <i-col span="3" class='g-list-header-title'>{{$t("public.operation")}}</i-col>
              </Row>
            </header>
            <section class="g-list-content">
              <Row
                  class='g-list-content-item'
                  type="flex"
                  v-for="(item, subIndex) in myAds.list" :key="subIndex"
              >
                <i-col span="3" class='g-list-content-item-col'>
                  <div>
                    {{item.id}}
                  </div>
                </i-col>
                <i-col span="4" class='g-list-content-item-col'>
                  <div>
                    {{$t("public['" + item.op_type + "']")}}
                    {{$t("public['" + item.currency + "']")}}
                  </div>
                </i-col>
                <i-col span="4" class='g-list-content-item-col'>
                  <div>
                    {{$fixDeciamlAuto(item.current_price, item.target_currency)}}

                    {{$t("public['" + item.target_currency + "']")}}
                  </div>
                </i-col>
                <i-col span="4" class='g-list-content-item-col'>
                  <div>
                    {{item.margin}}%
                  </div>
                </i-col>
                <i-col span="3" class='g-list-content-item-col'>
                  <div>
                    {{new Date(+item.created_at * 1000).format("yyyy/MM/dd hh:mm:ss")}}
                  </div>
                </i-col>
                <i-col span="3" class='g-list-content-item-col'>
                  <div>
                    {{item.pay_kind ? $t("public['" + item.pay_kind + "']") :
                    $t("public.currencyExchange")}}
                  </div>
                </i-col>
                <i-col span="3" class='g-list-content-item-col'>
                  <div>
                    <div v-if="+tabIndex === 0">
                      <a href='javascript:' class='action-link' @click="closeAd(item.id)"
                         v-if="+tabIndex === 0">{{$t("ad.ad_close")}}</a>
                    </div>
                    <div v-else>
                      <p class="text" v-if="+item.locked > 0">
                        {{$t("ad.ad_trading")}}
                      </p>
                      <a href='javascript:' class='action-link' @click="updateAd(item.id,item.currency)" v-else>
                        {{$t("public.modify")}}
                      </a>
                      <p class="text" v-if="+item.balance_limit && +item.balance_limit < +item.min_limit">
                        {{$t("ad.ad_asset_deficiency")}}
                      </p>
                      <a href='javascript:' class='action-link' @click="openAd(item.id)" v-else>
                        {{$t("ad.ad_open")}}
                      </a>
                    </div>
                  </div>
                </i-col>
              </Row>
            </section>
          </div>
          <emptyList
              v-if='!myAds.list.length'
              :loading='loading'
              :text='computedText'
          />
          <Page v-if='myAds.list.length' class='m-ivu-pages' :current="myAds.page" :total="myAds.total_count"
                :page-size="myAds.per_page"
                @on-change="changePage"></Page>
        </div>
      </Tab>
    </div>
  </div>
</template>
<script type="es6">
  import emptyList from "@/components/public/empty-list";
  import Tab from "@/components/public/tab";

  export default {
    components: {
      emptyList,
      Tab
    },
    data() {
      return {
        loading: true,
        tabList: [this.$t("ad.ad_ongoing"), this.$t("ad.ad_closed")],
        myAds: {
          list: [],
          page: 1,
          per_page: 20,
          total_count: 0,
          total_pages: 1
        }
      };
    },
    computed: {
      tabIndex() {
        return "" + (this.$route.query.status || 0);
      },
      computedText() {
        return this.tabIndex === "0"
          ? this.$t("public.no_underway_ad")
          : this.$t("public.no_off_ad");
      }
    },
    methods: {
      showMyAds() {
        this.loading = true;
        this.myAds.list = [];
        this.$store
          .dispatch("ajax_ads_my", {
            limit: +this.myAds.per_page,
            page: +this.pageIndex || +this.myAds.page,
            status: +this.tabIndex === 0 ? "ongoing" : "closed"
          })
          .then(res => {
            this.loading = false;
            if (res.data && +res.data.error === 0) {
              this.myAds = res.data;
            } else {
              // this.$Message.error(this.$t("ad.ad_data_request_fail"));
            }
          })
          .catch(err => {
            this.loading = false;
            // this.$Message.error(this.$t("ad.ad_data_request_fail"));
          });
      },
      changePage(pageIndex) {
        this.$goRouter(this.$route.fullPath, {
          pageIndex: pageIndex
        });
      },
      changeTab(index) {
        this.$goRouter(this.$route.path, {
          status: index
        });
      },
      updateAd(id, currency) {
        this.$goRouter("/ad", {
          update: 1,
          adId: id,
          currency: currency
        });
      },
      closeAd(id) {
        this.$store
          .dispatch("ajax_update_ad_status", {
            id: id,
            status: "closed"
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.$Message.success(this.$t("ad.ad_close_success"));
              this.showMyAds();
            } else {
              this.$Modal.error({
                title: this.$t("public.error_title_default"),
                content: this.$t("ad.ad_close_fail")
              })               
            }
          })
      },
      openAd(id) {
        this.$store
          .dispatch("ajax_update_ad_status", {
            id: id,
            status: "ongoing"
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.$Message.success(this.$t("ad.ad_open_success"));
              this.showMyAds();
            } else {
              this.$Modal.error({
                title: this.$t("public.error_title_default"),
                content: this.$t("ad.ad_open_fail")
              })               
            }
          })
      },
      init() {
        this.$store.commit("header_index_setter", "92");
        this.showMyAds();
      }
    },
    watch: {
      $route: function (val) {
        this.init();
      }
    },
    mounted() {
      this.init();
    }
  };
</script>
<style lang='scss' scoped>
  .myAd {
    padding-top: 30px;
  }
</style>
