<template>
  <div class="order">
    <div class="g-mobile-container">
      <Tab
          :tabs='tabList'
          tabType='inner'
          :defaultIndex='+tabIndex'
          @changeIndex='changeTab'
      >
        <div class='order-content'>
          <div v-if='orders.list.length' class="g-mobile-list g-mobile-list-type-2">
            <header class="g-mobile-list-header">
              <Row
                  type="flex"
              >
                <i-col span="4" class='g-mobile-list-header-title'>{{$t("order.order_trader")}}</i-col>
                <i-col span="3" class='g-mobile-list-header-title'>{{$t("order.order_id")}}</i-col>
                <i-col span="2" class='g-mobile-list-header-title'>{{$t("order.order_type")}}</i-col>
                <i-col span="3" class='g-mobile-list-header-title'>{{$t("order.order_money_amount")}}</i-col>
                <i-col span="3" class='g-mobile-list-header-title'>{{$t("order.order_number")}}</i-col>
                <i-col span="4" class='g-mobile-list-header-title'>{{$t("order.order_time")}}</i-col>
                <i-col span="3" class='g-mobile-list-header-title'>{{$t("order.order_status")}}</i-col>
                <i-col span="2" class='g-mobile-list-header-title'>{{$t("public.operation")}}</i-col>
              </Row>
            </header>
            <section class="g-mobile-list-content">
              <Row
                  class='g-mobile-list-content-item'
                  type="flex"
                  v-for="(order, orderIndex) in orders.list" :key="orderIndex"
                  :class="{'g-mobile-list-content-item-unread': order.notice_order !== 0}"
              >
                <!-- avator -->
                <i-col span="4" class='g-mobile-list-content-item-col'>
                  <div class='avator'>
                    <Avator
                        :status='order.member.online'
                    />
                    <span class='avator-name u-ellipsis-1'>{{order.member.nickname}}</span>
                  </div>
                </i-col>
                <i-col span="3" class='g-mobile-list-content-item-col'>
                  {{order.id}}
                </i-col>
                <i-col span="2" class='g-mobile-list-content-item-col'>
                  <div>
                    {{$t("public['" + order.op_type + "']")}}
                    {{$t("public['" + order.currency + "']")}}
                  </div>
                </i-col>
                <i-col span="3" class='g-mobile-list-content-item-col'>
                  <div>
                    {{$fixDecimalAuto(order.price_sum, order.target_currency)}}
                                      
                    {{$t("public['" + order.target_currency + "']")}}
                  </div>
                </i-col>
                <i-col span="3" class='g-mobile-list-content-item-col'>
                  <div>
                    {{$fixDecimalAuto(order.amount)}}
                  </div>
                </i-col>
                <i-col span="4" class='g-mobile-list-content-item-col'>
                  <div>
                    {{new Date(+order.created_at * 1000).format("yyyy/MM/dd hh:mm:ss")}}
                  </div>
                </i-col>
                <i-col span="3" class='g-mobile-list-content-item-col'>
                  <div>
                    {{$t("order['order_status_" + order.status + "']")}}
                  </div>
                </i-col>
                <i-col span="2" class='g-mobile-list-content-item-col'>
                  <a href='javascript:;' class='action-link' @click="showInfo(order.id)">{{$t("public.info")}}</a>
                </i-col>
              </Row>
            </section>
          </div>
          <emptyList
              v-if='!orders.list.length'
              :loading='loading'
              :iconType='2'
              :text='computedText'
          />
          <Page v-if='orders.list.length' class='m-ivu-pages' :current="orders.page" :total="orders.total_count"
                :page-size="orders.per_page"
                @on-change="changePage"></Page>
        </div>
      </Tab>

    </div>
  </div>
</template>
<script type="es6">
  import Avator from "mobile/components/public/avator";
  import Tab from "mobile/components/public/tab";
  import emptyList from "mobile/components/public/empty-list";

  export default {
    components: {
      Avator,
      emptyList,
      Tab
    },
    data() {
      return {
        loading: true,
        tabList: [
          this.$t("order.order_unfinished"),
          this.$t("order.order_finished")
        ],
        orders: {
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
      pageIndex(){
        return this.$route.query.pageIndex || 1;
      },
      computedText() {
        return this.tabIndex === "0"
          ? this.$t("public.no_complete_order")
          : this.$t("public.no_unfinished_order");
      }
    },
    methods: {
      transList(list) {
        return list.map(item => {
          return this.$t(`public.${item}`);
        });
      },
      showOrders() {
        this.loading = true;
        this.orders.list = [];
        this.$store
          .dispatch("ajax_order_list", {
            limit: +this.orders.per_page,
            page: +this.pageIndex || +this.orders.page,
            complete: +this.tabIndex
          })
          .then(res => {
            this.loading = false;
            if (res.data && +res.data.error === 0) {
              this.orders = res.data;
            } else {
              // this.$Message.error(this.$t("order.order_data_request_fail"));
            }
          })
          .catch(err => {
            this.loading = false;
            // this.$Message.error(this.$t("order.order_data_request_fail"));
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
      showInfo(id) {
        this.$goRouter("/order", {
          id: id
        });
      },
      init() {
        this.$store.commit("header_index_setter", "7");
        this.showOrders();
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
  .order {
    padding-top: 30px;
  }
</style>
