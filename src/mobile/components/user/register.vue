<template>
  <div class='register-wrapper'>
    <div class="bg"></div>
    <div class="content">
      <div class="title" v-text="$t('public.register')"></div>
      <div class="form">
        <Form ref="form" @checkValidate='checkValidate' :model="form" :rules="rules">
          <FormItem prop="userName" class="formItem">
            <i-input class="input" type="text" v-model="form.userName"
                     @on-focus='onFocusUserName'
                     :placeholder="$t('user.userName_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/User-999999.svg">
                            </span>
            </i-input>
          </FormItem>
          <FormItem prop="email" class="formItem">
            <i-input class="input" type="text" v-model="form.email"
                     @on-focus='onFocusEmail'
                     :placeholder="$t('user.email_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Email-999999.svg">
                            </span>
            </i-input>
          </FormItem>
          <FormItem prop="password" class="formItem">
            <i-input class="input" type="password" v-model="form.password"
                     :placeholder="$t('user.password_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Lock-999999.svg">
                            </span>
            </i-input>
          </FormItem>
          <FormItem prop="rePassword" class="formItem">
            <i-input class="input" type="password" v-model="form.rePassword"
                     :placeholder="$t('user.rePassword_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Lock-999999.svg">
                            </span>
            </i-input>
          </FormItem>
          <FormItem prop="invitationCode" class="formItem">
            <i-input class="input" type="text" v-model="form.invitationCode"
                     :placeholder="$t('user.invitationCode_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/InviteCode-999999.svg">
                            </span>
            </i-input>
          </FormItem>
          <FormItem prop="checkbox" class="formItem">
            <CheckboxGroup v-model="form.checkbox">
              <Checkbox label="allow">
                {{$t('user.terms_allowed')}}
                <a @click="showTerms">{{$t('user.terms_name')}}</a>
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem class="formItem submit">
            <i-button class="submitButton" type='primary'
                      :disabled='!validate || !this.validFlag.userName || !this.validFlag.email || !captchaFlag'
                      :loading='submitLoading'
                      @click="submit('form')">
              {{$t('public.register')}}
            </i-button>
          </FormItem>
          <div class="goButton" v-text="$t('user.register_toLogin')" @click="$goRouter('/user/login')"></div>
        </Form>
        <!--<div class="passwordStrength" v-if="+passwordStrength > 0">-->
        <!--<div :class="'passwordStrength-text-' + passwordStrength">{{passwordStrengthText}}</div>-->
        <!--<div :class="'passwordStrength-color-' + passwordStrength"></div>-->
        <!--</div>-->
        <!--<div id="captcha"></div>-->
      </div>
      <div class='banner' :class="{'omt-hide': !omt_show}">
        <span class='banner-text'>{{$t('user.register_ad_info')}}</span>
        <span class='banner-arrow banner-left'>
                    <img src="../../../static/images/register/left.svg" alt="">
                </span>
        <span class="banner-arrow banner-right">
                    <img src="../../../static/images/register/right.svg" alt="">
                </span>
      </div>
    </div>
  </div>
</template>

<script type="es6">
  import {VALI_NICKNAME} from 'config/validator';
  import validateMixin from 'mobile/components/mixins/validate-mixin';
  import {gt} from '@/libs/gt';
  import {DEFAULT_LANGUAGE, OMT_SHOW} from 'config/config';

  let isValidNickName = false;
  let isValidEmail = false;

  export default {
    mixins: [validateMixin('form')],
    data () {
      const validateUserName = (rule, value, callback) => {
        if (!value || !value.length) {
          this.validFlag.userName = false;
          callback(new Error(this.$t('user.userName_required')));
        } else if (!new RegExp(`^[a-zA-Z0-9_-]{${VALI_NICKNAME.min},${VALI_NICKNAME.max}}$`).test(value)) {
          //4到16位（字母，数字，下划线，减号）
          this.validFlag.userName = false;
          callback(new Error(VALI_NICKNAME.message));
        } else {
          if (!isValidNickName) {
            this.$store.dispatch('ajax_verified_nickname', {
              nickname: value,
            }).then(res => {
              isValidNickName = true;
              if (res.data && +res.data.error === 0) {
                if (!res.data.exist) {
                  this.validFlag.userName = true;
                  callback();
                } else {
                  this.validFlag.userName = false;
                  callback(new Error(this.$t('user.userName_repeat')));
                }
              } else {
                this.validFlag.userName = false;
                callback(new Error(this.$t('user.url_request_fail')));
              }
            }).catch(err => {
              this.validFlag.userName = false;
              callback(new Error(this.$t('public.url_request_fail')));
            });
          } else {
            callback();
          }
        }
      };
      const validateEmail = (rule, value, callback) => {
        if (!value || !value.length) {
          this.validFlag.email = false;
          callback(new Error(this.$t('user.email_required')));
        } else if (
          !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
            value,
          )
        ) {
          this.validFlag.email = false;
          callback(new Error(this.$t('user.email_notValid')));
        } else {
          if (!isValidEmail) {
            this.$store
              .dispatch('ajax_verified_email', {
                email: value,
              })
              .then(res => {
                isValidEmail = true;
                if (res.data && +res.data.error === 0) {
                  if (!res.data.exist) {
                    this.validFlag.email = true;
                    callback();
                  } else {
                    this.validFlag.email = false;
                    callback(new Error(this.$t('user.email_repeat')));
                  }
                } else {
                  this.validFlag.email = false;
                  callback(new Error(this.$t('user.email_repeat')));
                }
              })
              .catch(err => {
                this.validFlag.email = false;
                callback(new Error(this.$t('public.url_request_fail')));
              });
          } else {
            callback();
          }
        }
      };
      const validatePassword = (rule, value, callback) => {
        let reg = /[^\d].*[\d]|[\d].*[^\d]/;
        this.passwordStrength = this.$checkPassword(value);
        if (!value || !value.length) {
          this.validFlag.password = false;
          callback(new Error(this.$t('user.password_required')));
        } else if (!/^.{6,200}$/.test(value) || !reg.test(value)) {
          //6位以上的密码
          this.validFlag.password = false;
          callback(new Error(this.$t('user.password_minLength')));
        } else if (this.form.rePassword && value !== this.form.rePassword) {
          this.validFlag.password = false;
          callback(new Error(this.$t('user.password_different')));
        } else {
          this.validFlag.password = true;
          callback();
        }
      };
      const validateRePassword = (rule, value, callback) => {
        if (!value || !value.length) {
          this.validFlag.rePassword = false;
          callback(new Error(this.$t('user.rePassword_required')));
        } else if (!/^.{6,200}$/.test(value)) {
          //6位以上的密码
          this.validFlag.rePassword = false;
          callback(new Error(this.$t('user.password_minLength')));
        } else if (value !== this.form.password) {
          this.validFlag.rePassword = false;
          callback(new Error(this.$t('user.password_different')));
        } else {
          this.validFlag.rePassword = true;
          callback();
        }
      };
      const validateInvitationCode = (rule, value, callback) => {
        if (!value || !value.length) {
          this.validFlag.invitationCode = false;
          callback(new Error(this.$t('user.invitationCode_required')));
          callback();
        } else if (!/^.{1,}$/.test(value)) {
          this.validFlag.invitationCode = false;
          callback(new Error(this.$t('user.invitationCode_notValid')));
        } else {
          this.validFlag.invitationCode = true;
          callback();
        }
      };
      return {
        //   validate: false,
        submitLoading: false,
        form: {
          userName: '',
          email: '',
          password: '',
          rePassword: '',
          invitationCode: this.$route.query.invitationCode || this.$route.query.inviteCode,
          //                    invitationCode: this.$route.query.invitationCode || window.localStorage.getItem("invitationCode"),
          checkbox: [],
        },
        rules: {
          userName: [
            {
              validator: validateUserName,
              trigger: 'blur',
            },
          ],
          email: [
            {
              validator: validateEmail,
              trigger: 'blur',
            },
          ],
          password: [
            {
              validator: validatePassword,
            },
          ],
          rePassword: [
            {
              validator: validateRePassword,
            },
          ],
          invitationCode: [
            {
              // validator: validateInvitationCode
            },
          ],
          checkbox: [
            {
              required: true,
              type: 'array',
              min: 1,
              message: this.$t('user.register_checkbox_required'),
              trigger: 'change',
            },
          ],
        },
        validFlag: {
          userName: false,
          email: false,
          password: false,
          rePassword: false,
          invitationCode: true,
        },
        captchaObj: '',
        passwordStrength: 0,
        captchaFlag: false,
      };
    },
    computed: {
      omt_show () {
        return OMT_SHOW;
      },
      passwordStrengthText () {
        if (this.passwordStrength === 1) {
          return this.$t('user.password_weak');
        } else if (this.passwordStrength === 2) {
          return this.$t('user.password_middle');
        } else if (this.passwordStrength === 3) {
          return this.$t('user.password_strong');
        } else {
          return '';
        }
      },
    },
    watch: {
      $route: function (val) {
        this.init();
      },
    },
    mounted () {
      this.init();
    },
    destroyed () {
      this.$store.commit('footer_is_login_setter', false);
    },
    methods: {
      onFocusUserName () {
        isValidNickName = false;
      },
      onFocusEmail () {
        isValidEmail = false;
      },
      submit (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.captchaObj.verify();
          } else {
            this.$alert.error({
              title: this.$t('public.error_title_default'),
              content: this.$t('user.register_error'),
            });
          }
        });
      },
      showTerms () {
        this.$open('/user-agreement');
      },
      init () {
        this.$store.commit('footer_is_login_setter', true);
        this.$store.commit('header_index_setter', '5');
        this.$store.dispatch('ajax_captcha_server').then(res => {
          if (res.data && +res.data.error === 0) {
            initGeetest({
                gt: res.data.gt,
                challenge: res.data.challenge,
                offline: false,
                new_captcha: res.data.new_captcha,
                product: 'bind', // 产品形式，包括：float，popup, custom
                width: '292px',
                lang: window.localStorage.getItem('language') === 'zh-CN' ? 'zh-cn' : 'en',
              }, captchaObj => {
                captchaObj.appendTo(document.getElementById('captcha'));
                this.captchaObj = captchaObj;
                this.captchaFlag = true;
                captchaObj.onSuccess(() => {
                  let result = this.captchaObj.getValidate();
                  this.submitLoading = true;
                  this.$store.dispatch('ajax_register', {
                    email: this.form.email,
                    password: this.form.password,
                    password_confirmation: this.form.rePassword,
                    invite_code: this.form.invitationCode,
                    nickname: this.form.userName,
                    ln: this.$getLanguage(),
                    geetest_challenge: result.geetest_challenge,
                    geetest_validate: result.geetest_validate,
                    geetest_seccode: result.geetest_seccode,
                    check_captcha: 1,
                  }).then(result => {
                    this.submitLoading = false;
                    if (result.data && +result.data.error === 0) {
                      this.$Message.success(this.$t('user.register_success'));
                      this.$goRouter('/user/login');
                    } else {
                      this.$alert.error({
                        title: this.$t('public.error_title_default'),
                        content: this.$t('user.register_error'),
                      });
                    }
                  }).catch(err => {
                    this.submitLoading = false;
                    // this.$Message.error(this.$t("public.url_request_fail"));
                  });
                });
              },
            );
          } else {
            this.$alert.error({
              title: this.$t('public.error_title_default'),
              content: this.$t('user.captcha_request_fail'),
            });
          }
        })
          .catch(err => {
            // this.$Message.error(this.$t("user.captcha_request_fail"));
          });
      },
    },
    components: {
      //            pinCodeDiv
    },
  };
</script>
<style lang='scss' scoped>
  .register-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bg {
    /*background-image: url("../../../static/images/Reg-BG.jpg");*/
    /*background-size: cover;*/
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*height: 100%;*/
    /*width: 100%;*/
  }

  .content {
    position: relative;
    width: 100vw;
    background: #ffffff;
    border-radius: 1vw;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
  }

  .banner {
    position: absolute;
    width: 100vw;
    left: 0;
    top: 10vh;
    height: 5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ed343b;
  }

  .omt-hide {
    display: none;
  }

  .banner-arrow {
    position: absolute;
    width: 32px;
    height: 32px;
    top: 20px;
  }

  .banner-left {
    left: -31px;
  }

  .banner-right {
    right: -32px;
  }

  .banner-text {
    font-size: 14px;
    color: #f4f6f9;
  }

  .content div {
    word-wrap: break-word;
  }

  .logoBg {
    width: 100vm;
    height: 10vh;
    background: #f4f6f9;
  }

  .title {
    margin: 2vh 0 2vh 14vw;
    font-size: 2rem;
    color: #666666;
  }

  .form {
  }

  .formItem {
    margin-left: 14vw;
  }

  .input {
    width: 72vw;
  }

  #captcha {
    width: 72vw;
    display: inline-block;
  }

  .submitButton {
    width: 72vw;
  }

  .goButton {
    display: flex;
    justify-content: flex-end;
    font-size: 0.85rem;
    color: #66bbbf;
    letter-spacing: 0;
    cursor: pointer;
    margin-right: 14vw;
  }

  .passwordStrength {
    position: absolute;
    left: 88vw;
    top: 28.5vh;
    &-text {
      &-1 {
        float: left;
        font-family: PingFangSC-Regular sans-serif;
        font-size: 0.85rem;
        text-align: center;
        color: #ED1C24;
      }
      &-2 {
        float: left;
        font-family: PingFangSC-Regular sans-serif;
        font-size: 0.85rem;
        text-align: center;
        color: #F5A623;
      }
      &-3 {
        float: left;
        font-family: PingFangSC-Regular sans-serif;
        font-size: 0.85rem;
        text-align: center;
        color: #1BB934;
      }
    }
    &-color {
      &-1 {
        float: left;
        width: 3vw;
        height: 1vh;
        margin: 0.6vh 0 0 1vw;
        background: #ED1C24;
        border-radius: 5vw;
      }
      &-2 {
        float: left;
        width: 4.5vw;
        height: 1vh;
        margin: 0.6vh 0 0 1vw;
        background: #F5A623;
        border-radius: 5vw;
      }
      &-3 {
        float: left;
        width: 6vw;
        height: 1vh;
        margin: 0.6vh 0 0 1vw;
        background: #1BB934;
        border-radius: 5vw;
      }
    }
  }
</style>
