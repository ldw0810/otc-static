<template>
  <div class="g-container order" v-if="order.id">
    <header class="g-shadow order-header">
      <div class='order-header-steps'>
        <div class="order-header-steps-item" v-for='(item, index) in stepList' :key='index'>
          <div class="order-header-steps-item-left">
            <img class='img' :src="item.img">
            <p class="text">
              {{item.title}}
            </p>
          </div>
          <div class='order-header-steps-item-right' v-if='index !== stepList.length - 1'>
            <img class='right-arrow' src="../../static/images/order/Deal-IconRight2.png"
                 v-if='item.status === 1'>
            <img class='right-arrow' src="../../static/images/order/Deal-IconRight.png"
                 v-if='item.status === 0'>
          </div>
        </div>

      </div>
      <div class="order-header-tip" v-html='stepTip'></div>
    </header>
    <div class="order-content">
      <div class="g-shadow order-chat">
        <chat :contact="{id: order.member.member_id, name: order.member.nickname}"
              :owner="{id: userInfo.id, name: userInfo.nickname}" :orderId="order.id" :chatList="chatList"
              :msg="chatMessage" :chatFlag="chatFlag" @refresh="getOrderInfo">
        </chat>
      </div>
      <div class="order-status">
        <div class='g-shadow info'>
          <h2 class='info-title'>{{$t("order.order_info")}}</h2>
          <section class='info-section'>
            <Row>
              <!-- 订单编号 -->
              <i-col span='8'>
                {{$t("order.order_id")}}:
              </i-col>
              <i-col span='16'>
                {{order.id}}
              </i-col>
            </Row>
            <Row>
              <!-- 订单金额-->
              <i-col span='8'>
                {{$t("order.order_money_amount")}}:
              </i-col>
              <i-col span='16'>
                {{order.price_sum}}
                {{$t("public['" + order.target_currency + "']")}}
              </i-col>
            </Row>
            <Row>
              <!-- 价格-->
              <i-col span='8'>
                {{$t("order.order_price")}}:
              </i-col>
              <i-col span='16'>
                {{order.price}}
                {{$t("public['" + order.target_currency + "']")}}
                &nbsp;/&nbsp;
                {{$t("public['" + order.currency + "']")}}
              </i-col>
            </Row>
            <Row>
              <!-- 数量-->
              <i-col span='8'>
                {{$t("order.order_number")}}:
              </i-col>
              <i-col span='16'>
                {{order.amount|fix_decimals(8)}}
                {{$t("public['" + order.currency + "']")}}
              </i-col>
            </Row>
            <Row>
              <!-- 付款方式-->
              <i-col span='8'>
                {{$t("order.order_payment")}}:
              </i-col>
              <i-col span='16'>
                {{order.pay_kind ? $t("public['" + order.pay_kind + "']") :
                $t("public.currencyExchange")}}
              </i-col>
            </Row>
          </section>
          <section class='info-section'>
            <h4 class='info-section-title'>{{$t('ad.ad_remark')}}</h4>
            <p class='info-section-desc'>
              {{order.remark}}
            </p>
          </section>
          <section class='info-section info-action'>
            <div v-if="['timeout','over', 'cancel'].contains(order.status)">
              <div class='flex'>
                <img v-if="order.status == 'over'" class='pay-status-icon'
                     src="../../static/images/order/Deal-Icon-Finish.png">
                <img v-else class='pay-status-icon' src="../../static/images/order/Deal-Icon-Close.png">
                <div v-if="order.status == 'timeout'">
                  {{$t('order.order_deal_timeout')}}
                </div>
                <div v-else-if="order.status == 'cancel'">
                  {{$t('order.order_deal_cancel')}}
                </div>
                <div v-else>
                  {{$t('order.order_deal_complete')}}
                </div>
              </div>
            </div>
            <div class='flex' v-else-if="order.status == 'fresh'">
              <div class='flex' v-if="order.op_type == 'buy'">
                <i-button class="order-buttons submitButton" type="primary" @click="orderOper('pay')">
                  {{$t('order.order_pay_complete')}}
                </i-button>
                <i-button class="order-buttons cancelButton" @click="orderOper('cancel')">
                  {{$t('order.order_pay_cancel')}}
                </i-button>
              </div>
              <div class='flex' v-else>
                <i-button class="order-buttons disableButton" type="primary" @click="orderOper('release')"
                          disabled>
                  {{$t('order.order_pay_release')}}
                </i-button>
              </div>
            </div>
            <div class='flex' v-else-if="order.status === 'pay'">
              <div class='flex' v-if="order.op_type === 'buy'">
                <i-button class="order-buttons submitButton" type="primary" @click="orderOper('pay')" disabled>
                  {{$t('order.order_pay_completed')}}
                </i-button>
                <i-button class="order-buttons cancelButton" @click="orderOper('cancel')" disabled>
                  {{$t('order.order_pay_cancel')}}
                </i-button>
              </div>
              <div class='flex' v-else>
                <i-button class="order-buttons submitButton" type="primary" @click="orderOper('release')">
                  {{$t('order.order_pay_release')}}
                </i-button>
              </div>
            </div>
            <div class='flex' v-else-if="order.status === 'release'">
              <div class='flex'>
                <RadioGroup class='radio-wrapper' v-model="evaluate">
                  <Radio label="1">
                    <span>{{$t("order.order_pay_evaluate_good")}}</span>
                  </Radio>
                  <Radio label="-1">
                    <span>{{$t("order.order_pay_evaluate_bad")}}</span>
                  </Radio>
                </RadioGroup>
                <i-button class="order-buttons submitButton" type="primary" @click="orderOper('evaluate')">
                  {{$t('order.order_eval')}}
                </i-button>
              </div>
            </div>
            <div class='flex' v-else-if="order.status == 'sell_eval'">
              <div class='flex' v-if="order.op_type == 'buy'">
                <RadioGroup class='radio-wrapper' v-model="evaluate">
                  <Radio label="1">
                    <span>{{$t("order.order_pay_evaluate_good")}}</span>
                  </Radio>
                  <Radio label="-1">
                    <span>{{$t("order.order_pay_evaluate_bad")}}</span>
                  </Radio>
                </RadioGroup>
                <i-button class="order-buttons submitButton" type="primary" @click="orderOper('evaluate')">
                  {{$t('order.order_eval')}}
                </i-button>
              </div>
              <div class='flex' v-else>
                <i-button class="order-buttons submitButton" type="primary" @click="orderOper('evaluate')" disabled>
                  {{$t('order.order_status_over')}}
                </i-button>
              </div>
            </div>
            <div class='flex' v-else-if="order.status == 'buy_eval'">
              <div class='flex' v-if="order.op_type == 'sell'">
                <RadioGroup class='radio-wrapper' v-model="evaluate">
                  <Radio label="1">
                    <span>{{$t("order.order_pay_evaluate_good")}}</span>
                  </Radio>
                  <Radio label="-1">
                    <span>{{$t("order.order_pay_evaluate_bad")}}</span>
                  </Radio>
                </RadioGroup>
                <i-button class="order-buttons submitButton" type="primary" @click="orderOper('evaluate')">
                  {{$t('order.order_eval')}}
                </i-button>
              </div>
              <div class='flex' v-else>
                <i-button class="order-buttons submitButton" type="primary" @click="orderOper('evaluate')" disabled>
                  {{$t('order.order_status_over')}}
                </i-button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <div class="order-rules">
      <h3 class='order-rules-title'>{{$t("order.order_trade_notice")}}</h3>
      <p class='order-rules-content' v-html='$t("order.order_trade_notice_content")'>
      </p>
    </div>

    <Modal v-model="confirmFlag.pay" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <logoDiv style="margin: 0"></logoDiv>
      <div class="asset-model">
        <h3 class='asset-model-title'>{{$t("order.order_confirm_pay_title")}}</h3>
        <div class='asset-model-content'>
          <div class='asset-model-content-desc'>{{$t("order.order_confirm_pay_remark_tip")}}</div>
          <div>
            <i-input class="input" type="textarea" :autosize="{minRows: 2}" v-model="confirmForm.remark"
                     :placeholder="$t('order.order_confirm_pay_remark')">
            </i-input>
          </div>
          <div class='warn'>{{$t("order.order_confirm_pay_warn")}}</div>
        </div>
        <div class='g-comfirm-group buttons-group'>
          <i-button class="submit-button" type="primary" @click="doOper('pay')">
            {{$t('order.order_confirm_payed')}}
          </i-button>
          <i-button class="cancel-button" @click="confirmFlag.pay = false">
            {{$t('public.cancel')}}
          </i-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="confirmFlag.release" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <logoDiv style="margin: 0"></logoDiv>
      <div class="asset-model">
        <h3 class='asset-model-title'>{{$t("order.order_confirm_release")}}</h3>
        <div class='asset-model-content'>
          <Row :gutter="16">
            <i-col span="7">
              {{$t("order.order_id")}}:
            </i-col>
            <i-col span="6">
              {{order.id}}
            </i-col>
          </Row>
          <Row :gutter="16">
            <i-col span="7">
              {{$t("order.order_money_amount")}}:
            </i-col>
            <i-col span="10">
              {{order.price_sum}}
              {{$t("public['" + order.target_currency + "']")}}
            </i-col>
          </Row>
        </div>
        <Form class="form" ref="confirmForm" :model="confirmForm" :rules="confirmRules">
          <FormItem prop="pinCode" class="formItem">
            <div>
              <i-input class="input" type="password" v-model="confirmForm.password"
                       :placeholder="$t('user.password_login')" @on-enter="doOper('release')">
              </i-input>
            </div>
          </FormItem>
          <!--防止自动提交表单-->
          <input type="text" style="display:none"/>
          <div class='warn'>{{$t("order.order_confirm_release_warn").format(order.price_sum,
            order.currency.toUpperCase())}}
          </div>
          <FormItem class="formItem g-comfirm-group buttons-group">
            <i-button class="submit-button" type="primary" @click="doOper('release')">
              {{$t('order.order_pay_release')}}
            </i-button>
            <i-button class="cancel-button" @click="confirmFlag.release = false">
              {{$t('public.cancel')}}
            </i-button>
          </FormItem>
        </Form>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="confirmFlag.cancel" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <logoDiv style="margin: 0"></logoDiv>
      <div class="asset-model">
        <h3 class='asset-model-title'>{{$t("order.order_cancel_order_title")}}</h3>
        <div class='asset-model-content'>
          <div class='asset-model-content-desc'>{{$t("order.order_cancel_order_tip")}}</div>
          <div class='warn'>{{$t("order.order_cancel_order_warn")}}</div>
        </div>
        <div class='g-comfirm-group buttons-group'>
          <i-button class="submit-button" type="primary" @click="doOper('cancel')">
            {{$t('order.order_pay_cancel')}}
          </i-button>
          <i-button class="cancel-button" @click="confirmFlag.cancel = false">
            {{$t('public.cancel')}}
          </i-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="confirmFlag.complete" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <logoDiv style="margin: 0"></logoDiv>
      <div class="asset-model">
        <h3 class='asset-model-title'>{{$t("order.order_complete")}}</h3>
        <div class='asset-model-content'>
          <div>
            <span v-html='$t("order.order_complete_info")'></span>
            <a @click="$goRouter('/myOrder')">order_show_order</a>
            <span v-html='$t("public.or")'></span>
            <a @click="$goRouter('/asset')">order_show_order</a>
          </div>
        </div>
        <div>
          <i-button class="submitButton" long type="primary" @click="doOper('complete')">
            {{$t('public.confirm')}}
          </i-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="auth_two_flag" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <auth_two @close="doAuthClose" :need_auth="false"></auth_two>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script type="es6">
  import logoDiv from "../public/logo.vue";
  import chat from "../public/chat.vue";
  import auth_two from "../public/auth_two_pop.vue";

  export default {
    data() {
      return {
        stepList: [],
        stepTip: "",
        order: {},
        chat: [],
        confirmFlag: {
          pay: false,
          release: false,
          cancel: false,
          complete: false
        },
        confirmForm: {
          remark: "",
          password: ""
        },
        confirmRules: {
          password: [
            {
              required: true,
              message: this.$t("user.password_required")
            }
          ]
        },
        evaluate: "0",
        cancelFlag: true,
        auth_two_flag: false,
        chatFlag: false,
        chatMessage: ""
      };
    },
    computed: {
      id() {
        return this.$route.query.id;
      },
      userInfo() {
        return this.$store.state.userInfo;
      },
      chatList() {
        let tempList = [];
        let tempTime = 0;
        if(this.chat.length) {
          for (let i = this.chat.length - 1; i >= 0; i--) {
            let timeFlag = +this.chat[i].from === 0 ? false : +this.chat[i].created_at * 1000 - tempTime > 3 * 60 * 1000;
            tempTime = timeFlag ? +this.chat[i].created_at * 1000 : tempTime;
            tempList[this.chat.length - (i + 1)] = {
              type:
                +this.chat[i].from === 0
                  ? 9 : this.chat[i].to === this.order.member.member_id ? 0 : 1,
              data: this.chat[i].msg,
              time: +this.chat[i].created_at * 1000,
              compareTime: tempTime,
              timeFlag: timeFlag,
            };
          }
        }
        return tempList;
      }
    },
    methods: {
      showStep() {
        this.stepList = [
          {
            img: require("../../static/images/order/Deal-IconShoppingCart.png"),
            title: this.$t("order.order_deal_status_pay"),
            status: 1
          }
        ];
        if (["timeout", "cancel"].contains(this.order.status)) {
          this.stepList.push({
            img: require("../../static/images/order/Deal-IconCancel.png"),
            title:
              this.order.status === "timeout"
                ? this.$t("order.order_deal_timeout")
                : this.$t("order.order_deal_cancel"),
            status: 0
          });
        } else {
          if (this.order.status === "fresh") {
            this.stepList.push({
              img: require("../../static/images/order/Deal-IconPay2.png"),
              title: this.$t("order.order_deal_status_wait_payment"),
              status: 0
            });
          } else {
            this.stepList.push({
              img: require("../../static/images/order/Deal-IconPay.png"),
              title: this.$t("order.order_deal_status_paid"),
              status: 1
            });
          }
          if (["fresh", "pay"].contains(this.order.status)) {
            this.stepList.push({
              img: require("../../static/images/order/Deal-IconDelivery2.png"),
              title: this.$t("order.order_deal_status_wait_release"),
              status: 0
            });
          } else {
            this.stepList.push({
              img: require("../../static/images/order/Deal-IconDelivery.png"),
              title: this.$t("order.order_deal_status_released"),
              status: 1
            });
          }
          if (["fresh", "pay", "release"].contains(this.order.status)) {
            this.stepList.push({
              img: require("../../static/images/order/Deal-IconEvaluate2.png"),
              title: this.$t("order.order_deal_status_wait_eval"),
              status: 0
            });
          } else {
            this.stepList.push({
              img: require("../../static/images/order/Deal-IconEvaluate.png"),
              title:
                this.order.status === "buy_eval"
                  ? this.$t("order.order_status_buy_eval")
                  : this.order.status === "sell_eval"
                  ? this.$t("order.order_status_sell_eval")
                  : this.$t("order.order_deal_complete"),
              status: 0
            });
          }
        }
      },
      getOrderInfo() {
        this.$store.dispatch("ajax_order_info", {
          id: this.id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.order = res.data.info;
            this.chat = res.data.chat;
            this.showTip();
            this.showStep();
          } else {
            this.$Message.error(this.$t("order.order_info_request_fail"));
          }
        }).catch(err => {
          this.$Message.error(this.$t("order.order_info_request_fail"));
        });
      },
      orderOper(operStr) {
        if (operStr === "pay") {
          this.confirmFlag.pay = true;
        } else if (operStr === "release") {
          this.confirmFlag.release = true;
        } else if (operStr === "evaluate") {
          if (+this.evaluate) {
            this.$store.dispatch("ajax_order_evaluate", {
              order_id: this.id,
              good: +this.evaluate
            }).then(res => {
              if (res.data && +res.data.error === 0) {
                this.$Message.success(
                  this.$t("order.order_pay_evaluate_success")
                );
                this.getOrderInfo();
              } else {
                this.$Message.error(this.$t("order.order_pay_evaluate_fail"));
              }
            }).catch(err => {
              this.$Message.error(this.$t("order.order_pay_evaluate_fail"));
            });
          } else {
            this.$Message.error(this.$t("order.order_pay_evaluate_required"));
          }
        } else if (operStr === "complete") {
          this.confirmFlag.complete = true;
        } else if (operStr === "cancel") {
          this.confirmFlag.cancel = true;
        }
      },
      doOper(operStr, authJson) {
        if (operStr === "pay") {
          this.$store.dispatch("ajax_order_pay", {
            order_id: this.id
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.confirmFlag.pay = false;
              this.chatMessage = this.confirmForm.remark;
              this.$Message.success(
                this.$t("order.order_pay_complete_success")
              );
              this.getOrderInfo();
            } else {
              this.$Message.error(this.$t("order.order_pay_complete_fail"));
            }
          }).catch(err => {
            this.$Message.error(this.$t("order.order_pay_complete_fail"));
          });
        } else if (operStr === "release") {
          let requestData = {
            order_id: this.id,
            password: this.confirmForm.password
          };
          if (authJson) {
            requestData = Object.assign(authJson, requestData);
          }
          this.$store.dispatch("ajax_order_release", requestData).then(res => {
            if (res.data && res.data.error === 0) {
              this.confirmFlag.release = false;
              this.$Message.success(this.$t("order.order_pay_release_success"));
              this.getOrderInfo();
            } else {
              this.$Message.error(this.$t("order.order_pay_release_fail"));
            }
          }).catch(err => {
            if (err.sms || err.app) {
              this.confirmFlag.release = false;
              this.$store.commit("loginInfo_setter", {
                mobile: err.mobile
              });
              this.auth_two_flag = true;
            } else {
              this.$Message.error(this.$t("order.order_pay_release_fail"));
            }
          });
        } else if (operStr === "complete") {
          this.confirmFlag = {
            pay: false,
            release: false,
            cancel: false,
            complete: false
          };
        } else if (operStr === "cancel") {
          if (this.cancelFlag) {
            this.$store.dispatch("ajax_order_cancel", {
              order_id: this.id
            }).then(res => {
              if (res.data && +res.data.error === 0) {
                this.cancelFlag = false;
                this.confirmFlag.cancel = false;
                this.$Message.success(
                  this.$t("order.order_pay_cancel_success")
                );
                this.getOrderInfo();
              } else {
                this.cancelFlag = false;
                this.$Message.error(this.$t("order.order_pay_cancel_fail"));
              }
            }).catch(err => {
              this.cancelFlag = false;
              this.$Message.error(this.$t("order.order_pay_cancel_fail"));
            });
          }
        }
      },
      showTip() {
        if (this.order.created_at && this.order.status === "fresh") {
          let time = new Date().getTime() - this.order.created_at * 1000;
          if (time) {
            if (time > 1000 * 60 * 60) {
              this.stepTip = this.$t("order.order_info_timeout");
              this.cancelFlag &&
              this.order.op_type === "buy" && this.doOper("cancel");
            } else {
              let minute = Math.floor((1000 * 60 * 60 - time) / (1000 * 60));
              let second = Math.floor(
                ((1000 * 60 * 60 - time) % (1000 * 60)) / 1000
              );
              minute = minute / 10 < 1 ? "0" + minute : minute;
              second = second / 10 < 1 ? "0" + second : second;
              this.stepTip = this.$t("order.order_info_timer").format(
                `<a>${minute}:${second}</a>`
              );
            }
          } else {
            this.stepTip = "";
          }
          setTimeout(this.showTip, 1000);
        } else {
          this.stepTip = "";
        }
      },
      doAuthClose(val) {
        if (val) {
          this.doOper("release", val);
        }
        this.auth_two_flag = false;
      },
      init() {
        this.$store.commit("header_index_setter", "-1");
        this.getOrderInfo();
      }
    },
    mounted() {
      this.init();
    },
    components: {
      logoDiv,
      chat,
      auth_two
    }
  };
</script>
<style lang='scss' scoped>
  .order {
    padding-top: 30px;
    padding-bottom: 30px;
    &-header {
      background-color: #fff;
      padding: 30px 100px 18px;
      margin-bottom: 30px;
      &-tip {
        line-height: 16px;
        font-size: 14px;
        margin-top: 18px;
        margin-left: 174px - 100px;
      }
      &-steps {
        width: 100%;
        display: flex;
        padding-bottom: 22px;
        border-bottom: 1px solid #eee;
        &-item {
          padding-left: 85px;
          display: flex;
          &:first-child {
            padding-left: 175px - 120px;
          }
          &-left {
            width: 84px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-right: 83px;
            .img {
              width: 70px;
              height: 70px;
              display: inline-block;
              margin-bottom: 12px;
            }
            .text {
              font-size: 14px;
              line-height: 16px;
              white-space: nowrap;
            }
          }
          &-right {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: -10px;
            .right-arrow {
              display: inline-block;
              width: 9px;
              height: 14px;
            }
          }
        }
      }
      &-content {
        display: flex;
      }
      &-chat {
        flex: 1;
      }
    }
    &-content {
      display: flex;
    }
    &-chat {
      flex: 1;
      margin-right: 30px;
      padding: 30px;
      background-color: #fff;
    }
    &-rules {
      width: 646px;
      margin-top: 40px;
      font-size: 16px;
      line-height: 19px;
      &-title {
        margin-bottom: 20px;
        font-weight: normal;
      }
      &-content {
        line-height: 20px;
      }
    }
  }

  .info {
    padding: 30px;
    padding-bottom: 0;
    width: 270px;
    background-color: #fff;
    &-title {
      line-height: 24px;
      font-size: 20px;
      font-weight: normal;
      margin-bottom: 10px;
    }
    &-section {
      line-height: 30px;
      font-size: 14px;
      padding-top: 10px;
      padding-bottom: 10px;
      border-top: 1px solid #eee;
      word-break: break-all;
      &-title {
        font-weight: normal;
      }
    }
    &-action {
      height: 152px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .flex {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .radio-wrapper {
        margin-bottom: 20px;
      }
      .order-buttons {
        width: 100%;
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .pay-status-icon {
        width: 36px;
        height: 36px;
        margin-bottom: 10px;
      }
    }
  }

  .asset {
    &-model {
      padding: 51px 94px 54px;
      &-title {
        font-size: 24px;
        color: #666666;
        line-height: 33px;
        font-weight: normal;
        margin-bottom: 16px;
      }
      &-content {
        font-size: 16px;
        color: #666666;
        line-height: 28px;
        margin-bottom: 28px;
        &-desc {
          font-size: 16px;
          color: #666666;
          line-height: 22px;
          margin-bottom: 17px;
        }
      }
      .input {
        margin-bottom: 20px;
      }
      .warn {
        margin-bottom: 30px;
        line-height: 22px;
        font-size: 16px;
        color: #ED1C24;
      }
      .buttons-group {
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
      .submit-button {
        width: 182px;
      }
      .cancel-button {
        width: 100px;
      }
      &-warn {
        font-size: 16px;
        color: #ED1C24;
        line-height: 20px;
        margin-bottom: 37px;
      }
    }
  }
</style>
