<template>
  <div class='wrapper'>
    <!--<logoDiv/>-->
    <div class="content">
      <div class="title" v-text="$t('public.login')"></div>
      <Form class="form" ref="form" @checkValidate='checkValidate' :model="form" :rules="rules">
        <FormItem prop="email" class="formItem">
          <i-input class="input" v-model="form.email" :placeholder="$t('user.email_required')">
                    <span slot="prepend">
                        <img src="../../../../static/images/icon/Email-999999.svg">
                    </span>
          </i-input>
        </FormItem>
        <FormItem prop="password" class="formItem">
          <i-input class="input" type="password" v-model="form.password"
                   :placeholder="$t('user.password_required')" @on-enter="submit">
                            <span slot="prepend">
                                <img src="../../../../static/images/icon/Lock-999999.svg">
                            </span>
          </i-input>
        </FormItem>
        <FormItem class="formItem submit">
          <i-button class="submitButton" type="primary" :loading='submitLoading' :disabled='!validate || !captchaFlag'
                    @click="submit">{{$t('public.login')}}
          </i-button>
        </FormItem>
        <div class="goDiv">
                <span class="goButton toForgetPassword" v-text="$t('user.password_forget')"
                      @click="$goRouter('/user/login/forget_password')"></span>
          <span class="goButton toRegister" v-text="$t('user.login_toRegister')"
                @click="$goRouter('/user/register')"></span>
        </div>
      </Form>
    </div>
    <div id="captcha"></div>
    <div style="clear: both"></div>
  </div>
</template>
<script type="es6">
  import validateMixin from 'mobile/components/mixins/validate-mixin';
  import logoDiv from '../../public/logo.vue';
  import {gt} from '@/libs/gt';
  import ajax from '@/libs/ajax';
  import {DEFAULT_LANGUAGE} from 'config/config';

  export default {
    mixins: [validateMixin('form')],
    data () {
      return {
        submitLoading: false,
        form: {
          email: '',
          password: '',
        },
        rules: {
          email: [
            {required: true, message: this.$t('user.email_required')},
            {type: 'email', message: this.$t('user.email_notValid')},
          ],
          password: [
            {
              required: true,
              message: this.$t('user.password_required'),
            },
          ],
        },
        captchaObj: '',
        captchaFlag: false,
      };
    },
    methods: {
      submit () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.captchaObj.verify();
          }
        });
      },
      init () {
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
                  this.$store.dispatch('ajax_login', {
                    email: this.form.email,
                    password: this.form.password,
                    geetest_challenge: result.geetest_challenge,
                    geetest_validate: result.geetest_validate,
                    geetest_seccode: result.geetest_seccode,
                    check_captcha: 1,
                  }).then(result => {
                    this.submitLoading = false;
                    if (result.data && +result.data.error === 0) {
                      this.$store.commit('saveToken', result.data.token);
                      ajax.all([
                        this.$store.dispatch('ajax_me'),
                        this.$store.dispatch('ajax_language', {
                          ln: this.$getLanguage(),
                        })]).then(ajax.spread((res_me, res_lan) => {
                        if (res_me.data && +res_me.data.error === 0 &&
                          res_lan.data && +res_lan.data.error === 0) {
                          this.$Message.success(this.$t('user.login_success'));
                          this.$goRouter(this.$route.query.redirect || '/user/userCenter');
                        } else {
                          this.$alert.error({
                            title: this.$t('public.error_title_default'),
                            content: this.$t('user.userInfo_response_none'),
                          });
                        }
                      })).catch(err => {
                        // this.$Message.error(this.$t("user.userInfo_response_none"));
                      });
                    } else if (result.data && +result.data.error === 100038) {
                      this.submitLoading = false;
                      if (result.data.sms || result.data.app) {
                        this.$store.commit('loginInfo_setter', {
                          mobile: result.data.mobile,
                          login_token: result.data.login_token,
                        });
                        this.$store.commit('userInfo_mobile_setter', result.data.sms);
                        this.$store.commit('userInfo_app_two_factor_setter', result.data.app);
                        if (this.$route.query.redirect) {
                          this.$goRouter('/user/login/validate', {
                            redirect: this.$route.query.redirect,
                          });
                        } else {
                          this.$goRouter('/user/login/validate');
                        }
                      } else {
                        // this.$Message.error(this.$t("user.login_error"));
                      }
                    } else if (result.data && +result.data.error === 100049) {
                      this.$alert.error({
                        title: this.$t('public.error_title_default'),
                        content: this.$t('user.user_frozen'),
                      });
                    } else {
                      this.$alert.error({
                        title: this.$t('public.error_title_default'),
                        content: this.$t('user.login_error'),
                      });
                    }
                  }).catch(err => {
                    // this.$Message.error(this.$t("user.login_error"));
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
        }).catch(err => {
          // this.$Message.error(this.$t("user.captcha_request_fail"));
        });
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
    components: {
      logoDiv,
      //            pinCodeDiv,
    },
  };
</script>
<style lang='scss' scoped>
  .wrapper {
    width: 100vw;
    background: #ffffff;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .content div {
    word-wrap: break-word;
  }

  .title {
    margin-left: 14vw;
    padding-top: 3vh;
    font-size: 2rem;
    color: #666666;
  }

  .form {
    margin-top: 20px;
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

  .goDiv {
    display: flex;
    justify-content: space-around;
  }

  .goButton {
    font-size: 1rem;
    color: #66bbbf;
    letter-spacing: 0;
    cursor: pointer;
  }

  .toForgetPassword {
    font-size: 0.85rem;
  }

  .toRegister {
    font-size: 0.85rem;
  }
</style>