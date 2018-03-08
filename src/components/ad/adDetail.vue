<template>
  <div class="detail g-container">
    <!-- 头部 -->
    <header class="g-shadow header" v-if="ad.id">
      <div class='header-avator'>
        <Avator
            :size='64'
            :status='ad.member.online'/>
      </div>
      <div class='header-content'>
        <div class='header-content-name'>
          {{ad.member.nickname}}
        </div>
        <div class='header-content-list'>
          <div class='header-content-item'>
            {{$t("order.order_trade_count").format(ad.member.stat.trade_count)}}
          </div>
          <div class='header-content-item'>
            {{$t("order.order_praise_rate")}}:{{ad.member.stat.good_rate}}%
          </div>
          <div class='header-content-item'>
            <img src="../../static/images/icon/Email-999999.svg"/>
            {{$t("order.order_email_verified")}}
          </div>
          <div class='header-content-item'>
            <img src="../../static/images/icon/Phone-999999.svg"/>
            {{ad.member.mobile ? $t("order.order_phone_verified") :
            $t("order.order_phone_notVerified")}}
          </div>
        </div>
      </div>
    </header>
    <!-- 交易 -->
    <div class="g-shadow deal" v-if="ad.id">
      <div class='deal-common deal-info'>
        <div class="deal-info-item">
          <div class="deal-info-item-title">
            {{$t("order.order_offer")}}：
          </div>
          <div class="deal-info-item-desc">
            <span v-if='DigitalCurrency.indexOf(ad.target_currency.toUpperCase()) > -1'>
              {{ad.current_price | fix_decimals_base }}
            </span>
            <span v-if='legalTender.indexOf(ad.target_currency.toUpperCase()) > -1'>
              {{ad.current_price|fix_decimals_legal}}
            </span>
            {{$t("public['" + ad.target_currency + "']")}}
            &nbsp;/&nbsp;
            {{$t("public['" + ad.currency + "']")}}
          </div>
        </div>
        <div class="deal-info-item">
          <div class="deal-info-item-title">
            {{$t("order.order_trade_limit")}}：
          </div>
          <div class="deal-info-item-desc">
            <span v-if='DigitalCurrency.indexOf(ad.target_currency.toUpperCase()) > -1'>
              {{ad.min_limit | fix_decimals_base}}
              &nbsp;-&nbsp;
              {{ad.order_limit | fix_decimals_base}}
            </span>
            <span v-if='legalTender.indexOf(ad.target_currency.toUpperCase()) > -1'>
              {{ad.min_limit | fix_decimals_legal}}
              &nbsp;-&nbsp;
              {{ad.order_limit | fix_decimals_legal}}
            </span>
            {{$t("public['" + ad.target_currency + "']")}}
          </div>
        </div>
        <div class="deal-info-item">
          <div class="deal-info-item-title">
            {{$t("order.order_payment")}}：
          </div>
          <div class="deal-info-item-desc">
            {{ad.pay_kind ? $t("public['" + ad.pay_kind + "']") : $t("public.currencyExchange")}}
          </div>
        </div>
        <div class="deal-info-item">
          <div class="deal-info-item-title">
            {{$t("ad.ad_remark")}}：
          </div>
          <div class="deal-info-item-desc">
            {{ad.remark}}
          </div>
        </div>
      </div>
      <div class='deal-common deal-exchange'>
        <h3 class='deal-common-title deal-exchange-title'>
          {{(+adType === 0 ? $t("order.order_buy_title") : $t("order.order_sell_title")).format($t("public['" +
          ad.currency + "']"))}}
        </h3>
        <Form class="form" ref="form" @checkValidate='checkValidate' :model="form" :rules="rules">
          <Row type='flex'>
            <i-col span="11">
              <FormItem prop="moneyAmount" class="form-item">
                <i-input class="input" v-model="form.moneyAmount" type="text" @on-change="changeAmount"
                         :placeholder="+adType === 0 ? $t('order.order_buy_money_amount'): $t('order.order_sell_money_amount')">
                  <span slot="append">{{$t("public['" + ad.target_currency + "']")}}</span>
                </i-input>
              </FormItem>
            </i-col>
            <i-col span="2" class='arrow u-flex u-flex-center-middle'>
              <Icon type="arrow-swap"></Icon>
            </i-col>
            <i-col span="11">
              <FormItem prop="number" class="formItem">
                <i-input class="input" v-model="form.number" type="text" @on-change="changeNumber"
                         :placeholder="+adType === 0 ? $t('order.order_buy_number'): $t('order.order_sell_number')">
                  <span slot="append">{{$t("public['" + ad.currency + "']")}}</span>
                </i-input>
              </FormItem>
            </i-col>
          </Row>
          <FormItem class="formItem submit">
            <i-button class="deal-exchange-btn" type='primary' :disabled='!validate' @click="submit">
              {{+adType === 0 ? $t('order.order_buy_confirm') : $t('order.order_sell_confirm')}}
            </i-button>
          </FormItem>
        </Form>
      </div>
      <div class="border"></div>
      <div class='deal-common deal-rules'>
        <h3 class='deal-common-title deal-rules-title'>
          {{$t("order.order_trade_notice")}}
        </h3>
        <p class='deal-rules-content' v-html='$t("order.order_trade_notice_content")'>
        </p>
      </div>
    </div>

    <Modal v-model="confirmFlag.placeOrder" class-name="m-ivu-modal"
           width='480'
           :mask-closable="true" :closable="false"
           v-if="ad.id">
      <logoDiv style="margin: 0"/>
      <div class="detail-model">
        <h3 class='detail-model-title'>{{$t("order.order_place_order_confirm")}}</h3>
        <div class='detail-model-content'>
          <Row
          >
            <i-col class='text-left' span="8">
              {{+adType === 0 ? $t("ad.ad_buy_price") : $t("ad.ad_sell_price")}}:
            </i-col>
            <i-col class='text-left' span="116">
              {{+ad.current_price|fix_decimals_legal}}
              {{$t("public['" + ad.target_currency + "']")}}
              &nbsp;/&nbsp;
              {{$t("public['" + ad.currency + "']")}}
            </i-col>
          </Row>
          <Row>
            <i-col class='text-left' span="8">
              {{+adType === 0 ? $t("ad.ad_buy_money_amount") : $t("ad.ad_sell_money_amount")}}:
            </i-col>
            <i-col class='text-left' span="16">
              {{+form.moneyAmount|fix_decimals_legal}}
              {{$t("public['" + ad.target_currency + "']")}}
            </i-col>
          </Row>
          <Row>
            <i-col class='text-left' span="8">
              {{+adType === 0 ? $t("order.order_buy_number_title") : $t("order.order_sell_number_title")}}:
            </i-col>
            <i-col class='text-left' span="16">
              {{+form.number|fix_decimals_base}}
              {{$t("public['" + ad.currency + "']")}}
            </i-col>
          </Row>
        </div>
        <div class="detail-model-warn" v-if="ad.currency === 'dai'">
          {{+adType === 0 ? $t("order.order_place_order_buy_warn") : $t("order.order_place_order_sell_warn")}}
        </div>
        <div class="detail-model-warn" v-else>
          {{+adType === 0 ? $t("order.order_confirm_complete_buy_warn").format(form.moneyAmount, $t("public['" +
          ad.target_currency + "']"), form.number, $t("public['" + ad.currency + "']")) :
          $t("order.order_confirm_complete_sell_warn").format(form.number, $t("public['" + ad.currency + "']"),
          form.moneyAmount, $t("public['" + ad.target_currency + "']"))}}
        </div>
        <div class='g-comfirm-group'>
          <i-button class="submit-button" type="primary" :loading='submitPlaceOrderLoading' @click="placeOrder_submit">
            {{+adType === 0 ? $t("order.order_buy_confirm") : $t("order.order_sell_confirm")}}
          </i-button>
          <i-button class="cancel-button" @click="confirmFlag.placeOrder=false">
            {{$t('public.cancel')}}
          </i-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal width='480' v-model="confirmFlag.complete" class-name="m-ivu-modal" :mask-closable="true" :closable="false">
      <logoDiv style="margin: 0"/>
      <div class="detail-model">
        <h3 class='detail-model-title'>{{$t("order.order_complete")}}</h3>
        <div class='detail-model-content' style='width:292px;margin-bottom:92px' v-if="ad.id">
          <span v-if="+adType === 1"
                v-html='$t("order.order_complete_info").format(form.moneyAmount, $t("public[\"" + ad.target_currency + "\"]"))'></span>
          <span v-else
                v-html='$t("order.order_complete_info").format(form.number, $t("public[\"" + ad.currency + "\"]"))'></span>
          <a @click="$goRouter('/myOrder', {status: 1})">{{$t("order.order_show_order")}}</a>
          <span v-html='$t("public.or")'></span>
          <a @click="$goRouter('/asset')">{{$t("order.order_show_asset")}}</a>
        </div>
        <span>
          <i-button class="submit-button-2" type="primary" @click="doOper">
            {{$t('public.confirm')}}
          </i-button>
        </span>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script type="es6">
  import validateMixin from "@/components/mixins/validate-mixin";
  import {
    DigitalCurrency,
    legalTender,
    fixDecimalsBase,
    fixDecimalsLegal
  } from "config/config";
  import logoDiv from "../public/logo.vue";
  import Avator from "@/components/public/avator";

  export default {
    mixins: [validateMixin("form")],
    data() {
      const validateNumberCheck = (rule, value, callback) => {
        if (!+value || +value <= 0) {
          callback(new Error(this.$t("public.input_number_required")));
        } else {
          callback();
        }
      };
      const validateNumberLimitCheck = (rule, value, callback) => {
        if (+this.ad.min_limit > +this.ad.order_limit) {
          callback(new Error(this.$t("ad.ad_ceiling_number_notValid")));
        } else if (+value < this.ad.min_limit) {
          callback(new Error(this.$t("ad.ad_floor_limit")));
        } else if (+value > this.ad.order_limit) {
          callback(new Error(this.$t("ad.ad_ceiling_limit")));
        } else {
          callback();
        }
      };
      const validBalanceBuyCheck = (rule, value, callback) => {
        if (this.ad && +this.adType === 0) {
          if (this.ad.currency === `dai`) {
            callback();
          } else {
            if (this.balanceObj[this.ad.target_currency] < +value) {
              callback(new Error(this.$t("ad.ad_credit_low")));
            } else {
              callback();
            }
          }
        } else {
          callback();
        }
      };
      const validBalanceSellCheck = (rule, value, callback) => {
        if (this.ad && +this.adType === 1) {
          if (this.balanceObj[this.ad.currency] < +value) {
            callback(new Error(this.$t("ad.ad_credit_low")));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        DigitalCurrency,
        legalTender,
        submitPlaceOrderLoading: false,
        showModal: true,
        ad: {},
        form: {
          moneyAmount: "",
          number: ""
        },
        rules: {
          moneyAmount: [
            {
              required: true,
              message: this.$t("order.order_buy_money_amount")
            },
            {
              validator: validateNumberCheck
            },
            {
              validator: validateNumberLimitCheck
            },
            {
              validator: validBalanceBuyCheck
            }
          ],
          number: [
            {
              required: true,
              message: this.$t("order.order_buy_number")
            },
            {
              validator: validateNumberCheck
            },
            {
              validator: validBalanceSellCheck
            }
          ]
        },
        confirmFlag: {
          placeOrder: false,
          complete: false
        }
      };
    },
    watch: {},
    computed: {
      userInfo() {
        return this.$store.state.userInfo;
      },
      adType() {
        return +(this.$route.query.adType || 0);
      },
      id() {
        return this.$route.query.id;
      },
      balanceObj() {
        let obj = {};
        for (let i = 0; i < this.userInfo.valid_account.length; i++) {
          obj["" + this.userInfo.valid_account[i].currency] = this.userInfo.valid_account[i].balance;
        }
        return obj;
      },
      balanceFlag() {
        if (this.adType !== 1) {
          if (this.ad.currency === "dai") {
            return true;
          } else if (this.ad.currency === "eth") {
            return this.balanceObj["dai"] >= 100;
          }
        } else {
          if (this.ad.currency === "dai") {
            return this.balanceObj["dai"] >= 100;
          } else if (this.ad.currency === "eth") {
            return this.balanceObj["eth"] >= 0.01;
          }
        }
      }
    },
    methods: {
      doOper() {
        this.confirmFlag.complete = false;
      },
      getInfo() {
        this.$store
          .dispatch("ajax_get_ad", {
            id: this.id
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.ad = res.data.info;
            } else {
              this.$Message.error(this.$t("order.order_ad_info_request_fail"));
            }
          })
          .catch(err => {
            this.$Message.error(this.$t("order.order_ad_info_request_fail"));
          });
      },
      submit() {
        if (this.ad.member.id !== this.userInfo.id) {
          this.$refs["form"].validate(valid => {
            if (valid) {
              this.confirmFlag.placeOrder = true;
            } else {
              this.$Message.error(this.$t("order.order_info_notValid"));
            }
          });
        } else {
          this.$Message.error(this.$t("order.order_join_own_otc_ad"));
        }
      },
      changeAmount() {
        if (+this.form.moneyAmount || +this.form.moneyAmount === 0) {
          this.form.number = fixDecimalsBase(
            +this.form.moneyAmount / +this.ad.current_price
          );
        }
      },
      changeNumber() {
        if (+this.form.number || +this.form.number === 0) {
          if (
            DigitalCurrency.indexOf(this.ad.target_currency.toUpperCase()) > -1
          ) {
            this.form.moneyAmount = fixDecimalsBase(
              +this.form.number * +this.ad.current_price
            );
          } else if (
            legalTender.indexOf(this.ad.target_currency.toUpperCase()) > -1
          ) {
            this.form.moneyAmount = fixDecimalsLegal(
              +this.form.number * +this.ad.current_price
            );
          }
        }
      },
      placeOrder_submit() {
        this.submitPlaceOrderLoading = true;
        this.$store
          .dispatch("ajax_order_buy", {
            id: this.ad.id,
            price_sum: +this.form.moneyAmount
          })
          .then(res => {
            this.submitPlaceOrderLoading = false;
            if (res.data && res.data.error === 0) {
              if (this.ad.currency === "dai") {
                this.$goRouter("/order", {
                  id: res.data.order_id
                });
              } else {
                this.confirmFlag.placeOrder = false;
                this.confirmFlag.complete = true;
              }
            } else {
              this.confirmFlag.placeOrder = false;
              this.$Message.error(this.$t("order.order_deal_request_fail"));
            }
          })
          .catch(err => {
            this.submitPlaceOrderLoading = false;
            this.confirmFlag.placeOrder = false;
            this.$Message.error(this.$t("order.order_deal_request_fail"));
          });
      },
      init() {
        this.$store.commit("header_index_setter", "-1"); //清除header的按钮位置标识
        this.getInfo();
      }
    },
    mounted() {
      this.init();
    },
    components: {
      logoDiv,
      Avator
    }
  };
</script>
<style lang='scss' scoped>
  .text-left {
    text-align: left;
  }

  .detail {
    padding-top: 30px;
    &-model {
      padding: 52px 94px 54px;
      &-title {
        font-size: 24px;
        color: #666666;
        line-height: 28px;
        font-weight: normal;
        margin-bottom: 16px;
      }
      &-content {
        font-size: 16px;
        color: #666666;
        line-height: 28px;
        margin-bottom: 28px;
      }
      &-warn {
        font-size: 16px;
        color: #ed1c24;
        line-height: 20px;
        margin-bottom: 37px;
      }
    }
  }

  .submit-button {
    width: 182px;
    margin-right: 10px;
  }

  .submit-button-2 {
    width: 100%;
  }

  .cancel-button {
    width: 100px;
  }

  .header {
    background-color: #fff;
    display: flex;
    align-items: center;
    height: 150px;
    margin-bottom: 20px;
    &-avator {
      width: 60px;
      height: 60px;
      margin-left: 40px;
      margin-right: 32px;
    }
    &-content {
      &-name {
        font-size: 22px;
        line-height: 26px;
        margin-bottom: 14px;
      }
      &-list {
        display: flex;
      }
      &-item {
        font-size: 16px;
        margin-right: 26px;
      }
    }
  }

  .deal {
    background-color: #fff;
    padding: 60px 0 60px 40px;
    &-common {
      width: 1169px - 484px;
      border-bottom: 1px solid #eee;
      &-title {
        font-size: 16px;
        font-weight: normal;
        line-height: 19px;
      }
      &:last-child {
        border-bottom: 0;
      }
    }
    &-info {
      padding-bottom: 40px - 15px;
      &-item {
        display: flex;
        font-size: 16px;
        line-height: 19px;
        margin-bottom: 15px;
        &-title {
          width: 92px;
          flex-shrink: 0;
          margin-right: 22px;
        }
      }
    }
    &-exchange {
      padding-top: 58px;
      padding-bottom: 40px;
      &-title {
        margin-bottom: 12px;
      }
      .submit {
        margin-top: 10px;
      }
      .input {
        width: 100%;
      }
      .arrow {
        margin-top: -24px;
      }
      &-btn {
        width: 100%;
      }
    }
    &-rules {
      font-size: 16px;
      line-height: 19px;
      &-title {
        margin-top: 28px;
        margin-bottom: 22px;
      }
      &-content {
        line-height: 22px;
      }
    }
  }
</style>