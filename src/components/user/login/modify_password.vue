<template>
  <div>
    <logoDiv></logoDiv>
    <div class="content">
      <div class="title" v-text="$t('user.modify_password')"></div>
      <Form class="form" ref="form" @checkValidate='checkValidate' :model="form" :rules="rules">
        <FormItem prop="password" class="formItem">
          <i-input class="input" type="password" v-model="form.password"
                   :placeholder="$t('user.password_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Lock-CCCCCC.svg">
                            </span>
          </i-input>
        </FormItem>
        <FormItem prop="rePassword" class="formItem">
          <i-input class="input" type="password" v-model="form.rePassword"
                   :placeholder="$t('user.rePassword_required')" @on-enter="submit">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Lock-CCCCCC.svg">
                            </span>
          </i-input>
        </FormItem>
        <FormItem class="formItem submit">
          <i-button class="submitButton" type="primary" :disabled='!validate' :loading='loading' @click="submit">
            {{$t('public.complete')}}
          </i-button>
        </FormItem>
      </Form>
    </div>
    <div class="passwordStrength" v-if="+passwordStrength > 0">
      <div :class="'passwordStrength-text-' + passwordStrength">{{passwordStrengthText}}</div>
      <div :class="'passwordStrength-color-' + passwordStrength"></div>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script type="es6">
  import validateMixin from '@/components/mixins/validate-mixin'
  import logoDiv from "../../public/logo.vue"

  export default {
    mixins: [validateMixin('form')],
    data() {
      const validatePassword = (rule, value, callback) => {
        let reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
        this.passwordStrength = this.$checkPassword(value);
        if (!value || !value.length) {
          callback(new Error(this.$t("user.password_required")));
        } else if (!/^.{6,200}$/.test(value) || !reg.test(value)) {
          //6位以上的密码
          callback(new Error(this.$t("user.password_minLength")));
        } else if (this.form.rePassword && value !== this.form.rePassword) {
          callback(new Error(this.$t("user.password_different")));
        } else {
          callback();
        }
      };
      const validateRePassword = (rule, value, callback) => {
        if (!value || !value.length) {
          callback(new Error(this.$t("user.rePassword_required")));
        } else if (!/^.{6,200}$/.test(value)) {
          //6位以上的密码
          callback(new Error(this.$t("user.password_minLength")));
        } else if (value !== this.form.password) {
          callback(new Error(this.$t("user.password_different")));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        token: "",
        form: {
          password: '',
          rePassword: ''
        },
        rules: {
          password: [
            {
              validator: validatePassword,
            }
          ],
          rePassword: [
            {
              validator: validateRePassword,
            }
          ],
        },
        passwordStrength: 0
      };
    },
    computed: {
      passwordStrengthText() {
        if (this.passwordStrength === 1) {
          return this.$t("user.password_weak");
        } else if (this.passwordStrength === 2) {
          return this.$t("user.password_middle");
        } else if (this.passwordStrength === 3) {
          return this.$t("user.password_strong");
        } else {
          return "";
        }
      }
    },
    watch: {
      $route: function (val) {
        this.init();
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      submit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch("ajax_forget_password", {
              token: this.token,
              password: this.form.password
            }).then(res => {
              this.loading = false;
              if (res.data && +res.data.error === 0) {
                this.$Message.success(this.$t("user.password_modify_success"));
                this.$goRouter("/user/login");
              } else {
                // this.$Message.error(this.$t("user.password_modify_fail"));
              }
            }).catch(err => {
              // this.$Message.error(this.$t("user.password_modify_fail"));
            });
          } else {
            this.loading = false;
            this.$alert.error({
              title: this.$t("public.error_title_default"),
              content: this.$t("user.password_modify_notValid")
            })
          }
        });
      },
      init() {
        if (this.$route.query && this.$route.query.token) {
          this.token = this.$route.query.token;
          //先判断 token valid
          this.$store.dispatch("ajax_verified_token", {
            token: this.token
          }).then(res => {
            if (!res.data || +res.data.error !== 0) {
              this.$alert.error({
                title: this.$t("public.error_title_default"),
                content: this.$t("user.email_token_invalid")
              })
              this.$goRouter("/user/login");
            }
          }).catch(err => {
            // this.$Message.error(this.$t("user.email_token_invalid"));
            this.$goRouter("/user/login");
          });

        }
      }
    },
    components: {
      logoDiv
    }
  }
</script>
<style lang='scss' scoped>
  .content {
    position: relative;
    margin: 0 auto 5px auto;
    width: 480px;
    height: 372px;
    background: #FFFFFF;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
  }

  .content div {
    word-wrap: break-word;
  }

  .title {
    margin-left: 94px;
    padding-top: 56px;
    font-size: 24px;
    color: #666666;
  }

  .form {
    margin-top: 20px;
  }

  .formItem {
    margin-left: 94px;
  }

  .input {
    width: 292px;
  }

  .submitButton {
    width: 292px;
  }

  .passwordStrength {
    position: absolute;
    left: 540px;
    top: 543px;
    &-text {
      &-1 {
        float: left;
        font-family: PingFangSC-Regular sans-serif;
        font-size: 14px;
        letter-spacing: -0.34px;
        text-align: center;
        color: #ED1C24;
      }
      &-2 {
        float: left;
        font-family: PingFangSC-Regular sans-serif;
        font-size: 14px;
        letter-spacing: -0.34px;
        text-align: center;
        color: #F5A623;
      }
      &-3 {
        float: left;
        font-family: PingFangSC-Regular sans-serif;
        font-size: 14px;
        letter-spacing: -0.34px;
        text-align: center;
        color: #1BB934;
      }
    }
    &-color {
      &-1 {
        float: left;
        width: 8px;
        height: 6px;
        margin: 7px 0 0 5px;
        background: #ED1C24;
        border-radius: 67px;
      }
      &-2 {
        float: left;
        width: 18px;
        height: 6px;
        margin: 7px 0 0 5px;
        background: #F5A623;
        border-radius: 88px;
      }
      &-3 {
        float: left;
        width: 28px;
        height: 6px;
        margin: 7px 0 0 5px;
        background: #1BB934;
        border-radius: 52px;
      }
    }
  }
</style>