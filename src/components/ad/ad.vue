<template>
  <div class="g-container">
    <div class='g-shadow ad'>
      <div class='ad-header'>
        <div class="g-title ad-title">{{$t("ad.ad_title").format($t("public['" + this.currency + "']"))}}</div>
        <div class="title-tip" v-html='$t("ad.ad_title_tip")'></div>
        <!--相同类型广告判断-->
        <div class="credit-low-tip" v-if="+adType === 0 ? !examineAdFlagList[0] : !examineAdFlagList[1]">
          <span class='red'>{{$t("ad.ad_publish_repeat_tip")}}</span>
        </div>
        <!-- 余额判断 -->
        <div class="credit-low-tip" v-if="!balanceFlag && +adType !== 1">
                    <span class='red'>{{$t("ad.ad_credit_low_tip").format(
                        $t("public['" + (currency === 'eth' ? 'dai' : (currency === 'dai' ? 'cny' : 'cny')) + "']"),
                        currency === 'eth' ? 0.01 : (currency === 'dai' ? 100 : 0))}}
                    </span>
          <a class='link' @click="goRecharge">{{$t("public.recharge")}}</a>
        </div>
        <div class="credit-low-tip" v-if="!balanceFlag && +adType === 1">
          <span class='red'>{{$t("ad.ad_credit_low_tip").format($t("public['" + currency + "']"), currency === 'eth' ? 0.01 : 100)}}</span>
          <a class='link' @click="goRecharge">{{$t("public.recharge")}}</a>
        </div>
      </div>
      <div class="form-item" v-if="currency !== 'ck'">
        <header class='form-item-header'>
          <div class="form-item-header-title">{{$t("ad.ad_type_select")}}:</div>
          <div class="form-item-header-title-tip">{{$t("ad.ad_type_select_tip")}}</div>
        </header>
        <div class='form-item-radio-group'>
          <RadioGroup v-model="adType" @input='onChangeAdType'>
            <Radio :label="0" :disabled="isUpdate">
              {{$t("public.buy")}}
            </Radio>
            <Radio :label="1" :disabled="isUpdate">
              {{$t("public.sell")}}
            </Radio>
          </RadioGroup>
        </div>
      </div>
      <Form v-show="+adType === 0" class="form" ref="form_buy" :model="form_buy"
            @checkValidate='checkValidate' :rules="rules">
        <FormItem prop="payment" class="form-item" v-if="currency === 'dai'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t("ad.ad_payment_select")}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_payment_select_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <Select class="input paymentInput" :placeholder='$t("public.select")' v-model="form_buy.payment">
                <Option v-for="item in paymentList" :value="item" :key="item">
                  {{$t("public['" + item + "']")}}
                </Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <!--货币-->
        <FormItem prop="money" class="form-item" v-if="currency === 'dai'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t("ad.ad_money_select")}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_money_select_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <Select class="input" v-model="form_buy.money" :placeholder='$t("public.select")'>
                <Option v-for="item in moneyList" :value="item" :key="item">
                  {{$t("public['" + item + "']")}}&nbsp;&nbsp;{{$t("public['" + item + "_text']")}}
                </Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <!--数字猫相关-->
        <FormItem prop="ck" class="form-item" v-if="currency === 'ck'">

        </FormItem>
        <!-- 溢价 -->
        <FormItem prop="premium" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t("ad.ad_premium")}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_premium_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <div class="premiumInput">
                <i-input class="input" v-model="form_buy.premium" type="text"
                         :placeholder="$t('ad.ad_premium_required')" @on-change="changePremium">
                  <span slot="append">{{$t("public.percentSign")}}</span>
                </i-input>
              </div>

            </i-col>
            <i-col span='10'>
              <div class='premium-example'>
                <span class='premium-example-desc'>{{$t("ad.ad_reference_price")}}:</span>
                <span
                    class='premium-example-number'>{{$fixDeciamlAuto(tradePrice, moneyText)}}&nbsp;&nbsp;{{moneyText}}</span>
              </div>
            </i-col>
          </Row>
        </FormItem>
        <!--价格-->
        <FormItem prop="buyPrice" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t("ad.ad_buy_price")}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_buy_price_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.buyPrice" type="text"
                       :placeholder="$t('ad.ad_buy_price_required')" @on-change="changePrice">
                <span slot="append">{{moneyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="maxPrice" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_max_price')}}({{$t("public.optional")}}):</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_max_price_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.maxPrice" type="text"
                       :placeholder="$t('ad.ad_max_price_required')">
                <span slot="append">{{moneyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="floor" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_floor')}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_floor_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.floor" type="text" @on-change="changeFloor"
                       :placeholder="$t('ad.ad_floor_required')">
                <span slot="append">{{moneyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="ceiling" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_ceiling')}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_ceiling_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.ceiling" type="text" @on-change="changeCeiling"
                       :placeholder="$t('ad.ad_ceiling_required')">
                <span slot="append">{{moneyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="remark" class="form-item">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_remark')}}:</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.remark" :placeholder="$t('ad.ad_remark_tip')"
                       type="textarea" :autosize="{minRows: 5}">
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem class="formItem submit">
          <Row>
            <i-col span='10'>
              <i-button type='primary' long :loading='submitLoading' :disabled='!validate'
                        @click="submit">
                {{isUpdate ? $t('ad.ad_update') : $t('ad.ad_advertise')}}
              </i-button>
            </i-col>
          </Row>
        </FormItem>
      </Form>
      <Form v-show="+adType === 1" class="form" ref="form_sell" :model="form_sell" @checkValidate='checkValidate'
            :rules="rules">
        <!--广告类型-->
        <FormItem prop="collection" class="form-item" v-if="currency === 'dai'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t("ad.ad_collection_select")}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_collection_select_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <Select class="input paymentInput" v-model="form_sell.collection" v-if="collection_default">
                <Option :value="collection_default.id" :key="collection_default.id">
                  {{$t("user.default")}}:{{collection_default.kind === "alipay" ?
                  $t("public.alipay") :
                  collection_default.bank}}({{collection_default.account}})
                </Option>
                <Option v-for="item in paymentList" :value="item" :key="item">
                  {{$t("public['" + item + "']")}}
                </Option>
              </Select>
              <Select class="input paymentInput" v-model="form_sell.collection" v-else>
                <Option v-for="item in paymentList" :value="item" :key="item">
                  {{$t("public['" + item + "']")}}
                </Option>
              </Select>
            </i-col>
            <i-col span='10'>
              <div class="add-payment" v-if="!collection_default">
                <div class="addPayment" v-if="!collection_default">
                  <i-button class="primary" @click="$goRouter('/user/userCenter/payment')">
                    {{$t("user.default_receivables_add")}}
                  </i-button>
                </div>
              </div>
            </i-col>
          </Row>
        </FormItem>
        <!--货币-->
        <FormItem prop="money" class="form-item" v-if="currency === 'dai'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t("ad.ad_money_select")}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_money_select_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <Select class="input" v-model="form_sell.money">
                <Option v-for="item in moneyList" :value="item" :key="item">
                  {{$t("public['" + item + "']")}}&nbsp;&nbsp;{{$t("public['" + item + "_text']")}}
                </Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <!--数字猫相关-->
        <FormItem prop="ck" class="form-item" v-if="currency === 'ck'">

        </FormItem>
        <!-- 溢价 -->
        <FormItem prop="premium" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t("ad.ad_premium")}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_premium_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <div class="premiumInput">
                <i-input class="input" v-model="form_sell.premium" type="text"
                         :placeholder="$t('ad.ad_premium_required')" @on-change="changePremium">
                  <span slot="append">{{$t("public.percentSign")}}</span>
                </i-input>
              </div>

            </i-col>
            <i-col span='10'>
              <div class='premium-example'>
                <span class='premium-example-desc'>{{$t("ad.ad_reference_price")}}:</span>
                <span
                    class='premium-example-number'>{{$fixDeciamlAuto(tradePrice, moneyText)}}&nbsp;&nbsp;{{moneyText}}</span>
              </div>
            </i-col>
          </Row>
        </FormItem>
        <!--价格-->
        <FormItem prop="sellPrice" class="form-item">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t("ad.ad_sell_price")}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_sell_price_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.sellPrice" type="text"
                       :placeholder="$t('ad.ad_sell_price_required')" @on-change="changePrice">
                <span slot="append">{{moneyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="minPrice" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_min_price')}}({{$t("public.optional")}}):</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_min_price_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.minPrice" type="text"
                       :placeholder="$t('ad.ad_min_price_required')">
                <span slot="append">{{moneyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="floor" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_floor')}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_floor_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.floor" type="text" @on-change="changeFloor"
                       :placeholder="$t('ad.ad_floor_required')">
                <span slot="append">{{moneyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="ceiling" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_ceiling')}}:</div>
            <div class="form-item-header-title-tip">{{$t("ad.ad_ceiling_tip")}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.ceiling" type="text" @on-change="changeCeiling"
                       :placeholder="$t('ad.ad_ceiling_required')">
                <span slot="append">{{moneyText}}</span>
              </i-input>
            </i-col>
            <i-col span='3' offset="1">
              <i-button type='primary' long @click="sellAll">
                {{$t("ad.ad_ceiling_sell_all")}}
              </i-button>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="remark" class="form-item">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_remark')}}:</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.remark" :placeholder="$t('ad.ad_remark_tip')"
                       type="textarea" :autosize="{minRows: 5}">
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem class="formItem submit">
          <Row>
            <i-col span='10'>
              <i-button type='primary' long :loading='submitLoading' :disabled='!validate'
                        @click="submit">
                {{isUpdate ? $t('ad.ad_update') : $t('ad.ad_advertise')}}
              </i-button>
            </i-col>
          </Row>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script type="es6">
  import ValidateMixin from "@/components/mixins/validate-mixin";
  import { VALI_AD_REMARK } from 'config/validator'
  import config from "@/config/config";

  export default {
    mixins: [ValidateMixin("form", "form")],
    data() {
      const validateNumberCheck = (rule, value, callback) => {
        if (!+value || +value <= 0) {
          callback(new Error(this.$t("public.input_number_required")));
        } else {
          callback();
        }
      };
      const validateNumberLimitCheck = (rule, value, callback) => {
        if (+value < 50) {
          callback(new Error(this.$t("ad.ad_min_number_required")));
        } else {
          callback();
        }
      };
      const validatePercentCheck = (rule, value, callback) => {
        if (isNaN(+value)) {
          callback(new Error(this.$t("public.input_number")));
        } else if (-99.99 > +value || +value > 99.99) {
          callback(new Error(this.$t("ad.ad_premium_notValid")));
        } else {
          callback();
        }
      };
      const validateCeilingCheck = (rule, value, callback) => {
        if (+this.form.floor && +value < +this.form.floor) {
          callback(new Error(this.$t("ad.ad_ceiling_number_notValid")));
        } else {
          callback();
        }
      };
      const validatePriceCheck = (rule, value, callback) => {
        if (!+value && +value < 0) {
          callback(new Error(this.$t("public.input_number")));
        } else {
          callback();
        }
      };
      const validateMaxPriceCheck = (rule, value, callback) => {
        if (!+value && +value < 0) {
          callback(new Error(this.$t("public.input_number")));
        }
        if (+value > 9999999999) {
          callback(new Error(this.$t("ad.ad_max_price_limit")));
        } else {
          callback();
        }
      };
      return {
        submitLoading: false,
        opList: ["buy", "sell"],
        formFlag: true,
        adType: this.$route.query.adType || 0,
        form_buy: {
          payment: "",
          collection: "",
          money: "cny",
          premium: "",
          buyPrice: "",
          sellPrice: "",
          maxPrice: "",
          minPrice: "",
          floor: "",
          ceiling: "",
          remark: ""
        },
        form_sell: {
          payment: "",
          collection: "",
          money: "cny",
          premium: "",
          buyPrice: "",
          sellPrice: "",
          maxPrice: "",
          minPrice: "",
          floor: "",
          ceiling: "",
          remark: ""
        },
        rules: {
          adType: [
            {
              required: true,
              message: this.$t("ad.ad_type_select_required")
            }
          ],
          payment: [
            {
              required: true,
              message: this.$t("ad.ad_payment_select_required")
            }
          ],
          collection: [
            {
              required: true,
              message: this.$t("ad.ad_collection_select_required")
            }
          ],
          money: [
            {
              required: true,
              message: this.$t("ad.ad_money_select_required")
            }
          ],
          premium: [
            {
              required: true,
              message: this.$t("ad.ad_premium_required")
            },
            {
              validator: validatePercentCheck
            }
          ],
          buyPrice: [
            {
              required: true,
              message: this.$t("ad.ad_buy_price_required")
            },
            {
              validator: validateNumberCheck
            }
          ],
          sellPrice: [
            {
              required: true,
              message: this.$t("ad.ad_sell_price_required")
            },
            {
              validator: validateNumberCheck
            }
          ],
          maxPrice: [
            {
              validator: validatePriceCheck
            }
          ],
          minPrice: [
            {
              validator: validatePriceCheck
            }
          ],
          floor: [
            {
              required: true,
              message: this.$t("ad.ad_floor_required")
            },
            {
              validator: validateNumberCheck
            },
            {
              validator: validateNumberLimitCheck
            }
          ],
          ceiling: [
            {
              required: true,
              message: this.$t("ad.ad_ceiling_required")
            },
            {
              validator: validateCeilingCheck
            },
            {
              validator: validateMaxPriceCheck
            }
          ],
          remark: [
            {
              min: VALI_AD_REMARK.min,
              message: VALI_AD_REMARK.message
            },
            {
              max: VALI_AD_REMARK.max,
              message: VALI_AD_REMARK.message
            }
          ]
        },
        collection_default: {
          id: ""
        },
        tradePrice: 0,
        moneyList: [],
        ad: {},
        examineAdFlagList: [true, true],
        timer: 0
      };
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo;
      },
      currency() {
        return this.$route.query.currency || this.$store.state.currencyList[0];
      },
      currencyList() {
        return this.$store.state.currencyList;
      },
      moneyText() {
        return this.$t("public['" + this.form.money + "']");
      },
      collection() {
        return this.$store.state.collection;
      },
      collection_refresh() {
        return this.$store.state.collection_refresh;
      },
      paymentList() {
        return this.$store.state.paymentList;
      },
      balanceObj() {
        let obj = {};
        for (let i = 0; i < this.userInfo.valid_account.length; i++) {
          obj["" + this.userInfo.valid_account[i].currency] = this.userInfo.valid_account[i].balance;
        }
        return obj;
      },
      balanceFlag() {
        if (+this.adType !== 1) {
          if (this.currency === "dai") {
            return true;
          } else if (this.currency === "eth") {
            return +this.balanceObj["dai"] >= 100;
          }
        } else {
          if (this.currency === "dai") {
            return +this.balanceObj["dai"] >= 100;
          } else if (this.currency === "eth") {
            return +this.balanceObj["eth"] >= 0.01;
          }
        }
      },
      isUpdate() {
        return !!(this.$route.query.update || 0);
      },
      adId() {
        return this.$route.query.adId;
      },
      form() {
        return +this.adType === 0 ? this.form_buy : this.form_sell;
      }
    },
    watch: {
      $route: function (val) {
        this.init();
      }
    },
    methods: {
      onChangeAdType(index) {
        this.adType = index;
      },
      getPayCollections() {
        this.$store
          .dispatch("ajax_pay_collections")
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.collection_default = res.data.default;
              if (res.data.default) {
                this.form_buy.collection = res.data.default.id;
                this.form_sell.collection = res.data.default.id;
              }
            } else {
              // this.$Message.error(this.$t("user.receivables_request_fail"));
            }
          })
          .catch(err => {
            // this.$Message.error(this.$t("user.receivables_request_fail"));
          });
      },
      getCurrencyCode() {
        return new Promise(resolve => {
          this.$store
            .dispatch("ajax_currency_code")
            .then(res => {
              if (res.data && +res.data.error === 0) {
                this.moneyList = res.data.payable;
                this.form_buy.money = this.currency === "eth" ? "dai" : "cny";
                this.form_sell.money = this.currency === "eth" ? "dai" : "cny";
                resolve()
              } else {
                // this.$Message.error(this.$t("ad.ad_money_request_fail"));
              }
            })
            .catch(err => {
              // this.$Message.error(this.$t("ad.ad_money_request_fail"));
            });
        });
      },
      getTradePrice() {
        this.$store
          .dispatch("ajax_trade_price", {
            symbol: this.currency
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.tradePrice = res.data.price;
              if (!this.isUpdate) {
                const moneyText = this.ad.target_currency;
                this.form_buy.buyPrice = this.$fixDeciamlAuto(
                  +this.tradePrice,
                  this.moneyText
                );
                this.form_sell.sellPrice = this.$fixDeciamlAuto(
                  +this.tradePrice,
                  this.moneyText
                );
              }
            } else {
              // this.$Message.error(this.$t("ad.ad_reference_price_request_fail"));
            }
          })
          .catch(err => {
            // this.$Message.error(this.$t("ad.ad_reference_price_request_fail"));
          });
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(this.getTradePrice, 1000 * 60 * 10);
      },
      goRecharge() {
        let index = 0;
        for (let i = 0; i < this.currencyList.length; i++) {
          if (this.currencyList[i] === this.currency) {
            index = i;
            break;
          }
        }
        this.$goRouter("/asset", {
          currency: this.currency
        });
      },
      changePremium() {
        if (+this.adType === 0) {
          this.$nextTick(() => {
            this.form.buyPrice = this.$fixDeciamlAuto(
              this.tradePrice * (1 + +this.form.premium / 100),
              this.moneyText
            );
          });
        } else if (+this.adType === 1) {
          this.$nextTick(() => {
            this.form.sellPrice = this.$fixDeciamlAuto(
              +this.tradePrice * (1 + +this.form.premium / 100),
              this.moneyText
            );
          });
        }
      },
      changePrice() {
        if (+this.adType === 0) {
          this.$nextTick(() => {
            this.form.premium = (
              (+this.form.buyPrice / this.tradePrice - 1) *
              100
            ).toFixed(3);
          });
        } else if (+this.adType === 1) {
          this.$nextTick(() => {
            this.form.premium = (
              (+this.form.sellPrice / this.tradePrice - 1) *
              100
            ).toFixed(3);
          });
        }
      },
      changeFloor() {
        let tempBalance =
          +this.balanceObj[this.currency] *
          this.tradePrice *
          (1 - +config.poundage);
        if (this.currency === `dai` && +this.adType !== 1) {
        } else if (+this.form.floor > tempBalance) {
          this.$nextTick(() => {
            this.form.floor = this.$fixDeciamlAuto(tempBalance, this.moneyText);
          });
        }
      },
      changeCeiling() {
        let tempBalance =
          +this.balanceObj[this.currency] *
          this.tradePrice *
          (1 - +config.poundage);
        if (this.currency === `dai` && +this.adType !== 1) {
        } else if (+this.form.ceiling > tempBalance) {
          this.$nextTick(() => {
            this.form.ceiling = this.$fixDeciamlAuto(tempBalance, this.moneyText);
          });
        }
      },
      sellAll() {
        this.$nextTick(() => {
          this.form.ceiling = this.$fixDeciamlAuto(
            this.balanceObj[this.currency] * this.tradePrice * (1 - +config.poundage),
            this.moneyText
          );
        });
      },
      submit() {
        if (!this.userInfo.activated) {
          this.$store.commit("showAuthEmail_setter", 1);
        } else if (!this.examineAdFlagList[+this.adType]) {
          this.$Message.error(this.$t("ad.ad_publish_repeat"));
        } else if (!this.balanceFlag) {
          this.$Message.error(this.$t("ad.ad_credit_low"));
        } else {
          const form_ref =
            +this.adType === 0 ? this.$refs["form_buy"] : this.$refs["form_sell"];
          form_ref.validate(valid => {
            if (valid) {
              this.submitLoading = true;
              if (this.isUpdate) {
                const requestData = {
                  id: this.adId,
                  max: this.form.ceiling,
                  min: this.form.floor,
                  price:
                    +this.adType === 0 ? this.form.maxPrice : this.form.minPrice,
                  margin: this.form.premium,
                  pay_kind:
                    +this.adType === 0 ? this.form.payment : this.form.collection,
                  pay_default:
                    this.collection_default &&
                    this.collection_default.id === this.form.collection
                      ? 1
                      : 0,
                  remark: this.form.remark
                };
                this.$store
                  .dispatch("ajax_update_ad", requestData)
                  .then(res => {
                    this.submitLoading = false;
                    if (res.data && +res.data.error === 0) {
                      this.$Message.success(this.$t("ad.ad_update_success"));
                      this.$goRouter("myAd", {
                        status: 1
                      });
                    } else {
                      this.$Message.error(this.$t("ad.ad_update_fail"));
                    }
                  })
                  .catch(err => {
                    this.submitLoading = false;
                    this.$Message.error(this.$t("ad.ad_update_fail"));
                  });
              } else {
                const requestData = {
                  op_type: this.opList[this.adType],
                  currency: this.currency,
                  target_currency: this.form.money,
                  max: this.form.ceiling,
                  min: this.form.floor,
                  price:
                    +this.adType === 0 ? this.form.maxPrice : this.form.minPrice,
                  margin: this.form.premium,
                  pay_kind:
                    +this.adType === 0 ? this.form.payment : this.form.collection,
                  //nft_id: "",
                  pay_default:
                    this.collection_default &&
                    this.collection_default.id === this.form.collection
                      ? 1
                      : 0,
                  remark: this.form.remark
                };
                this.$store
                  .dispatch("ajax_add_ad", requestData)
                  .then(res => {
                    this.submitLoading = false;
                    if (res.data && +res.data.error === 0) {
                      this.$Message.success(this.$t("ad.ad_advertise_success"));
                      this.$goRouter("myAd");
                    } else {
                      this.$Message.error(this.$t("ad.ad_advertise_fail"));
                    }
                  })
                  .catch(err => {
                    this.submitLoading = false;
                    if (err.error === "100034") {
                      this.$Message.error(this.$t("ad.ad_advertise_fail"));
                    } else {
                      this.$Message.error(this.$t("ad.ad_advertise_fail"));
                    }
                  });
              }
            } else {
              this.$Message.error(this.$t("ad.ad_advertise_info_notValid"));
            }
          });
        }
      },
      getAdById(adId) {
        this.$store
          .dispatch("ajax_get_ad", {
            id: adId
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.ad = res.data.info;
              for (let i = 0; i < this.opList.length; i++) {
                if (this.opList[i] === this.ad.op_type) {
                  this.adType = i;
                  break;
                }
              }
              this.form.money = this.ad.target_currency;
              this.form.premium = +(this.ad.margin || 0);
              this.form.floor = +(this.ad.min_limit || 0);
              this.form.ceiling = +(this.ad.max_limit || 0);
              this.form.remark = this.ad.remark;
              if (+this.adType === 0) {
                this.form.payment = this.ad.pay_kind;
                if(this.ad.price) {
                  this.form.maxPrice = this.$fixDeciamlAuto(
                    +this.ad.price,
                    this.moneyText
                  );
                }
                this.form.buyPrice = this.$fixDeciamlAuto(
                  +this.ad.current_price,
                  this.moneyText
                );
              } else if (+this.adType === 1) {
                this.form.collection = this.ad.pay_kind;
                if(this.ad.price) {
                  this.form.minPrice = this.$fixDeciamlAuto(
                    +this.ad.price,
                    this.moneyText
                  );
                }
                this.form.sellPrice = this.$fixDeciamlAuto(
                  +this.ad.current_price,
                  this.moneyText
                );
              }
            } else {
              // this.$Message.error(this.$t("ad.ad_data_request_fail"));
            }
          })
          .catch(err => {
            // this.$Message.error(this.$t("ad.ad_data_request_fail"));
          });
      },
      examineAd() {
        for (let i = 0; i < this.opList.length; i++) {
          this.$store
            .dispatch("ajax_exam_ad", {
              op_type: this.opList[i],
              currency: this.currency,
              target_currency: this.form.money
            })
            .then(res => {
              if (res.data && +res.data.error === 0) {
                this.examineAdFlagList[i] = true;
              } else {
              }
            })
            .catch(err => {
              if (+err.error === 100036) {
                this.examineAdFlagList[i] = false;
              }
            });
        }
      },
      init() {
        let index = -1;
        for (let i = 0; i < this.currencyList.length; i++) {
          if (this.currencyList[i] === this.currency) {
            index = i;
            break;
          }
        }

        this.getPayCollections();
        this.getCurrencyCode()
          .then(() => {
            this.getTradePrice();
          });
        if (this.isUpdate && this.adId) {
          this.getAdById(this.adId);
        }
        // else if (+index === -1) {
        //   this.$Message.error(this.$t("public.currency_notFound"));
        //   this.$goRouter(
        //     this.$route.fullPath.replace(this.currency, this.currencyList[0])
        //   );
        // }
        else {
          this.$store.commit("header_index_setter", "3" + index);
          this.examineAd();
        }
        if (!this.userInfo.activated) {
          this.$store.commit("showAuthEmail_setter", 1);
        }
      }
    },
    mounted() {
      this.init();
    },
    destroyed() {
      this.timer && clearTimeout(this.timer);
    }
  };
</script>
<style lang='scss' scoped>
  .red {
    color: red;
  }

  .link {
  }

  .g-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .ad {
    background-color: #fff;
    margin: 30px 0 40px;
    padding: 33px 51px 58px 49px;
    &-title {
      font-size: 26px;
      line-height: 37px;
      margin-bottom: 10px;
    }
    .title-tip {
      font-size: 14px;
      line-height: 26px;
      margin-bottom: 20px;
    }
    .credit-low-tip {
      margin-bottom: 20px;
    }
  }

  .form-item {
    margin-bottom: 30px;
    &-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      &-title {
        font-size: 16px;
        margin-right: 10px;
      }
      &-title-tip {
        font-size: 14px;
        color: #999999;
      }
    }
    .form-item-radio-group {
      padding-top: 20px;
      padding-bottom: 26px;
      border-top: 1px solid #eee;
    }
  }

  .premium-example {
    margin-left: 24px;
    &-desc {
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      margin-right: 5px;
    }
    &-number {
      font-size: 14px;
      color: red;
    }
  }

  .add-payment {
    margin-left: 24px;
  }
</style>