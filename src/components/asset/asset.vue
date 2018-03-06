<template>
  <div class='wrapper'>
    <!-- <div class="contentBg"></div> -->
    <div class="g-container page">
      <aside class="sider">
        <div class='g-shadow sider-wrapper'>
          <div class="sider-item" :class="{'sider-item-active': currency === item}"
               v-for="(item, index) in currencyList" :key='index' @click="changeSider(index)">
            <div class="sider-item-wrapper">
              <div class="sider-item-asstes">
                <img :src="imageType[index]" class='img'>
              </div>
              <div class='sider-item-content'>
                <h3 class='sider-item-title'>{{$t("public['" + item + "']")}}</h3>
                <div v-for="(account, index2) in userInfo.valid_account" :key='index2'>
                  <p class='sider-item-desc' v-if="account.currency === currencyList[index]">
                    <!-- {{$t("public.asset")}}:  -->
                    {{account.amount|fix_decimals(8)}}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <transition name="fade" mode="out-in">
        <div class="content">
          <header class="g-shadow content-header">
            <div class="content-header-item">
              <div class="content-header-item-warpper">
                <h3 class='content-header-item-title'>{{$t("asset.asset_amount")}}</h3>
                <div class='content-header-item-content'>{{account["amount"]|fix_decimals(8) }}</div>
              </div>

            </div>
            <div class="border"></div>
            <div class="content-header-item">
              <div class="content-header-item-warpper">
                <h3 class='content-header-item-title'>{{$t("asset.asset_balance")}}</h3>
                <div class='content-header-item-content'>{{account["balance"]|fix_decimals(8)}}</div>
              </div>
            </div>
            <div class="border"></div>
            <div class="content-header-item">
              <div class="content-header-item-warpper">
                <h3 class='content-header-item-title'>{{$t("asset.asset_locked")}}</h3>
                <div class='content-header-item-content'>{{account["locked"]|fix_decimals(8)}}</div>
              </div>
            </div>
          </header>
          <!--验证邮箱-->
          <div v-if="+deposit.error === 0 || +withdraw.error === 0">
            <div class="g-shadow content-main">
              <div class="content-tabs">
                <div class="content-tabs-item echarge"
                     :class="{ 'content-tabs-item-active' : assetIndex === 0}"
                     @click="changeOperation(0)"
                >
                  <a class='link'>
                    {{$t("public.recharge")}} {{$t("public['" + this.currency + "']")}}
                  </a>
                  <div class='bottom-border'></div>
                </div>
                <div class="content-tabs-item withdraw"
                     :class="{ 'content-tabs-item-active' : +assetIndex === 1}"
                     @click="changeOperation(1)"
                >
                  <a class='link'>
                    {{$t("public.withdraw")}} {{$t("public['" + this.currency + "']")}}
                  </a>
                  <div class='bottom-border'></div>
                </div>
              </div>
              <div class='content-recharge' v-if="+assetIndex === 0">
                <div class='content-recharge-left'>
                  <div class="address">
                    <span class='address-desc'>{{$t("asset.asset_recharge_address")}}:</span>
                    <a v-if="deposit.account.length && deposit.account[0].deposit_address"
                       v-clipboard:copy="deposit.account[0].deposit_address"
                       v-clipboard:success="copySuccess" class='address-link'>
                      {{deposit.account[0].deposit_address}}
                    </a>
                    <i-button v-else type="primary" :loading='addressLoading' @click="getAddress">
                      {{$t("asset.asset_recharge_address_get")}}
                    </i-button>
                  </div>
                  <div class="tip" v-if="currency === 'dai'">
                    {{$t("asset.asset_recharge_address_tip_DAI").format($t("public['" +
                    this.currency +
                    "']"))}}
                  </div>
                  <div class="tip" v-else>
                    {{$t("asset.asset_recharge_address_tip_ETH").format($t("public['" +
                    this.currency +
                    "']"))}}
                  </div>
                </div>
                <div class='content-recharge-right'>
                  <!-- <qart class="qrCode" :config="qrCodeConfig"></qart> -->
                  <qrcode-vue
                      :value='qrCodeConfig.value'
                      :size='qrCodeConfig.size'
                  ></qrcode-vue>
                </div>
              </div>
              <div class='content-withdraw' v-else-if="+assetIndex === 1">
                <!-- 您尚未设置二次验证，无法提取ETH -->
                <!-- <div class='content-withdraw-no-verify' v-if="!userInfo.mobile && !userInfo.app_two_factor"> -->
                <div class='content-withdraw-no-verify'
                     v-if="!userInfo.mobile && !userInfo.app_two_factor">
                  <div class='text'>
                    {{$t("asset.asset_withdraw_no_auth").format($t("public['" + this.currency +
                    "']"))}}
                  </div>
                  <button class='g-shadow button'
                          @click="$goRouter('/user/userCenter/securitySetting')">
                    {{$t("asset.asset_go_set_auth")}}
                  </button>
                </div>
                <!-- 正常提取 -->
                <div class='content-withdraw-verify' v-else>
                  <div class="tip" v-if="currency === 'dai'">
                    {{$t("asset.asset_withdraw_address_tip_DAI").format($t("public['" +
                    this.currency +
                    "']"))}}
                  </div>
                  <div class="tip" v-else>
                    {{$t("asset.asset_withdraw_address_tip_ETH").format($t("public['" +
                    this.currency +
                    "']"))}}
                  </div>
                  <Form class="form" ref="form" @checkValidate='checkValidate_form' :model="form"
                        :rules="rules">
                    <FormItem prop="address" class="formItem">
                      <Row :gutter='16' class='form-item'>
                        <i-col span='3' class="left">
                          <div>{{$t("asset.asset_withdraw_address")}}:</div>
                        </i-col>
                        <i-col span='14' class="center">
                          <Select class="input" v-model="form.address"
                                  v-if="withdraw.fund_sources && withdraw.fund_sources.length"
                                  @on-change="get_address_id">
                            <!-- 2018/02/13 将:value='item.uid' 改为 :value='item.id'  因为uid有可能会重复-->
                            <Option v-for="(item, index) in withdraw.fund_sources"
                                    :value="item.id"
                                    :key="index" :disabled="item.is_locked"
                                    v-text="'(' + item.extra + ')' + item.uid">
                            </Option>
                          </Select>
                          <a @click="addressPop = true" v-else>
                            {{$t("asset.asset_withdraw_address_add")}}
                          </a>
                        </i-col>
                        <i-col span='6' class="right">
                          <a @click="addressPop = true"
                             v-if="withdraw.fund_sources && withdraw.fund_sources.length">
                            {{$t("asset.asset_withdraw_address_manage")}}
                          </a>
                        </i-col>
                      </Row>
                    </FormItem>
                    <FormItem prop="number" class="formItem">
                      <Row class='form-item'>
                        <i-col span='3' class='left'>
                          <div>{{$t("asset.asset_withdraw_number")}}:</div>
                        </i-col>
                        <i-col span='14' class='center'>
                          <i-input class="input" v-model="form.number" type="text"
                                   @on-enter="submit"
                                   :placeholder="$t('asset.asset_withdraw_number_info')">
                          </i-input>
                        </i-col>
                      </Row>
                    </FormItem>
                    <FormItem class="formItem ">
                      <Row class='form-item'>
                        <i-col span='14' offset='3'>
                          <i-button class="submit-button-type-2" long
                                    :disabled='!validate.form'
                                    type="primary" @click="submit">
                            {{$t('public.submit')}}
                          </i-button>
                        </i-col>
                      </Row>
                    </FormItem>
                  </Form>
                </div>
              </div>
            </div>
            <div class='content-history' v-if="+assetIndex === 0 && deposit.deposits_history.length">
              <table class='g-shadow content-history-table'>
                <thead class='content-history-table-head'>
                <tr class='content-history-table-head-tr'>
                  <th class='content-history-table-head-th' width='20%'>
                    {{$t("asset.asset_recharge_time")}}
                  </th>
                  <th class='content-history-table-head-th' width='20%'>{{$t("asset.asset_number")}}
                  </th>
                  <th class='content-history-table-head-th' width='38%'>
                    {{$t("asset.asset_hashcode")}}
                  </th>
                  <th class='content-history-table-head-th' width='22%'>{{$t("asset.asset_status")}}
                  </th>
                </tr>
                </thead>
                <tbody class='content-history-table-body'>
                <!-- <div > -->
                <tr class='content-history-table-body-tr'
                    v-for="(item, index) in deposit.deposits_history" :key="index">
                  <td class='content-history-table-body-td'>
                    <div class="time">
                      {{new Date(+item['updated_at'] * 1000).format("yyyy/MM/dd hh:mm:ss")}}
                    </div>
                  </td>
                  <td class='content-history-table-body-td'>
                    <div class="number">{{item.amount}}</div>
                  </td>
                  <td class='content-history-table-body-td'>
                    <div class="hash">
                      <a class='u-break-all' @click="onOpenUrl(item['blockchain_url'])">
                        {{item["txid"]}}
                      </a>
                    </div>
                  </td>
                  <td class='content-history-table-body-td'>
                    <div class="status">
                      {{$t("asset['asset_recharge_status_" + item["aasm_state"] + "']")}}
                    </div>
                  </td>
                </tr>
                <!-- </div> -->
                </tbody>
              </table>
              <Page class='m-ivu-pages' :current="deposit.page" :total="deposit.total_count"
                    :page-size="deposit.per_page"
                    @on-change="showInfo"></Page>
            </div>
            <div class='content-history'
                 v-else-if="+assetIndex === 1 && withdraw.withdraws.length && !(!userInfo.mobile && !userInfo.app_two_factor)">
              <table class='g-shadow content-history-table'>
                <thead class='content-history-table-head'>
                <tr class='content-history-table-head-tr'>
                  <th class='content-history-table-head-th' width='20%'>
                    {{$t("asset.asset_withdraw_time")}}
                  </th>
                  <th class='content-history-table-head-th' width='20%'>{{$t("asset.asset_number")}}
                  </th>
                  <th class='content-history-table-head-th' width='38%'>
                    {{$t("asset.asset_hashcode")}}
                  </th>
                  <th class='content-history-table-head-th' width='22%'>{{$t("asset.asset_status")}}
                  </th>
                </tr>
                </thead>
                <tbody class='content-history-table-body'>
                <tr class='content-history-table-body-tr' v-for="(item, index) in withdraw.withdraws"
                    :key="index">
                  <td class='content-history-table-body-td'>
                    <div class="time" v-if="item && item.updated_at">
                      {{new Date(+item['updated_at'] * 1000).format("yyyy/MM/dd hh:mm:ss")}}
                    </div>
                  </td>
                  <td class='content-history-table-body-td'>
                    <div class="number">{{item["amount"]}}</div>
                  </td>
                  <td class='content-history-table-body-td'>
                    <div class="hash">
                      <a class='u-break-all' @click="onOpenUrl(item['blockchain_url'])">
                        {{item["txid"]}}
                      </a>
                    </div>
                  </td>
                  <td class='content-history-table-body-td'>
                    <div class="status">
                      {{$t("asset['asset_withdraw_status_" + item["aasm_state"] + "']")}}
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
              <Page class='m-ivu-pages' :total="withdraw.total_count" :page-size="withdraw.per_page"
                    @on-change="showInfo"></Page>
            </div>
          </div>
          <emptyList
              v-else
              :loading="loading"
              :text="+assetIndex === 0 ? $t('public.no_asset_recharge') : $t('public.no_asset_withdraw')"
          />
          <!-- 模态框 -->
          <Modal v-model="addressPop" class-name="m-ivu-modal"
                 width='710'
                 :mask-closable="true" :closable="false">
            <logoDiv/>
            <div class="asset-model">
              <h3 class='asset-model-title'>{{$t("asset.asset_withdraw_address_manage")}}</h3>
              <div class='asset-model-content'>
                <div v-for="(item, index) in withdraw.fund_sources" :value="item.id"
                     :key="index" v-if="withdraw.fund_sources && withdraw.fund_sources.length">
                  <Row :gutter="20">
                    <i-col span="6">{{item.extra}}</i-col>
                    <i-col span="14">{{item.uid}}</i-col>
                    <i-col span="2">
                      <Checkbox v-model="item.id === default_source_id"
                                :disabled="item.id === default_source_id"
                                @on-change="setDefaultAddress(item.id)">
                      </Checkbox>
                    </i-col>
                    <i-col span="2">
                      <Poptip confirm :title="$t('public.confirm_delete')"
                              @on-ok="address_del(item.id)">
                        <img src="../../static/images/icon/Trash-666666.svg"
                             v-if="item.id == default_source_id">
                        <img src="../../static/images/icon/Trash-DDDDDD.svg" v-else>
                      </Poptip>
                    </i-col>
                  </Row>
                </div>
              </div>
              <div class='asset-model-content'>
                <Form ref="addForm" :model="addForm" @checkValidate='checkValidate_addForm'
                      :rules="addRules"
                      v-if="!withdraw.fund_sources || (withdraw.fund_sources && withdraw.fund_sources.length < 5)">
                  <Row :gutter="16">
                    <i-col span="6">
                      <FormItem prop="label" class="formItem">
                        <i-input v-model="addForm.label"
                                 :placeholder="$t('public.label')"></i-input>
                      </FormItem>
                    </i-col>
                    <i-col span="14">
                      <FormItem prop="address" class="formItem">
                        <i-input v-model="addForm.address"
                                 :placeholder="$t('asset.asset_withdraw_address')"></i-input>
                      </FormItem>
                    </i-col>
                    <i-col span="4">
                      <FormItem class="formItem">
                        <i-button type="primary" :loading='addressAddLoading' :disabled='!validate.addForm'
                                  @click="address_add">{{$t("public.add")}}
                        </i-button>
                      </FormItem>
                    </i-col>
                  </Row>
                </Form>
                <div class="submit u-flex u-flex-center-middle">
                  <i-button class='submit-button' type='primary' v-text="$t('public.confirm')"
                            @click="addressPop=false"></i-button>
                </div>
              </div>
            </div>
            <div slot="footer"></div>
          </Modal>
          <Modal v-model="withdraw_confirm" width='570' class-name="m-ivu-modal" :mask-closable="true"
                 :closable="false">
            <logoDiv/>
            <withdraw_confirm_pop :form="form" @close="doWithdrawPop"/>
            <div slot="footer"></div>
          </Modal>
          <Modal v-model="withdraw_email" width='480' class-name="m-ivu-modal" :mask-closable="true" :closable="false">
            <logoDiv/>
            <div class="asset-model-mail">
              <div class='asset-model-mail-title'>
                <p>{{$t("user.authentication_email_beenSend")}}</p>
                <p>{{userInfo.email}}</p>
              </div>
              <p class='asset-model-mail-desc'>{{$t('asset.asset_withdraw_email')}}</p>
              <a v-text="$t('user.authentication_email_reSend_link')" @click="sendEmail"
                 class='asset-model-mail-btn'></a>
              <i-button long type="primary" @click="withdraw_email=false">
                {{$t('public.confirm')}}
              </i-button>
            </div>
            <div slot="footer">{{$t("asset.asset_withdraw_email")}}</div>
          </Modal>
          <Modal v-model="auth_two_flag" width='480' class-name="m-ivu-modal" :mask-closable="true"
                 :closable="false">
            <auth_two @close="doAuthClose" :need_auth="false"/>
            <div slot="footer"></div>
          </Modal>
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="es6">
  import validateMixin from "@/components/mixins/validate-mixin";
  import emptyList from "@/components/public/empty-list";
  import QrcodeVue from "qrcode.vue";
  import logoDiv from "../public/logo.vue";
  import auth_two from "../public/auth_two_pop.vue";
  import withdraw_confirm_pop from "./withdraw_confirm_pop.vue";
  import store from "../../store/store";
  // import ethereum_address from "ethereum-address"

  export default {
    name: "",
    mixins: [validateMixin(["form", "addForm"])],
    components: {
      QrcodeVue,
      logoDiv,
      auth_two,
      withdraw_confirm_pop,
      emptyList
    },
    data() {
      const validateNumberCheck = (rule, value, callback) => {
        if (!+value || +value <= 0) {
          callback(new Error(this.$t("public.input_number_required")));
        } else if (+value > +this.account["balance"]) {
          callback(new Error(this.$t("public.balance_insufficient")));
        } else if (this.currency === "eth" && +value < 0.01) {
          callback(
            new Error(this.$t("asset.asset_withdraw_eth_number_required"))
          );
        } else if (this.currency === "dai" && +value < 100) {
          callback(
            new Error(this.$t("asset.asset_withdraw_dai_number_required"))
          );
        } else {
          callback();
        }
      };
      const validateEthAddress = (rule, value, callback) => {
        let reg = /^(0x)?[0-9a-f]{40}$/i;
        if (!reg.test(value)) {
          callback(new Error(this.$t("asset.asset_withdraw_address_invalid")));
        } else {
          callback();
        }
      };

      return {
        addressPop: false,
        loading: true,
        imageType: [
          require("../../static/images/CoinLogo-DAI.png"),
          require("../../static/images/CoinLogo-ETH .png"),
          require("../../static/images/CoinLogo-CAT.png")
        ],
        form: {
          address: "",
          number: "",
          id: ""
        },
        addForm: {
          label: "",
          address: ""
        },
        rules: {
          address: [
            {
              required: true,
              message: this.$t("asset.asset_withdraw_address_info")
            }
          ],
          number: [
            {
              required: true,
              message: this.$t("asset.asset_withdraw_number_info")
            },
            {
              validator: validateNumberCheck
            }
          ]
        },
        addRules: {
          label: [
            {
              required: true,
              message: this.$t("asset.asset_withdraw_label_required")
            }
          ],
          address: [
            {
              required: true,
              message: this.$t("asset.asset_withdraw_address_required")
            },
            {
              validator: validateEthAddress
            }
          ]
        },
        deposit: {
          account: [],
          deposit_channels: {},
          deposits_history: [],
          page: 1,
          per_page: 20,
          total_count: 0,
          total_pages: 1
        },
        withdraw: {
          default_source_id: "",
          fund_sources: [],
          withdraw_channels: {},
          withdraws: [],
          page: 1,
          per_page: 20,
          total_count: 0,
          total_pages: 1
        },
        withdraw_confirm: false,
        withdraw_email: false,
        auth_two_flag: false,
        addressLoading: false,
        addressAddLoading: false,
        assetLoading: false
      };
    },
    computed: {
      assetIndex() {
        return +(this.$route.query.type || 0);
      },
      withdraw_token() {
        return this.$route.query.withdraw_token;
      },
      currencyList() {
        return this.$store.state.currencyList;
      },
      currency() {
        return this.$route.query.currency || this.$store.state.currencyList[0];
      },
      account() {
        let index = 0;
        for (let i in this.userInfo.valid_account) {
          if (
            this.userInfo.valid_account[i] &&
            this.userInfo.valid_account[i].currency === this.currency
          ) {
            index = i;
            break;
          }
        }
        return this.userInfo.valid_account[index];
      },
      userInfo() {
        return this.$store.state.userInfo;
      },
      qrCodeConfig() {
        return {
          value: this.deposit.account.length
            ? this.deposit.account[0].deposit_address
            : "",
          imagePath: require("../../static/images/home/QC-Code-BG.png"),
          filter: "canvas",
          size: 150
        };
      },
      default_source_id() {
        return this.withdraw.default_source_id;
      }
    },
    watch: {
      $route: function (val) {
        this.init();
      }
    },
    methods: {
      onOpenUrl(url) {
        window.open(url);
      },
      getAddress() {
        this.addressLoading = true;
        this.$store
          .dispatch("ajax_gen_address", {
            currency: this.currency
          })
          .then(res => {
            this.addressLoading = false;
            if (res.data && +res.data.error === 0) {
              this.showInfo();
            } else {
              this.$Message.error(this.$t("asset.asset_address_request_fail"));
            }
          })
          .catch(err => {
            this.addressLoading = false;
            this.$Message.error(this.$t("asset.asset_address_request_fail"));
          });
      },
      showInfo(index) {
        if (this.assetIndex === 0) {
          this.$store
            .dispatch("ajax_get_deposit", {
              currency: this.currency,
              limit: this.deposit.per_page,
              page: index ? +index : this.deposit.page
            })
            .then(res => {
              if (res.data && +res.data.error === 0) {
                this.deposit = res.data;
              } else {
                this.$Message.error(this.$t("asset.asset_recharge_request_fail"));
              }
            })
            .catch(err => {
              this.$Message.error(this.$t("asset.asset_recharge_request_fail"));
            });
        } else if (+this.assetIndex === 1) {
          this.$store
            .dispatch("ajax_get_withdraw", {
              currency: this.currency,
              limit: this.withdraw.per_page,
              page: index ? index : this.withdraw.page
            })
            .then(res => {
              if (res.data && +res.data.error === 0) {
                this.withdraw = res.data;
                for (let i in this.withdraw.fund_sources) {
                  if (
                    this.withdraw.fund_sources[i].id === this.default_source_id
                  ) {
                    this.form.address = this.withdraw.fund_sources[i].uid;
                    this.get_address_id(this.withdraw.fund_sources[i].uid);
                  }
                }
              } else {
                this.$Message.error(this.$t("asset.asset_withdraw_request_fail"));
              }
            })
            .catch(err => {
              this.$Message.error(this.$t("asset.asset_withdraw_request_fail"));
            });
        }
      },
      changeSider(index) {
        this.$goRouter(this.$route.name, {
          currency: this.currencyList[+index]
        });
      },
      changeOperation(index) {
        this.$goRouter(this.$route.name, {
          currency: this.currency,
          type: index
        });
      },
      submit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.withdraw_confirm = true;
          } else {
            this.$Message.error(this.$t("asset.asset_withdraw_form_notValid"));
          }
        });
      },
      doWithdraw(authJson) {
        let fund_index = 0;
        for (let i in this.withdraw.fund_sources) {
          if (this.withdraw.fund_sources[i].id === this.form.address) {
            fund_index = i;
          }
        }
        let requestData = {
          fund_source_id: this.form.id,
          member_id: this.withdraw.fund_sources[fund_index].member_id,
          currency: this.currency,
          sum: +this.form.number
        };
        if (authJson) {
          requestData = Object.assign(authJson, requestData);
        }
        this.$store
          .dispatch("ajax_withdraw", requestData)
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.withdraw_email = true;
              //                        this.$Message.success(this.$t("asset.asset_withdraw_success"));
              this.$refs["form"].resetFields();
              this.init();
            } else {
              this.$Message.error(this.$t("asset.asset_withdraw_fail"));
              this.init();
            }
          })
          .catch(err => {
            if (err.sms || err.app) {
              this.$store.commit("loginInfo_setter", {
                mobile: err.mobile
              });
              this.auth_two_flag = true;
            } else {
              this.$Message.error(this.$t("asset.asset_withdraw_fail"));
              this.init();
            }
          });
      },
      address_add() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.addressAddLoading = true
            this.$store
              .dispatch("ajax_add_fund_sources", {
                uid: this.addForm.address,
                extra: this.addForm.label,
                currency: this.currency
              })
              .then(res => {
                this.addressAddLoading = false
                if (res.data && +res.data.error === 0) {
                  this.$Message.success(
                    this.$t("asset.asset_withdraw_address_add_success")
                  );
                  this.showInfo();
                  this.$refs["addForm"].resetFields();
                } else {
                  this.$Message.error(
                    this.$t("asset.asset_withdraw_address_add_fail")
                  );
                }
              })
              .catch(err => {
                this.addressAddLoading = false
                this.$Message.error(
                  this.$t("asset.asset_withdraw_address_add_fail")
                );
              });
          } else {
            this.$Message.error(this.$t("asset.asset_withdraw_address_notValid"));
          }
        });
      },
      setDefaultAddress(id) {
        this.$store
          .dispatch("ajax_set_default_fund_sources", {
            id: id
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.showInfo();
              this.$Message.success(
                this.$t("asset.asset_withdraw_address_set_default_success")
              );
            } else {
              this.$Message.error(
                this.$t("asset.asset_withdraw_address_set_default_fail")
              );
            }
          })
          .catch(err => {
            this.$Message.error(
              this.$t("asset.asset_withdraw_address_set_default_fail")
            );
          });
      },
      address_del(id) {
        this.$store
          .dispatch("ajax_del_fund_sources", {
            id: id
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.showInfo();
              this.$Message.success(
                this.$t("asset.asset_withdraw_address_del_success")
              );
            } else {
              this.$Message.error(
                this.$t("asset.asset_withdraw_address_del_fail")
              );
            }
          })
          .catch(err => {
            this.$Message.error(this.$t("asset.asset_withdraw_address_del_fail"));
          });
      },
      doWithdrawPop(val) {
        if (val) {
          this.auth_two_flag = true;
        }
        this.withdraw_confirm = false;
      },
      doAuthClose(val) {
        if (val) {
          this.doWithdraw(val);
        }
        this.auth_two_flag = false;
      },
      get_address_id(val) {
        for (let i in this.withdraw.fund_sources) {
          if (this.withdraw.fund_sources[i].uid === val) {
            this.form.id = this.withdraw.fund_sources[i].id;
            return false;
          }
        }
      },
      sendEmail() {
        this.$store.dispatch("ajax_resend_confirm", {
          id: this.withdraw.withdraw_channels.id
        }).then(res => {
          this.$Message.success(this.$t("asset.asset_withdraw_email_success"));
        }).catch(err => {
          this.$Message.error(this.$t("public.fail"));
        });
      },
      showAuthEmail() {
        this.$store.commit("showAuthEmail_setter", 1);
      },
      copySuccess() {
        this.$Message.success(this.$t("public.invite_copy_success"));
      },
      init() {
        this.$store.commit("header_index_setter", "8");
        this.showInfo();
      }
    },
    mounted() {
      this.init();
    },
    beforeRouteEnter(to, from, next) {
      if(from.name && from.name.indexOf("/user/login") <= -1) {
        store.dispatch("ajax_me");
      }
      next();
    },
    beforeRouteUpdate(to, from, next) {
      if(from.name && from.name.indexOf("/user/login") <= -1) {
        store.dispatch("ajax_me");
      }
      next();
    }
  };
</script>
<style lang='scss' scoped>
  @import "assets";
</style>
