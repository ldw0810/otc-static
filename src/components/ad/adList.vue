<template>
    <div class="wrapper">
        <div class="g-container">
            <Tab
                :tabs='transList(currencyList)'
                :defaultIndex = '+tabIndex'
                @changeIndex = 'changeTab'
            >
                <div class="g-list g-list-type-1" v-if="ads.list && ads.list.length">
                    <header class="g-list-header">
                        <Row
                                type="flex"
                        >
                            <i-col span="4" class='g-list-header-title'>{{$t("order.order_trader")}}</i-col>
                            <i-col span="4" class='g-list-header-title'>{{$t("order.order_eval")}}</i-col>
                            <i-col span="4" class='g-list-header-title'>{{$t("order.order_payment")}}</i-col>
                            <i-col span="4" class='g-list-header-title'>{{$t("order.order_limit")}}</i-col>
                            <i-col span="4" class='g-list-header-title'>{{$t("order.order_price")}}</i-col>
                            <i-col span="4" class='g-list-header-title'></i-col>
                        </Row>
                    </header>
                    <section class='g-list-content'>
                        <Row
                                class='g-list-content-item'
                                type="flex"
                                v-for="(ad, adIndex) in ads.list" :key="adIndex"
                        >
                            <i-col span="4" class='g-list-content-item-col'>
                                <div class='avator'>
                                    <Avator
                                            :status='ad.member.online'
                                    />
                                    <span class='avator-name u-ellipsis-1'>{{ad.member.nickname}}</span>
                                </div>
                            </i-col>
                            <i-col span="4" class='g-list-content-item-col rate'>
                                <div>
                                    {{$t("order.order_trade_count").format(ad.member.stat.trade_count)}}
                                </div>
                                <div>
                                    {{$t("order.order_praise_rate")}}:{{ad.member.stat.good_rate}}%
                                </div>
                            </i-col>
                            <i-col span="4" class='g-list-content-item-col'>
                                <div>
                                    {{ad.pay_kind ? $t("public['" + ad.pay_kind + "']") :
                                    $t("public.currencyExchange")}}
                                </div>
                            </i-col>
                            <i-col span="4" class='g-list-content-item-col'>
                                <div>
                                    {{$fixDeciamlAuto(ad.min_limit, ad.target_currency)}}
                                     &nbsp;-&nbsp;
                                     {{$fixDeciamlAuto(ad.order_limit, ad.target_currency)}}
                                    
                                    {{$t("public['" + ad.target_currency + "']")}}
                                </div>
                            </i-col>
                            <i-col span="4" class='g-list-content-item-col'>
                                <div class='pay'>
                                    {{$fixDeciamlAuto(ad.current_price, ad.target_currency)}}                                   
                                    {{$t("public['" + ad.target_currency + "']")}}
                                </div>
                            </i-col>
                            <i-col span="4" class='g-list-content-item-col'>
                                <i-button type='primary' @click="deal(ad.id)">
                                    {{+adType === 0 ? $t("public.buy") + " " + currency.toUpperCase() :
                                    $t("public.sell") + " " + currency.toUpperCase()}}
                                </i-button>
                            </i-col>
                        </Row>
                    </section>
                </div>
                <emptyList
                        v-if='!ads.list.length'
                        :loading='loading'
                        :text='emptyMessage'
                />
                <Page v-if='ads.list.length' class='m-ivu-pages' :current="ads.page" :total="ads.total_count"
                          :page-size="ads.per_page"
                          @on-change="changePage"></Page>
            </Tab>
        </div>
    </div>
</template>
<script type="es6">
    import Avator from "@/components/public/avator";
    import Tab from '@/components/public/tab';
    import emptyList from "@/components/public/empty-list";

    export default {
        components: {
            Avator,
            emptyList,
            Tab
        },
        data() {
            return {
                loading: true,
                adType: 0,
                ads: {
                    list: [],
                    page: 1,
                    per_page: 20,
                    total_count: 0,
                    total_pages: 1
                }
            };
        },
        watch: {
            $route: function (val) {
                this.init();
            }
        },
        computed: {
            emptyMessage() {
                let text = "";
                if (+this.adType === 0 && this.currency.toUpperCase() === "DAI") {
                    text = this.$t("public.no_buy_dai_ad");
                } else if (+this.adType === 1 && this.currency.toUpperCase() === "DAI") {
                    text = this.$t("public.no_sell_dai_ad");
                } else if (+this.adType === 0 && this.currency.toUpperCase() === "ETH") {
                    text = this.$t("public.no_buy_eth_ad");
                } else if (+this.adType === 1 && this.currency.toUpperCase() === "ETH") {
                    text = this.$t("public.no_sell_eth_ad");
                }
                return text;
            },
            currency() {
                return this.$route.query.currency || this.$store.state.currencyList[0];
            },
            currencyList() {
                return this.$store.state.currencyList
            },
            tabIndex() {
                let index = 0;
                for (let i = 0; i < this.currencyList.length; i++) {
                    if (this.currencyList[i] === this.currency) {
                        index = i;
                        break;
                    }
                }
                return "" + index;
            }
        },
        methods: {
            transList(list) {
                return list.map(item => {
                    return this.$t(`public.${item}`)
                })
            },
            changeTab(index) {
                this.$goRouter(this.$route.path, {
                    currency: this.currencyList[index]
                });
            },
            changePage(pageIndex) {
                this.getAdList(this.tabIndex, pageIndex);
            },
            getAdList(index, pageIndex) {
                index = +index || +this.tabIndex;
                this.loading = true;
                this.ads.list = [];
                this.$store.dispatch("ajax_ads", {
                    limit: this.ads.per_page,
                    page: pageIndex || this.ads.page,
                    op_type: +this.adType === 0 ? "sell" : "buy",
                    currency: this.currencyList[index]
                }).then(res => {
                    this.loading = false;
                    if (res.data && +res.data.error === 0) {
                        this.ads = res.data;
                    } else {
                        this.$Message.error(this.$t("order.order_list_request_fail"));
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$Message.error(this.$t("order.order_list_request_fail"));
                });
            },
            deal(id) {
                if (!this.$store.state.userToken) {
                    this.$goRouter("/user/login", {
                      redirect: this.$route.fullPath
                    });
                } else if (!this.$store.state.userInfo.activated) {
                    this.$store.commit("showAuthEmail_setter", 1);
                } else {
                    this.$goRouter("/detail", {
                        adType: this.adType,
                        id: id
                    });
                }
            },
            init() {
                if (this.$route.name === "/buy") {
                    this.adType = 0;
                    this.$store.commit("header_index_setter", "1" + (+this.tabIndex + 1));
                } else {
                    this.adType = 1;
                    this.$store.commit("header_index_setter", "2" + (+this.tabIndex + 1));
                }
                this.getAdList();
            }
        },
        mounted() {
            this.init();
        }
    };
</script>
<style lang='scss' scoped>
    .wrapper {
        background-color: #fafbfd;
        padding-top: 30px;
    }
</style>
