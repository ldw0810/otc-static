<template>
  <div id="content">
    <BreadCrumb
        :breadcrumbText='breadcrumbText'
    />
    <div class="wrapper">
      <div class="title" v-text="$t('user.modify_password_info')"></div>
      <Form class="form" ref="form" @checkValidate='checkValidate' :model="form" :rules="rules">
        <FormItem prop="password" class="formItem">
          <i-input class="input" type="password" v-model="form.password"
                   :placeholder="$t('user.password_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Lock-999999.svg">
                            </span>
          </i-input>
        </FormItem>
        <div class="divider"></div>
        <FormItem prop="passwordNew" class="formItem">
          <i-input class="input" type="password" v-model="form.passwordNew"
                   :placeholder="$t('user.password_new_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Lock-999999.svg">
                            </span>
          </i-input>
        </FormItem>
        <FormItem prop="rePasswordNew" class="formItem">
          <i-input class="input" type="password" v-model="form.rePasswordNew"
                   :placeholder="$t('user.rePassword_required')" @on-enter="submit">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Lock-999999.svg">
                            </span>
          </i-input>
        </FormItem>
        <FormItem class="formItem submit">
          <i-button type="primary" long :disabled='!validate' :loading='submitLoading' @click="submit">
            {{$t('public.confirm')}}
          </i-button>
        </FormItem>
      </Form>
    </div>
    <div class="passwordStrength" v-if="+passwordStrength > 0">
      <div :class="'passwordStrength-text-' + passwordStrength">{{passwordStrengthText}}</div>
      <div :class="'passwordStrength-color-' + passwordStrength"></div>
    </div>
  </div>
</template>

<script type="es6">
  import validateMixin from "@/components/mixins/validate-mixin";
  import BreadCrumb from "./breadcrumb";

  export default {
    mixins: [validateMixin("form")],
    components: {BreadCrumb},
    data() {
      const validatePassword = (rule, value, callback) => {
        if (!value || !value.length) {
          callback(new Error(this.$t("user.password_old_required")));
        } else if (!/^.{6,200}$/.test(value)) {
          //6位以上的密码
          callback(new Error(this.$t("user.password_minLength")));
        } else {
          callback();
        }
      };
      const validatePasswordNew = (rule, value, callback) => {
        let reg = /^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;
        this.passwordStrength = this.$checkPassword(value);
        if (!value || !value.length) {
          callback(new Error(this.$t("user.password_new_required")));
        } else if (!/^.{6,200}$/.test(value) || !reg.test(value)) {
          //6位以上的密码
          callback(new Error(this.$t("user.password_minLength")));
        } else if (value === this.form.password) {
          callback(new Error(this.$t("user.password_new_repeat")));
        } else {
          callback();
        }
      };
      const validateRePasswordNew = (rule, value, callback) => {
        if (!value || !value.length) {
          callback(new Error(this.$t("user.rePassword_required")));
        } else if (!/^.{6,200}$/.test(value)) {
          //6位以上的密码
          callback(new Error(this.$t("user.password_minLength")));
        } else if (value !== this.form.passwordNew) {
          callback(new Error(this.$t("user.password_different")));
        } else {
          callback();
        }
      };
      return {
        submitLoading: false,
        breadcrumbText:
        this.$t("user.securitySetting") +
        " - " +
        this.$t("user.modify_password"),
        form: {
          password: "",
          passwordNew: "",
          rePasswordNew: ""
        },
        rules: {
          password: [
            {
              validator: validatePassword
            }
          ],
          passwordNew: [
            {
              validator: validatePasswordNew
            }
          ],
          rePasswordNew: [
            {
              validator: validateRePasswordNew
            }
          ]
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
    methods: {
      submit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.submitLoading = true;
            this.$store
              .dispatch("ajax_update_password", {
                old_password: this.form.password,
                password: this.form.passwordNew,
                password_confirmation: this.form.rePasswordNew
              })
              .then(res => {
                this.submitLoading = false;
                if (res.data && +res.data.error === 0) {
                  this.$Message.success(this.$t("user.password_modify_success"));
                  this.$goRouter("/user/userCenter/securitySetting");
                } else {
                  // this.$Message.error(this.$t("user.password_modify_fail"));
                  this.$refs["form"].resetFields();
                }
              })
              .catch(err => {
                this.submitLoading = false;
                // this.$Message.error(this.$t("user.password_modify_fail"));
                this.$refs["form"].resetFields();
              });
          } else {
            //重置密码输入框
          }
        });
      },
      init() {

      }
    }
  };
</script>
<style lang='scss' scoped>
  #content div {
    word-wrap: break-word;
  }

  .wrapper {
    width: 292px;
    margin: 0 auto;
  }

  .title {
    margin-top: 76px;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    text-align: left;
  }

  .form {
    margin-top: 50px;
  }

  .form .input {
    width: 292px;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #eee;
    margin-bottom: 20px;
  }

  .submit {
    margin-top: 60px;
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