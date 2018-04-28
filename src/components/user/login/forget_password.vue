<template>
  <div>
    <logoDiv/>
    <div class="content">
      <div class="title" v-text="$t('user.password_forget')"></div>
      <Form class="form" ref="form" @checkValidate='checkValidate' :model="form" :rules="rules">
        <FormItem prop="email" class="formItem">
          <i-input class="input" type="text" v-model="form.email" @on-enter="submit"
                   :placeholder="$t('user.email_required')">
            <span slot="prepend">
              <img src="../../../static/images/icon/Email-CCCCCC.svg">
            </span>
          </i-input>
        </FormItem>
        <!--防止自动提交表单-->
        <input type="text" style="display:none"/>
        <FormItem class="formItem submit">
          <i-button class="submitButton" type="primary" :loading='submitLoading' :disabled='!validate'
                    @click="submit">{{$t('user.auth_email_send')}}
          </i-button>
        </FormItem>
        <div class="goButton">
          <a class='goButton-btn' @click="$goRouter('/user/login')" v-text="$t('user.back_login')">
          </a>
        </div>
      </Form>
      <div id="captcha"></div>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script type="es6">
  import validateMixin from "@/components/mixins/validate-mixin";
  import logoDiv from "../../public/logo.vue";
  import {gt} from "../../../libs/gt";

  export default {
    mixins: [validateMixin("form")],
    data() {
      const validateEmail = (rule, value, callback) => {
        if (!value || !value.length) {
          callback(new Error(this.$t("user.email_required")));
        } else if (
          !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
            value
          )
        ) {
          callback(new Error(this.$t("user.email_notValid")));
        } else {
          callback();
        }
      };
      const validatePinCode = (rule, value, callback) => {
        if (!value || !value.length) {
          callback(new Error(this.$t("user.pinCode_required")));
        } else if (
          value.toUpperCase() !== this.$store.state.pinCodeValue.toUpperCase()
        ) {
          callback(new Error(this.$t("user.pinCode_different")));
        } else {
          callback();
        }
      };
      return {
        submitLoading: false,
        form: {
          email: "",
          pinCode: ""
        },
        rules: {
          email: [
            {
              validator: validateEmail
            }
          ],
          pinCode: [
            {
              validator: validatePinCode
            }
          ]
        },
        captchaObj: ""
      };
    },
    methods: {
      submit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.captchaObj.verify();
          }
        });
      },
      init() {
        this.$store
          .dispatch("ajax_captcha_server")
          .then(res => {
            if (res.data && +res.data.error === 0) {
              initGeetest(
                {
                  gt: res.data.gt,
                  challenge: res.data.challenge,
                  offline: false,
                  new_captcha: res.data.new_captcha,

                  product: "bind",
                  width: "292px",
                  lang: window.localStorage.getItem("language") === "zh-CN" ? "zh-cn" : "en"
                },
                captchaObj => {
                  captchaObj.appendTo(document.getElementById("captcha"));
                  this.captchaObj = captchaObj;
                  captchaObj.onSuccess(() => {
                    let result = this.captchaObj.getValidate();
                    this.submitLoading = true;
                    this.$store.dispatch("ajax_send_forget_mail", {
                      email: this.form.email,
                      geetest_challenge: result.geetest_challenge,
                      geetest_validate: result.geetest_validate,
                      geetest_seccode: result.geetest_seccode,
                      check_captcha: 1
                    }).then(result => {
                      this.submitLoading = false;
                      if (result.data && +result.data.error === 0) {
                        this.$Message.success(this.$t("user.auth_email_send_success"));
                      } else if (result.data.error === "100031") {
                        this.$alert.error({
                          title: this.$t("public.error_title_default"),
                          content: this.$t("user.email_not_activated")
                        })
                      } else if (result.data.error === "100040") {
                        this.$alert.error({
                          title: this.$t("public.error_title_default"),
                          content: this.$t("user.email_not_reg")
                        })
                      } else {
                        this.$alert.error({
                          title: this.$t("public.error_title_default"),
                          content: this.$t("user.auth_email_send_fail")
                        })
                      }
                    })
                      .catch(err => {
                        this.submitLoading = false;
                        // this.$Message.error(this.$t("user.auth_email_send_fail"));
                      });
                  });
                }
              );
            } else {
              this.$alert.error({
                title: this.$t("public.error_title_default"),
                content: this.$t("user.captcha_request_fail")
              })
            }
          })
          .catch(err => {
            // this.$Message.error(this.$t("user.captcha_request_fail"));
          });
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
    components: {
      logoDiv
      //            pinCodeDiv
    }
  };
</script>
<style lang='scss' scoped>
  .content {
    position: relative;
    margin: 0 auto 5px auto;
    width: 480px;
    padding: 56px 94px 70px;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
  }

  .content div {
    word-wrap: break-word;
  }

  .title {
    font-size: 24px;
    color: #666666;
  }

  .form {
    margin-top: 20px;
  }

  .input {
    width: 292px;
  }

  /* #captcha {
          width: 292px;
          display: inline-block;
      } */

  .inputPinCode {
    width: 192px;
  }

  .pinCodeDiv {
    position: relative;
    left: 305px;
    top: -118px;
    width: 80px;
    height: 30px;
  }

  .submitButton {
    width: 292px;
  }

  .goButton {
    /* width: 100%; */
    text-align: right;
    &-btn {
      color: #66bbbf;
      cursor: pointer;
    }
  }
</style>