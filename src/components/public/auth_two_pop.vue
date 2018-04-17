<template>
  <div>
    <logoDiv/>
    <div>
      <div class="g-tabs" v-if="validate_phone && validate_google">
        <div class='g-tabs-bar' @click="changeValidate(0)" :class="{'g-tabs-bar-active': +validateIndex === 0}">
          <span class='g-tabs-bar-text' v-text="$t('user.auth_phone')"></span>
        </div>
        <div class='g-tabs-bar' @click="changeValidate(1)" :class="{'g-tabs-bar-active': +validateIndex === 1}">
          <span class='g-tabs-bar-text' v-text="$t('user.auth_google')"></span>
        </div>
      </div>
      <div class='content'>
        <div class="title" v-if="validate_phone && !validate_google" v-text="$t('user.auth_phone')"></div>
        <div class="title" v-if="validate_google && !validate_phone" v-text="$t('user.auth_google')"></div>
        <div v-show="validate_phone && +validateIndex === 0">
          <div class="tip" v-text="tipText"></div>
          <Form class="form" ref="phoneForm" :model="phoneForm" :rules="phoneRules">
            <FormItem prop="pinCode" class="formItem">
              <div class='g-send-group'>
                <i-input class="inputPinCodePhone" type="text" v-model="phoneForm.pinCode"
                         :placeholder="$t('user.pinCode_required')" @on-enter="phoneSubmit">
                                    <span slot="prepend">
                                        <img src="../../static/images/icon/IdentifyingCode-CCCCCC.svg">
                                    </span>
                </i-input>
                <sendCodeButton ref="sendCodeButton" @sendCode="sendPinCode"/>
              </div>
            </FormItem>
            <!--防止自动提交表单-->
            <input type="text" style="display:none"/>
            <FormItem class="formItem submit">
              <div class='g-comfirm-group'>
                <i-button class="submitButton" type="primary" :loading='phoneLoading' @click="phoneSubmit">
                  {{$t('public.confirm')}}
                </i-button>
                <i-button class="cancelButton" @click="cancel">
                  {{$t('public.cancel')}}
                </i-button>
              </div>
            </FormItem>
          </Form>

        </div>
        <div v-show="validate_google && +validateIndex === 1">
          <div class="tip" v-text="$t('user.auth_google_code_required')"></div>
          <Form class="form" ref="googleForm" :model="googleForm" :rules="googleRules">
            <FormItem prop="pinCode" class="formItem">
              <i-input class="inputPinCode" type="text" v-model="googleForm.pinCode"
                       :placeholder="$t('user.pinCode_required')" @on-enter="googleSubmit">
                                <span slot="prepend">
                                    <img src="../../static/images/icon/IdentifyingCode-CCCCCC.svg">
                                </span>
              </i-input>
            </FormItem>
            <!--防止自动提交表单-->
            <input type="text" style="display:none"/>
            <FormItem class="formItem submit">
              <div class='g-comfirm-group'>
                <i-button class="submitButton" type="primary" :loading='googleLoading' @click="googleSubmit">
                  {{$t('public.confirm')}}
                </i-button>
                <i-button class="cancelButton" @click="cancel">
                  {{$t('public.cancel')}}
                </i-button>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>

    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script type="es6">
  import {VALI_NUMBER_CALLBACK} from 'config/validator'
  import logoDiv from "../public/logo.vue"
  import sendCodeButton from "../public/sendCode.vue"

  export default {
    props: {
      need_auth: true
    },
    data() {
      return {
        phoneLoading: false,
        googleLoading: false,
        phoneForm: {
          pinCode: ''
        },
        googleForm: {
          pinCode: ''
        },
        validateIndex: this.validate_phone ? 0 : 1,
        phoneRules: {
          pinCode: [
            {
              required: true,
              message: this.$t("user.auth_phone_code_required")
            },
            {
              validator: VALI_NUMBER_CALLBACK
            }
          ],
        },
        googleRules: {
          pinCode: [
            {
              required: true,
              message: this.$t("user.auth_google_code_required")
            },
            {
              validator: VALI_NUMBER_CALLBACK
            }
          ],
        },
      };
    },
    computed: {
      validate_phone() {
        this.validateIndex = this.$store.state.userInfo.mobile ? 0 : 1;
        return this.$store.state.userInfo.mobile;
      },
      validate_google() {
        return this.$store.state.userInfo.app_two_factor;
      },
      tipText() {
        return this.$t('user.auth_phone_code_will_send').format(this.$store.state.userInfo.phone_number || "");
      },
      loginInfo() {
        return this.$store.state.loginInfo;
      }
    },
    methods: {
      changeValidate(index) {
        this.validateIndex = index;
      },
      phoneSubmit() {
        this.$refs["phoneForm"].validate((valid) => {
          if (valid) {
            if (this.need_auth === false) {
              this.$emit("close", {
                op: "sms",
                code: this.phoneForm.pinCode,
              });
            } else {
              this.phoneLoading = true;
              this.$store.dispatch("ajax_verify_code", {
                op: "sms",
                code: this.phoneForm.pinCode,
              }).then(res => {
                this.phoneLoading = false;
                if (res.data && +res.data.error === 0) {
                  this.$emit("close", {
                    op: "sms",
                    code: this.phoneForm.pinCode,
                  });
                } else {
                  this.$alert.error({
                    title: this.$t("public.error_title_default"),
                    content: this.$t("user.auth_phone_fail")
                  });
                  this.$refs.sendCodeButton.refresh();
                }
              }).catch(err => {
                this.phoneLoading = false;
                // this.$Message.error(this.$t("user.auth_phone_fail"));
                this.$refs.sendCodeButton.refresh();
              });
            }

          } else {
            this.$alert.error({
              title: this.$t("public.error_title_default"),
              content: this.$t("user.auth_phone_notValid")
            });
          }
        });
      },
      googleSubmit() {
        this.$refs["googleForm"].validate((valid) => {
          if (valid) {
            if (this.need_auth === false) {
              this.$emit("close", {
                op: "app",
                code: this.googleForm.pinCode,
              });
            } else {
              this.googleLoading = true;
              this.$store.dispatch("ajax_verify_code", {
                op: "app",
                code: this.googleForm.pinCode,
              }).then(res => {
                this.googleLoading = false;
                if (res.data && +res.data.error === 0) {
                  this.$emit("close", {
                    op: "app",
                    code: this.googleForm.pinCode,
                  });
                } else {
                  this.$alert.error({
                    title: this.$t("public.error_title_default"),
                    content: this.$t("user.auth_google_fail")
                  })
                }
              }).catch(err => {
                this.googleLoading = false;
                // this.$Message.error(this.$t("user.auth_google_fail"));
              });
            }
          } else {
            this.$alert.error({
              title: this.$t("public.error_title_default"),
              content: this.$t("user.auth_google_notValid")
            });
          }
        });
      },
      cancel() {
        this.$emit("close", 0);
      },
      sendPinCode() {
        this.$store.dispatch("ajax_refresh", {
          refresh: 1
        });
      },
      sendGoogleCode() {
        this.$store.dispatch("ajax_google_auth", {
          refresh: 1
        });
      }
    },
    components: {
      logoDiv,
      sendCodeButton
    }
  }
</script>
<style lang='scss' scoped>
  .content {
    padding: 40px 94px 54px;
    position: relative;
    margin: 0 auto 5px auto;
    width: 480px;
    background: #FFFFFF;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
  }

  .content div {
    word-wrap: break-word;
  }

  .title {
    /* margin-left: 94px; */
    font-size: 24px;
    color: #666666;
  }

  .tip {
    /* margin-left: 94px; */
    padding-top: 10px;
    font-size: 14px;
    color: #666666;
  }

  .form {
    margin-top: 20px;
  }

  .formItem {
    /* margin-left: 94px; */
  }

  .inputPinCode {
    width: 292px;
  }

  .inputPinCodePhone {
    width: 192px;
  }

  .pinCodeDiv {
    position: relative;
    left: 295px;
    top: -145px;
    font-size: 14px;
    color: #66BBBF;
    cursor: pointer;
  }

  .submit {
    margin-top: 50px;
  }

  .submitButton {
    width: 172px;
  }

  .cancelButton {
    width: 110px;
  }
</style>
