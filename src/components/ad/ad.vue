<template>
  <div class="g-container">
    <div class='g-shadow ad'>
      <div class='ad-header'>
        <div class="g-title ad-title">{{$t('ad.ad_title').format($t('public[\'' + currency + '\']'))}}</div>
        <div class="title-tip" v-html='$t("ad.ad_title_tip")'></div>
        <!--相同类型广告判断-->
        <div class="credit-low-tip" v-if="!isUpdate && (+adType === 0 ? !examineAdBuyFlag : !examineAdSellFlag)">
          <span class='red'>{{$t('ad.ad_publish_repeat_tip').format( +adType === 0 ? $t('ad.ad_buying') : $t('ad.ad_selling'), $t('public[\'' + currency + '\']'))}}</span>
        </div>
        <!-- 余额判断 -->
        <div class="credit-low-tip" v-if="form_buy.targetCurrency && !balanceFlag && +adType !== 1">
                    <span class='red'>{{$t('ad.ad_credit_low_tip').format(
                        $t('public[\'' + form_buy.targetCurrency + '\']'),
                        currencyBuyLimit)}}
                    </span>
          <a class='link' @click="goRecharge">{{$t('public.recharge')}}</a>
        </div>
        <div class="credit-low-tip" v-if="form_sell.targetCurrency && !balanceFlag && +adType === 1">
          <span class='red'>{{$t('ad.ad_credit_low_tip').format(
                        $t('public[\'' + currency + '\']'), currencySellLimit)}}
          </span>
          <a class='link' @click="goRecharge">{{$t('public.recharge')}}</a>
        </div>
      </div>
      <div class="form-item" v-if="currency !== 'ck'">
        <header class='form-item-header'>
          <div class="form-item-header-title">{{$t('ad.ad_type_select')}}:</div>
          <div class="form-item-header-title-tip">{{$t('ad.ad_type_select_tip')}}</div>
        </header>
        <div class='form-item-radio-group'>
          <RadioGroup v-model="adType" @input='onChangeAdType'>
            <Radio :label="0" :disabled="isUpdate">
              {{$t('public.buy')}}
            </Radio>
            <Radio :label="1" :disabled="isUpdate">
              {{$t('public.sell')}}
            </Radio>
          </RadioGroup>
        </div>
      </div>
      <Form v-show="+adType === 0 && form_buy.targetCurrency" class="form" ref="form_buy" :model="form_buy"
            @checkValidate='checkValidate' :rules="rules">
        <FormItem prop="payment" class="form-item" v-if="currency === 'dai'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_payment_select')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_payment_select_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <Select class="input paymentInput" :placeholder='$t("public.select")' v-model="form_buy.payment">
                <Option v-for="item in paymentList" :value="item" :key="item">
                  {{$t('public[\'' + item + '\']')}}
                </Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <!--当面交易的地址-->
        <FormItem prop="address" class="form-item" v-if="isShowLocal">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_address_input')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_address_input_tip')}}</div>
          </header>
          <Row>
            <div class="selectDiv">
              <Select ref="addressBuy"
                      v-model="form_buy.address"
                      filterable remote clearable
                      @on-change="changeRemote"
                      :remote-method="addressRemoteBuy"
                      :loading="form_buy.addressLoading"
                      :loading-text="$t('ad.ad_address_input_loading')"
                      :not-found-text="$t('ad.ad_address_input_notFound')"
                      :placeholder="$t('ad.ad_address_input_required')">
                <Option v-for="(item, index) in form_buy.addressList" :key="index"
                        :value="item.id" :label="item.name">
                  <span>{{item.name}}</span>
                  <span style="float:right;color:#ccc">{{item.country_name}}</span>
                </Option>
              </Select>
            </div>
          </Row>
        </FormItem>
        <!--货币-->
        <FormItem prop="targetCurrency" class="form-item" v-if="currency === 'dai'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_money_select')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_money_select_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <Select class="input" v-model="form_buy.targetCurrency" :placeholder='$t("public.select")'
                      @on-change="changeTargetCurrency" :disabled="isUpdate" v-if="+adType === 0">
                <Option v-for="item in targetCurrencyList" :value="item" :key="item">
                  {{$t('public[\'' + item + '\']')}}&nbsp;&nbsp;{{$t('public[\'' + item + '_text\']')}}
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
            <div class="form-item-header-title">{{$t('ad.ad_premium')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_premium_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <div class="premiumInput">
                <i-input class="input" v-model="form_buy.premium" type="text"
                         :placeholder="$t('ad.ad_premium_required')" @on-change="changePremium">
                  <span slot="append">{{$t('public.percentSign')}}</span>
                </i-input>
              </div>

            </i-col>
            <i-col span='10'>
              <div class='premium-example'>
                <span class='premium-example-desc'>{{$t('ad.ad_reference_price')}}:</span>
                <span
                    class='premium-example-number'>{{$fixDecimalAuto(tradePrice, targetCurrency)}}&nbsp;&nbsp;{{targetCurrencyText}}</span>
              </div>
            </i-col>
          </Row>
        </FormItem>
        <!--价格-->
        <FormItem prop="buyPrice" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_buy_price')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_buy_price_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.buyPrice" type="text"
                       :placeholder="$t('ad.ad_buy_price_required')" @on-change="changePrice">
                <span slot="append">{{targetCurrencyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="maxPrice" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_max_price')}}({{$t('public.optional')}}):</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_max_price_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.maxPrice" type="text"
                       :placeholder="$t('ad.ad_max_price_required')">
                <span slot="append">{{targetCurrencyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="floor" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_floor')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_floor_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.floor" type="text" @on-change="changeFloor"
                       :placeholder="$t('ad.ad_floor_required')">
                <span slot="append">{{targetCurrencyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="ceiling" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_ceiling')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_ceiling_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_buy.ceiling" type="text" @on-change="changeCeiling"
                       :placeholder="$t('ad.ad_ceiling_required')">
                <span slot="append">{{targetCurrencyText}}</span>
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
              <i-button type='primary' long
                        :loading='submitLoading'
                        :disabled='disabledStatus'
                        @click="submit">
                {{isUpdate ? $t('ad.ad_update') : $t('ad.ad_advertise')}}
              </i-button>
            </i-col>
          </Row>
        </FormItem>
      </Form>
      <Form v-show="+adType === 1 && form_sell.targetCurrency" class="form" ref="form_sell" :model="form_sell"
            @checkValidate='checkValidate'
            :rules="rules">
        <!--广告类型-->
        <FormItem prop="collection" class="form-item" v-if="currency === 'dai'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_collection_select')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_collection_select_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <Select class="input paymentInput" v-model="form_sell.collection" v-if="collection_default">
                <Option :value="collection_default.id" :key="collection_default.id">
                  {{$t('user.default')}}:{{collection_default.kind === 'alipay' ?
                  $t('public.alipay') :
                  collection_default.bank}}({{collection_default.account}})
                </Option>
                <Option v-for="item in paymentList" :value="item" :key="item">
                  {{$t('public[\'' + item + '\']')}}
                </Option>
              </Select>
              <Select class="input paymentInput" v-model="form_sell.collection" v-else>
                <Option v-for="item in paymentList" :value="item" :key="item">
                  {{$t('public[\'' + item + '\']')}}
                </Option>
              </Select>
            </i-col>
            <i-col span='10'>
              <div class="add-payment" v-if="!collection_default">
                <div class="addPayment" v-if="!collection_default">
                  <i-button class="primary" @click="$goRouter('/user/userCenter/payment')">
                    {{$t('user.default_receivables_add')}}
                  </i-button>
                </div>
              </div>
            </i-col>
          </Row>
        </FormItem>
        <!--当面交易的地址-->
        <FormItem prop="address" class="form-item" v-if="isShowLocal">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_address_input')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_address_input_tip')}}</div>
          </header>
          <Row>
            <div class="selectDiv">
              <Select ref="addressSell"
                      v-model="form_sell.address"
                      filterable remote clearable
                      @on-change="changeRemote"
                      :remote-method="addressRemoteSell"
                      :loading="form_sell.addressLoading"
                      :loading-text="$t('ad.ad_address_input_loading')"
                      :not-found-text="$t('ad.ad_address_input_notFound')"
                      :placeholder="$t('ad.ad_address_input_required')">
                <Option v-for="(item, index) in form_sell.addressList" :key="index"
                        :value="item.id" :label="item.name">
                  <span>{{item.name}}</span>
                  <span style="float:right;color:#ccc">{{item.country_name}}</span>
                </Option>
              </Select>
            </div>
          </Row>
        </FormItem>
        <!--货币-->
        <FormItem prop="targetCurrency" class="form-item" v-if="currency === 'dai'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_money_select')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_money_select_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <Select class="input" v-model="form_sell.targetCurrency" @on-change="changeTargetCurrency"
                      :disabled="isUpdate" v-if="+adType === 1">
                <Option v-for="item in targetCurrencyList" :value="item" :key="item">
                  {{$t('public[\'' + item + '\']')}}&nbsp;&nbsp;{{$t('public[\'' + item + '_text\']')}}
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
            <div class="form-item-header-title">{{$t('ad.ad_premium')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_premium_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <div class="premiumInput">
                <i-input class="input" v-model="form_sell.premium" type="text"
                         :placeholder="$t('ad.ad_premium_required')" @on-change="changePremium">
                  <span slot="append">{{$t('public.percentSign')}}</span>
                </i-input>
              </div>

            </i-col>
            <i-col span='10'>
              <div class='premium-example'>
                <span class='premium-example-desc'>{{$t('ad.ad_reference_price')}}:</span>
                <span
                    class='premium-example-number'>{{$fixDecimalAuto(tradePrice, targetCurrency)}}&nbsp;&nbsp;{{targetCurrencyText}}</span>
              </div>
            </i-col>
          </Row>
        </FormItem>
        <!--价格-->
        <FormItem prop="sellPrice" class="form-item">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_sell_price')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_sell_price_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.sellPrice" type="text"
                       :placeholder="$t('ad.ad_sell_price_required')" @on-change="changePrice">
                <span slot="append">{{targetCurrencyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="minPrice" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_min_price')}}({{$t('public.optional')}}):</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_min_price_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.minPrice" type="text"
                       :placeholder="$t('ad.ad_min_price_required')">
                <span slot="append">{{targetCurrencyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="floor" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_floor')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_floor_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.floor" type="text" @on-change="changeFloor"
                       :placeholder="$t('ad.ad_floor_required')">
                <span slot="append">{{targetCurrencyText}}</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="ceiling" class="form-item" v-if="currency !== 'ck'">
          <header class='form-item-header'>
            <div class="form-item-header-title">{{$t('ad.ad_ceiling')}}:</div>
            <div class="form-item-header-title-tip">{{$t('ad.ad_ceiling_tip')}}</div>
          </header>
          <Row>
            <i-col span='10'>
              <i-input class="input" v-model="form_sell.ceiling" type="text" @on-change="changeCeiling"
                       :placeholder="$t('ad.ad_ceiling_required')">
                <span slot="append">{{targetCurrencyText}}</span>
              </i-input>
            </i-col>
            <!--<i-col span='3' offset="1">-->
            <!--<i-button type='primary' long @click="sellAll">-->
            <!--{{$t("ad.ad_ceiling_sell_all")}}-->
            <!--</i-button>-->
            <!--</i-col>-->
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
              <i-button type='primary'
                        long
                        :loading='submitLoading'
                        :disabled='disabledStatus'
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
  import ValidateMixin from '@/components/mixins/validate-mixin';
  import {VALI_AD_REMARK, VALI_NUMBER_CALLBACK} from 'config/validator';
  import {CONF_DIGITAL_CURRENCY_LIST, CONF_PAYMENT_LIST} from 'config/config';

  export default {
    mixins: [ValidateMixin('form', 'form')],
    data () {
      const validateNumberCheck = (rule, value, callback) => {
        if (!+value || +value <= 0) {
          callback(new Error(this.$t('public.input_number_required')));
        } else {
          callback();
        }
      };
      const validateNumberLimitCheck = (rule, value, callback) => {
        if (+value < 50) {
          callback(new Error(this.$t('ad.ad_min_number_required')));
        } else {
          callback();
        }
      };
      const validatePercentCheck = (rule, value, callback) => {
        if (isNaN(+value)) {
          callback(new Error(this.$t('public.input_number')));
        } else if (-99.99 > +value || +value > 99.99) {
          callback(new Error(this.$t('ad.ad_premium_notValid')));
        } else {
          callback();
        }
      };
      const validateCeilingCheck = (rule, value, callback) => {
        if (+this.form.floor && +value < +this.form.floor) {
          callback(new Error(this.$t('ad.ad_ceiling_number_notValid')));
        } else {
          callback();
        }
      };
      const validatePriceCheck = (rule, value, callback) => {
        if (!+value && +value < 0) {
          callback(new Error(this.$t('public.input_number')));
        } else {
          callback();
        }
      };
      const validateMaxPriceCheck = (rule, value, callback) => {
        if (!+value && +value < 0) {
          callback(new Error(this.$t('public.input_number')));
        }
        if (+value > 9999999999) {
          callback(new Error(this.$t('ad.ad_max_price_limit')));
        } else {
          callback();
        }
      };
      const validateRemark = (rule, value, callback) => {
        if (this.form.payment === 'local' && !value) {
          callback(new Error(this.$t('ad.ad_local_trading_tip')));
        } else {
          callback();
        }
      };
      return {
        submitLoading: false,
        opList: ['buy', 'sell'],
        formFlag: true,
        adType: this.$route.query.adType || 0,
        form_buy: {
          address: undefined,
          payment: '',
          collection: '',
          targetCurrency: '',
          premium: '',
          buyPrice: '',
          sellPrice: '',
          maxPrice: '',
          minPrice: '',
          floor: '',
          ceiling: '',
          remark: '',
          addressList: [],
          addressLoading: false,
          city: {
            id: 0,
            name: '',
            country_name: '',
          },
        },
        form_sell: {
          address: undefined,
          payment: '',
          collection: '',
          targetCurrency: '',
          premium: '',
          buyPrice: '',
          sellPrice: '',
          maxPrice: '',
          minPrice: '',
          floor: '',
          ceiling: '',
          remark: '',
          addressList: [],
          addressLoading: false,
          city: {
            id: 0,
            name: '',
            country_name: '',
          },
        },
        rules: {
          adType: [
            {
              required: true,
              message: this.$t('ad.ad_type_select_required'),
            },
          ],
          payment: [
            {
              required: true,
              message: this.$t('ad.ad_payment_select_required'),
            },
          ],
          collection: [
            {
              required: true,
              message: this.$t('ad.ad_collection_select_required'),
            },
          ],
          targetCurrency: [
            {
              required: true,
              message: this.$t('ad.ad_money_select_required'),
            },
          ],
          premium: [
            {
              required: true,
              message: this.$t('ad.ad_premium_required'),
            },
            {
              validator: validatePercentCheck,
            },
            {
              validator: VALI_NUMBER_CALLBACK,
            },
          ],
          buyPrice: [
            {
              required: true,
              message: this.$t('ad.ad_buy_price_required'),
            },
            {
              validator: validateNumberCheck,
            },
          ],
          sellPrice: [
            {
              required: true,
              message: this.$t('ad.ad_sell_price_required'),
            },
            {
              validator: validateNumberCheck,
            },
            {
              validator: VALI_NUMBER_CALLBACK,
            },
          ],
          maxPrice: [
            {
              validator: validatePriceCheck,
            },
            {
              validator: VALI_NUMBER_CALLBACK,
            },
          ],
          minPrice: [
            {
              validator: validatePriceCheck,
            },
            {
              validator: VALI_NUMBER_CALLBACK,
            },
          ],
          floor: [
            {
              required: true,
              message: this.$t('ad.ad_floor_required'),
            },
            {
              validator: validateNumberCheck,
            },
            {
              validator: validateNumberLimitCheck,
            },
          ],
          ceiling: [
            {
              required: true,
              message: this.$t('ad.ad_ceiling_required'),
            },
            {
              validator: validateCeilingCheck,
            },
            {
              validator: validateMaxPriceCheck,
            },
            {
              validator: VALI_NUMBER_CALLBACK,
            },
          ],
          remark: [
            {
              validator: validateRemark,
            },
            {
              min: VALI_AD_REMARK.min,
              message: VALI_AD_REMARK.message,
            },
            {
              max: VALI_AD_REMARK.max,
              message: VALI_AD_REMARK.message,
            },
          ],
        },
        collection_default: {
          id: '',
        },
        tradePriceObj: {},
        ad: {},
        examineAdBuyFlag: true,
        examineAdSellFlag: true,
        timer: 0,
      };
    },
    computed: {
      isShowLocal () {
        if (+this.adType === 0) {
          return ('' + this.form_buy.payment === 'local') && (this.currency === 'dai');
        } else if (+this.adType === 1) {
          return ('' + this.form_sell.collection === 'local') && (this.currency === 'dai');
        }
      },
      disabledStatus () {
        if (!this.isUpdate) {
          return !this.validate || (+this.adType === 0 ? !this.examineAdBuyFlag : !this.examineAdSellFlag) || !this.balanceFlag;
        } else {
          return !this.validate || !this.balanceFlag;
        }
      },
      userInfo () {
        return this.$store.state.userInfo;
      },
      targetCurrencyList () {
        return this.$store.state.code.payable;
      },
      currency () {
        return this.$route.query.currency || CONF_DIGITAL_CURRENCY_LIST[0].currency;
      },
      currencyList () {
        return this.$store.state.code.sellable;
      },
      targetCurrency: {
        set (val) {
          this.form_buy.targetCurrency = val;
          this.form_sell.targetCurrency = val;
        },
        get () {
          return this.form.targetCurrency;
        },
      },
      targetCurrencyText () {
        return this.$t('public[\'' + this.targetCurrency + '\']');
      },
      tradePrice () {
        return this.targetCurrency ? +(this.tradePriceObj[this.targetCurrency] || 0) : 0;
      },
      currencyBuyLimit () {
        for (let i = 0; i < CONF_DIGITAL_CURRENCY_LIST.length; i++) {
          if (CONF_DIGITAL_CURRENCY_LIST[i].currency === this.currency) {
            return CONF_DIGITAL_CURRENCY_LIST[i].buyLimit;
          }
        }
      },
      currencySellLimit () {
        for (let i = 0; i < CONF_DIGITAL_CURRENCY_LIST.length; i++) {
          if (CONF_DIGITAL_CURRENCY_LIST[i].currency === this.currency) {
            return CONF_DIGITAL_CURRENCY_LIST[i].sellLimit;
          }
        }
      },
      collection () {
        return this.$store.state.collection;
      },
      collection_refresh () {
        return this.$store.state.collection_refresh;
      },
      paymentList () {
        return CONF_PAYMENT_LIST;
      },
      balanceObj () {
        let obj = {};
        for (let i = 0; i < this.userInfo.valid_account.length; i++) {
          obj['' + this.userInfo.valid_account[i].currency] = +this.userInfo.valid_account[i].balance;
        }
        return obj;
      },
      balanceFlag () {
        if (this.adType !== 1) {
          if (this.balanceObj[this.targetCurrency] || this.balanceObj[this.targetCurrency] === 0) {
            return +this.balanceObj[this.targetCurrency] >= this.currencyBuyLimit;
          } else {
            return true;
          }
        } else {
          return this.balanceObj[this.currency] >= this.currencySellLimit;
        }
      },
      isUpdate () {
        return !!(this.$route.query.update || 0);
      },
      adId () {
        return this.$route.query.adId;
      },
      form () {
        return +this.adType === 0 ? this.form_buy : this.form_sell;
      },
    },
    watch: {
      $route: function (val) {
        this.init();
      },
    },
    methods: {
      onChangeAdType (index) {
        this.adType = index;
        this.examineAd();
      },
      getPayCollections () {
        this.$store.dispatch('ajax_pay_collections').then(res => {
          if (res.data && +res.data.error === 0) {
            this.collection_default = res.data.default;
            if (res.data.default) {
              this.form_buy.collection = res.data.default.id;
              this.form_sell.collection = res.data.default.id;
            }
          } else {
            // this.$Message.error(this.$t("user.receivables_request_fail"));
          }
        }).catch(err => {

        });
      },
      initTargetCurrency () {
        for (let i = 0; i < CONF_DIGITAL_CURRENCY_LIST.length; i++) {
          if (CONF_DIGITAL_CURRENCY_LIST[i].currency === this.currency) {
            this.targetCurrency = CONF_DIGITAL_CURRENCY_LIST[i].targetCurrency;
            return;
          }
        }
      },
      getTradePrice () {
        this.$store.dispatch('ajax_trade_price', {
          symbol: this.currency,
          target: this.targetCurrency,
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$set(this.tradePriceObj, this.targetCurrency, res.data.price);
            if (!this.isUpdate) {
              this.form_buy.buyPrice = this.$fixDecimalAuto(
                this.$multipliedBy(
                  this.$plus(
                    this.$dividedBy(+this.form.premium || 0, 100), 1),
                  this.tradePrice),
                this.targetCurrency,
              );
              this.form_sell.sellPrice = this.$fixDecimalAuto(
                this.$multipliedBy(
                  this.$plus(
                    this.$dividedBy(+this.form.premium || 0, 100), 1),
                  this.tradePrice),
                this.targetCurrency,
              );
            }
          } else {
            // this.$Message.error(this.$t("ad.ad_reference_price_request_fail"));
          }
        }).catch(err => {
        });
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(this.getTradePrice, 1000 * 60 * 10);
      },
      goRecharge () {
        this.$goRouter('/asset', {
          currency: this.currency,
        });
      },
      changePremium () {
        if (+this.adType === 0) {
          this.$nextTick(() => {
            this.form.buyPrice = this.$fixDecimalAuto(
              this.$multipliedBy(
                this.$plus(
                  this.$dividedBy(+this.form.premium || 0, 100), 1),
                this.tradePrice),
              this.targetCurrency,
            );
          });
        } else if (+this.adType === 1) {
          this.$nextTick(() => {
            this.form.sellPrice = this.$fixDecimalAuto(
              this.$multipliedBy(
                this.$plus(
                  this.$dividedBy(+this.form.premium || 0, 100), 1),
                this.tradePrice),
              this.targetCurrency,
            );
          });
        }
      },
      changePrice () {
        if (+this.adType === 0) {
          this.$nextTick(() => {
            this.form.premium = (
              this.$multipliedBy(
                this.$minus(
                  this.$dividedBy(
                    +this.form.buyPrice,
                    this.tradePrice,
                  ), 1), 100)
            ).toFixed(3);
          });
        } else if (+this.adType === 1) {
          this.$nextTick(() => {
            this.form.premium = (
              this.$multipliedBy(
                this.$minus(
                  this.$dividedBy(
                    +this.form.sellPrice,
                    this.tradePrice,
                  ), 1), 100)
            ).toFixed(3);
          });
        }
      },
      changeFloor () {
        // let tempBalance = this.$multipliedBy(+this.balanceObj[this.currency], this.tradePrice);
        // if (this.currency === `dai` && +this.adType !== 1) {
        // } else if (+this.form.floor > tempBalance) {
        //   this.$nextTick(() => {
        //     this.form.floor = this.$fixDecimalAuto(tempBalance, this.targetCurrency);
        //   });
        // }
      },
      changeCeiling () {
        // let tempBalance = this.$multipliedBy(+this.balanceObj[this.currency], this.tradePrice);
        // if (this.currency === `dai` && +this.adType !== 1) {
        // } else if (+this.form.ceiling > tempBalance) {
        //   this.$nextTick(() => {
        //     this.form.ceiling = this.$fixDecimalAuto(tempBalance, this.targetCurrency);
        //   });
        // }
      },
      changeTargetCurrency (val) {
        this.targetCurrency = val;
        this.getTradePrice();
        if (!this.isUpdate) {
          this.examineAd();
        }
      },
      // sellAll() {
      //   this.$nextTick(() => {
      //     this.form.ceiling = this.$fixDecimalAuto(
      //       this.$multipliedBy(this.balanceObj[this.currency], this.tradePrice),
      //       this.targetCurrency
      //     );
      //   });
      // },
      changeRemote (remoteId) {
        if (remoteId) {
          if (+this.adType === 0 && this.form_buy.addressList.length) {
            let item = {};
            for(let i = 0; i < this.form_buy.addressList.length; i++) {
              if (this.form_buy.addressList[i].id === remoteId) {
                item = this.form_buy.addressList[i];
                return;
              }
            }
            this.form_buy.targetCurrency = item.currency;
            this.form_buy.city = {
              id: item.id,
              name: item.name,
              country_name: item.country_name,
            };
          } else if (+this.adType === 1 && this.form_sell.addressList.length) {
            let item = {};
            for(let i = 0; i < this.form_sell.addressList.length; i++) {
              if (this.form_sell.addressList[i].id === remoteId) {
                item = this.form_sell.addressList[i];
                return;
              }
            }
            this.form_sell.targetCurrency = item.currency;
            this.form_sell.city = {
              id: item.id,
              name: item.name,
              country_name: item.country_name,
            };
          }
        }
      },
      addressRemoteBuy (query) {
        this.addressRemote(query, 0);
      },
      addressRemoteSell (query) {
        this.addressRemote(query, 1);
      },
      addressRemote (query, type) {
        query = query + '';
        if (query && query.trim()) {
          type === 0 ? this.form_buy.addressLoading = true : this.form_sell.addressLoading = true;
          this.$store.dispatch('ajax_search', {
            keyword: query.trim().replace(/\(.*\)/g, ''),
          }).then(res => {
            type === 0 ? this.form_buy.addressLoading = false : this.form_sell.addressLoading = false;
            if (res.data && res.data.error === 0) {
              if (res.data.data && res.data.data.length) {
                if (+type === 0) {
                  this.form_buy.addressList = res.data.data;
                } else if (+type === 1) {
                  this.form_sell.addressList = res.data.data;
                }
              } else {
                type === 0 ? this.form_buy.addressList = [] : this.form_sell.addressList = [];
              }
            } else {
              type === 0 ? this.form_buy.addressList = [] : this.form_sell.addressList = [];
            }
          }).catch(() => {
            type === 0 ? this.form_buy.addressList = [] : this.form_sell.addressList = [];
          });
        } else {
          type === 0 ? this.form_buy.addressList = [] : this.form_sell.addressList = [];
        }
      },
      submit () {
        let tempFlag = false;
        if (!this.userInfo.activated) {
          this.$store.commit('showAuthEmail_setter', 1);
        } else if (!this.isUpdate) {
          if (+this.adType === 0 && !this.examineAdBuyFlag) {
            this.$alert.error({
              title: this.$t('public.error_title_default'),
              content: this.$t('ad.ad_publish_repeat'),
            });
          } else if (+this.adType === 1 && !this.examineAdSellFlag) {
            this.$alert.error({
              title: this.$t('public.error_title_default'),
              content: this.$t('ad.ad_publish_repeat'),
            });
          } else {
            tempFlag = true;
          }
        } else if (!this.balanceFlag) {
          this.$alert.error({
            title: this.$t('public.error_title_default'),
            content: this.$t('ad.ad_credit_low'),
          });
        } else {
          tempFlag = true;
        }
        if (tempFlag) {
          const form_ref = +this.adType === 0 ? this.$refs['form_buy'] : this.$refs['form_sell'];
          form_ref.validate(valid => {
            if (valid) {
              this.submitLoading = true;
              if (this.isUpdate) {
                const requestData = {
                  id: this.adId,
                  max: this.form.ceiling,
                  min: this.form.floor,
                  price: +this.adType === 0 ? this.form.maxPrice : this.form.minPrice,
                  margin: this.form.premium,
                  pay_kind: +this.adType === 0 ? this.form.payment : this.form.collection,
                  pay_default:
                    +this.adType === 1 && this.collection_default &&
                    this.collection_default.id === this.form.collection ? 1 : 0,
                  remark: this.form.remark,
                  city: this.form.city.id,
                };
                this.$store.dispatch('ajax_update_ad', requestData).then(res => {
                  this.submitLoading = false;
                  if (res.data && +res.data.error === 0) {
                    this.$Message.success(this.$t('ad.ad_update_success'));
                    this.$goRouter('myAd', {
                      status: 1,
                    });
                  } else {
                    this.$alert.error({
                      title: this.$t('public.error_title_default'),
                      content: this.$t('ad.ad_update_fail'),
                    });
                  }
                })
                  .catch(err => {
                    this.submitLoading = false;
                  });
              } else {
                const requestData = {
                  op_type: this.opList[this.adType],
                  currency: this.currency,
                  target_currency: this.targetCurrency,
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
                    this.collection_default.id === this.form.collection ? 1 : 0,
                  remark: this.form.remark,
                  city: this.form.city.id,
                };
                this.$store.dispatch('ajax_add_ad', requestData).then(res => {
                  this.submitLoading = false;
                  if (res.data && +res.data.error === 0) {
                    this.$Message.success(this.$t('ad.ad_advertise_success'));
                    this.$goRouter('myAd');
                  } else {
                    this.$alert.error({
                      title: this.$t('public.error_title_default'),
                      content: this.$t('ad.ad_advertise_fail'),
                    });
                  }
                }).catch(err => {
                  this.submitLoading = false;
                });
              }
            } else {
              this.$alert.error({
                title: this.$t('public.error_title_default'),
                content: this.$t('ad.ad_advertise_info_notValid'),
              });
            }
          });
        }
      },
      getAdById (adId) {
        return new Promise((resolve, reject) => {
          this.$store.dispatch('ajax_get_ad', {
            id: adId,
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.ad = res.data.info;
              for (let i = 0; i < this.opList.length; i++) {
                if (this.opList[i] === this.ad.op_type) {
                  this.adType = i;
                  break;
                }
              }
              this.targetCurrency = this.ad.target_currency;
              this.form.premium = +(this.ad.margin || 0);
              this.form.floor = +(this.ad.min_limit || 0);
              this.form.ceiling = +(this.ad.max_limit || 0);
              this.form.remark = this.ad.remark;
              this.form.city = this.ad.city;
              if (+this.adType === 0) {
                this.form.payment = this.ad.pay_kind;
                if (this.ad.price) {
                  this.form.maxPrice = this.$fixDecimalAuto(
                    +this.ad.price,
                    this.targetCurrency,
                  );
                }
                this.form.buyPrice = this.$fixDecimalAuto(
                  +this.ad.current_price,
                  this.targetCurrency,
                );
              } else if (+this.adType === 1) {
                this.form.collection = this.ad.pay_kind;
                if (this.ad.price) {
                  this.form.minPrice = this.$fixDecimalAuto(
                    +this.ad.price,
                    this.targetCurrency,
                  );
                }
                this.form.sellPrice = this.$fixDecimalAuto(
                  +this.ad.current_price,
                  this.targetCurrency,
                );
              }
            } else {
              // this.$Message.error(this.$t("ad.ad_data_request_fail"));
            }
            resolve(res);
          }).catch(err => {
            resolve(err);
          });
        });
      },
      examineAd () {
        this.$store.dispatch('ajax_exam_ad', {
          op_type: this.opList[+this.adType],
          currency: this.currency,
          target_currency: this.targetCurrency,
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            if (+this.adType === 0) {
              this.examineAdBuyFlag = true;
            } else {
              this.examineAdSellFlag = true;
            }
          } else if (+res.data.error === 100036) {
            if (+this.adType === 0) {
              this.examineAdBuyFlag = false;
            } else {
              this.examineAdSellFlag = false;
            }
          } else {
          }
        }).catch(err => {
        });
      },
      init () {
        let index = -1;
        for (let i = 0; i < this.currencyList.length; i++) {
          if (this.currencyList[i] === this.currency) {
            index = i;
            break;
          }
        }
        this.$store.commit('header_index_setter', '3' + index);
        if (!this.userInfo.activated) {
          this.$store.commit('showAuthEmail_setter', 1);
        }
        this.getPayCollections();
        if (this.isUpdate) {
          if (this.adId) {
            this.getAdById(this.adId).then(res => {
              this.getTradePrice();
              if (+this.adType === 0 && this.form_buy.payment === 'local') {
                this.$refs.addressBuy.setQuery(this.form_buy.city.name);
                this.form_buy.address = this.form_buy.city.id;
              } else if (+this.adType === 0 && this.form_buy.collection === 'local') {
                this.$refs.addressSell.setQuery(this.form_sell.city.name);
                this.form_sell.address = this.form_sell.city.id;
              }
            });
          }
        } else {
          this.initTargetCurrency();
          this.getTradePrice();
          this.examineAd();
        }
      },
    },
    mounted () {
      this.init();
    },
    destroyed () {
      this.timer && clearTimeout(this.timer);
    },
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

  .selectDiv {
    display: block;
    width: 41.66666667%;
  }

  /deep/ .ivu-select-not-found {
    color: #999999;
    text-align: left;
    padding-left: 10px;
  }

  /deep/ .ivu-select-loading {
    color: #999999;
    text-align: left;
    padding-left: 10px;
  }
</style>