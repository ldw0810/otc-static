<template>
    <div class='card shadow' v-if="ad && ad.id">
        <header :class='computedClass'>
            <div class="avator-wrapper">
                <avator :status="ad.member.online" :name="ad.member.nickname"/>
            </div>
            <div class="integral-wrapper">
                <div class="integral">
                    <p class='integral-number'>{{ad.member.stat.trade_count}}</p>
                    <p class='integral-desc'>{{$t("user.transaction_count")}}</p>
                </div>
                <div class="integral">
                    <p class='integral-number'>{{ad.member.stat.good_rate}}%</p>
                    <p class='integral-desc'>{{$t("user.evaluate")}}</p>
                </div>
            </div>
        </header>
        <div class="card-content">
            <div class="card-content-item">
              {{$t("order.order_order_price")}}：
              {{$fixDecimalAuto(ad.current_price, ad.target_currency)}}
              {{$t("public['" + ad.target_currency + "']")}}
                <!-- <p class='desc'>{{$t("order.order_order_price")}}:</p>
                <p class='number'>
                  {{$fixDecimalAuto(ad.current_price, ad.target_currency)}}
                <p class='currency-type'>{{$t("public['" + ad.target_currency + "']")}}</p> -->
            </div>
            <div class="card-content-item">
              {{$t("order.order_trade_limit")}}：
              {{$fixDecimalAuto(ad.min_limit, ad.target_currency)}}
              -
              {{$fixDecimalAuto(ad.order_limit, ad.target_currency)}}
              {{$t("public['" + ad.target_currency + "']")}}
            </div>
            <div class="card-content-item">
              {{$t("order.order_order_payment")}}：&nbsp;
              <span class='pay-logo' :class="{'pay-logo-card': ad.pay_kind == 'bank',
                'pay-logo-alipay': ad.pay_kind == 'alipay'}"></span>
              <span class='pay-desc'>
                  {{$t("public['" + ad.pay_kind + "']")}}
              </span>
            </div>
        </div>
        <div class="u-flex u-flex-center btn-wrapper">
            <i-button @click="goDeal" class='btn'>
                {{$t("public['" + (ad.op_type == 'buy' ? 'sell' : 'buy') + "']")}}
                {{$t("public['" + ad.currency + "']")}}
            </i-button>
        </div>
    </div>
</template>
<script>
import avator from "./avator";
export default {
  props: {
    ad: {
      type: Object,
      default: {}
    },
    classType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  computed: {
    computedClass() {
      const typeClass = `card-header-type-${this.classType}`;
      return ["card-header", typeClass];
    }
  },
  methods: {
    goDeal() {
      if (this.ad) {
        this.$goRouter("/detail", {
          adType: this.ad.op_type == "sell" ? 0 : 1,
          id: this.ad.id
        });
      }
    }
  },
  components: {
    avator
  }
};
</script>
<style lang="scss" scoped>
$baseImage: "~images";
.card {
  width: 270px;
  padding-bottom: 20px;
  background-color: #fff;
  &-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 170px;
    background-size: 100%;
    background-position: center;
    padding-top: 26px;
  }
  @for $i from 1 through 4 {
    &-header-type-#{$i} {
      background-image: url(#{$baseImage}/home/Home-UserBg#{$i}.jpg);
    }
  }
  // &-header-type-1 {
  //     background-image: url(#{$baseImage}/home/Home-UserBg1.jpg);
  // }
  &-content {
    padding: 42px 10px 31px;
    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;
      font-size: 12px;
      margin-bottom: 10px;
      .desc {
        margin-right: 5px;
      }
      .number {
        margin-right: 5px;
        color: #666;
      }
      .pay {
        display: flex;
        align-items: center;

      }
    }
  }
}
.pay-logo {
  width: 14px;
  height: 14px;
  display: block;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
  margin-right: 5px;
}
.pay-logo-alipay {
  background-image: url(#{$baseImage}/C-Alipay.png);
}
.pay-logo-card {
  background-image: url(#{$baseImage}/C-Card.png);
}
.pay-desc {
  color: #666;
}
.btn-wrapper {
  .btn {
    width: 191px;
  }
}

.avator-wrapper {
  margin-bottom: 26px;
}

.integral-wrapper {
  display: flex;
  width: 100%;
}

.integral {
  color: #fff;
  width: 50%;
  display: flex;
  flex-direction: column;
  flex:1;
  justify-content: center;
  align-items: center;
  &-number {
    margin-bottom: 5px;
  }
}
</style>
