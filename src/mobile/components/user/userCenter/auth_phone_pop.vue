<template>
  <div id="popPage">
    <logoDiv></logoDiv>
    <div class="addContent" v-show="!userInfo.mobile">
      <div class="title" v-text="$t('user.auth_phone_add')"></div>
      <Form class="form" ref="addForm" @checkValidate='checkValidate_addForm' :model="addForm" :rules="addRules">
        <FormItem prop="country" class="formItem">
          <Select v-model="addForm.country" class="input select">
            <OptionGroup :label="$t('user.default')">
              <Option :value="country_default.value" :key="country_default.value">
                {{country_default.label}}
              </Option>
            </OptionGroup>
            <OptionGroup :label="$t('user.country_select')">
              <Option v-for="item in countryList" :value="item.value" :key="item.value">
                {{item.label}}
              </Option>
            </OptionGroup>
          </Select>
        </FormItem>
        <FormItem prop="phoneNumber" class="formItem">
          <i-input class="input" type="text" v-model="addForm.phoneNumber"
                   :placeholder="$t('user.phone_required')">
                            <span slot="prepend">
                                <img src="../../../../static/images/icon/Phone-CCCCCC.svg">
                            </span>
          </i-input>
        </FormItem>
        <FormItem prop="pinCode" class="formItem">
          <div class='g-send-group'>
            <i-input class="inputPinCode" type="text" v-model="addForm.pinCode" @on-enter="submit"
                     :placeholder="$t('user.pinCode_required')">
                        <span slot="prepend">
                            <img src="../../../../static/images/icon/IdentifyingCode-CCCCCC.svg">
                        </span>
            </i-input>
            <sendCodeButton ref="sendButton" @sendCode="sendPinCode"/>
          </div>
        </FormItem>
        <FormItem class="formItem submit">
          <div class="g-comfirm-group">
            <i-button class="submitButton" type="primary" :disabled='!validate.addForm' :loading='submitLoading' @click="submit">
              {{$t('public.confirm')}}
            </i-button>
            <i-button class="cancelButton" @click="cancel">
              {{$t('public.cancel')}}
            </i-button>
          </div>
        </FormItem>
      </Form>
    </div>
    <div class="delContent" v-show='userInfo.mobile'>
      <div class="title" v-text="$t('user.auth_phone_del')"></div>
      <Form class="form" ref="delForm" @checkValidate='checkValidate_delForm' :model="delForm" :rules="delRules">
        <FormItem prop="password" class="formItem">
          <i-input class="input" type="password" v-model="delForm.password"
                   :placeholder="$t('user.password_required')">
                        <span slot="prepend">
                            <img src="../../../../static/images/icon/Lock-CCCCCC.svg">
                        </span>
          </i-input>
        </FormItem>
        <FormItem prop="pinCode" class="formItem">
          <div class='g-send-group'>
            <i-input class="inputPinCode" type="text" v-model="delForm.pinCode"
                     :placeholder="$t('user.pinCode_required')" @on-enter="submit">
                            <span slot="prepend">
                                <img src="../../../../static/images/icon/IdentifyingCode-CCCCCC.svg">
                            </span>
            </i-input>
            <sendCodeButton @sendCode="sendPinCode"/>
          </div>
        </FormItem>
        <FormItem class="formItem submit">
          <div class="g-comfirm-group">
            <i-button class="submitButton" :disabled='!validate.delForm' :loading='submitLoading' type="primary"
                      @click="submit">
              {{$t('public.confirm')}}
            </i-button>
            <i-button class="cancelButton" @click="cancel">
              {{$t('public.cancel')}}
            </i-button>
          </div>
        </FormItem>
      </Form>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script type="es6">
  import validateMixin from 'mobile/components/mixins/validate-mixin'
  import { VALI_NUMBER_CALLBACK } from 'config/validator'
  import logoDiv from "../../public/logo.vue"
  import sendCodeButton from "../../public/sendCode.vue"

  
  export default {
    mixins: [validateMixin(['addForm', 'delForm'])],
    props: {
      pop_phone_show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        submitLoading: false,
        countryList: [],
        addForm: {
          country: "CN",
          phoneNumber: '',
          pinCode: ''
        },
        delForm: {
          password: "",
          pinCode: ""
        },
        addRules: {
          phoneNumber: [
            {
              required: true,
              message: this.$t("user.phone_required"),
            },
            {
              validator: VALI_NUMBER_CALLBACK
            }
          ],
          pinCode: [
            {
              required: true,
              message: this.$t("user.auth_phone_code_required"),
            },
            {
              validator: VALI_NUMBER_CALLBACK
            }
          ],
        },
        delRules: {
          password: [
            {
              required: true,
              message: this.$t("user.password_required"),
            }
          ],
          pinCode: [
            {
              required: true,
              message: this.$t("user.auth_phone_code_required"),
            },
            {
              validator: VALI_NUMBER_CALLBACK,
            }
          ],
        }
      };
    },
    watch:{
      pop_phone_show(val) {
        if(val && !this.userInfo.mobile) {
          this.$store.dispatch("ajax_national_list").then(res => {
            if (res && +res.data.error === 0) {
              let resList = res.data.country || [];
              let countryList = [];
              for (let i = 0; i < resList.length; i++) {
                countryList[i] = {};
                countryList[i].label = resList[i] ? resList[i][0] : "";
                countryList[i].value = resList[i] ? resList[i][1] : "";
              }
              this.countryList = countryList;
            } else {
              // this.$Message.error(this.$t("user.country_response_none"));
            }
          }).catch(err => {
            // this.$Message.error(this.$t("user.country_response_none"));
          });
        }
      }
    },
    methods: {
      resetForm() {
        this.$refs.addForm.resetFields();
        this.$refs.delForm.resetFields();
      },
      sendPinCode() {
        if (!this.userInfo.mobile) {
          if (this.$refs["addForm"].fields[1].validateState === "success") {
            this.$store.dispatch("ajax_sms_auth", {
              commit: "send_code",
              country: this.addForm.country,
              mobile: this.addForm.phoneNumber
            }).then(res => {
              if (res.data && +res.data.error === 0) {
                // this.$Message.success(this.$t("user.auth_phone_code_send_success"));
              } else {
                this.$refs.sendButton.refresh();
                this.$Message.error(this.$t("user.auth_phone_code_send_fail"));
              }
            }).catch(err => {
              // this.$Message.error(this.$t(`request.${err.error}`));
              this.$refs.sendButton.refresh();
            });
          } else {
            this.$refs.sendButton.refresh();
            this.$Message.error(this.$t("user.phone_notValid"));
          }
        } else {
          this.$store.dispatch("ajax_refresh", {
            refresh: 1
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              // this.$Message.success(this.$t("user.auth_phone_code_send_success"));
            } else {
              this.$Message.error(this.$t("user.auth_phone_code_send_fail"));
            }
          }).catch(err => {
            // this.$Message.error(this.$t("user.auth_phone_code_send_fail"));
          });
        }
      },
      submit() {
        if (!this.userInfo.mobile) {
          this.$refs["addForm"].validate((valid) => {
            if (valid) {
              this.submitLoading = true;
              this.$store.dispatch("ajax_sms_auth", {
                commit: "auth",
                country: this.addForm.country,
                mobile: this.addForm.phoneNumber,
                code: this.addForm.pinCode
              }).then(res => {
                this.submitLoading = false;
                if (res.data && +res.data.error === 0) {
                  this.$Message.success(this.$t("user.auth_phone_bind_success"));
                  this.$emit('cancel', 1);
                } else {
                  this.$Message.error(this.$t("user.auth_phone_bind_fail"));
                }
              }).catch(err => {
                this.submitLoading = false;
                // this.$Message.error(this.$t("user.auth_phone_bind_fail"));
              });
            } else {
              this.$Message.error(this.$t("user.auth_phone_notValid"));
            }
          });
        } else {
          this.$refs["delForm"].validate((valid) => {
            if (valid) {
              this.submitLoading = true;
              this.$store.dispatch("ajax_unbind_sms", {
                password: this.delForm.password,
                code: this.delForm.pinCode
              }).then(res => {
                this.submitLoading = false;
                if (res.data && +res.data.error === 0) {
                  this.$Message.success(this.$t("user.auth_phone_unbind_success"));
                  this.$emit('cancel', 1);
                } else {
                  // this.$Message.error(this.$t("user.auth_phone_unbind_fail"));
                }
              }).catch(err => {
                this.submitLoading = false;
                // this.$Message.error(this.$t("user.auth_phone_unbind_fail"));
              });
            } else {
              this.$Message.error(this.$t("user.auth_phone_notValid"));
            }
          });
        }
      },
      cancel() {
        this.$emit('cancel', 0);
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo;
      },
      country_default() {
        return {
          value: "CN",
          label: "China"
        }
      }
    },
    components: {
      logoDiv,
      sendCodeButton
    }
  }
</script>
<style lang='scss' scoped>
  #popPage {
    /* position: fixed;
    left: 35%;
    top: 5%;
    width: 480px;
    height: 472px;
    margin: 0 auto;
    z-index: 100; */
  }

  #popPage .addContent, #popPage .delContent {
    margin: 0 auto 5px auto;
    width: 480px;
    padding: 0 94px 54px;
    background: #FFFFFF;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  #popPage .content div {
    word-wrap: break-word;
  }

  #popPage .title {
    font-size: 24px;
    color: #666666;
  }

  #popPage .addContent .title {
    padding-top: 34px;
  }

  #popPage .delContent .title {
    padding-top: 63px;
  }

  #popPage .form {
    margin-top: 20px;
  }

  #popPage .input {
    width: 292px;
  }

  #popPage .inputPinCode {
    width: 192px;
  }

  #popPage .addContent .submit {
    margin-bottom: 0;
  }

  #popPage .delContent .submit {
    margin-top: 50px;
    margin-bottom: 80px -54px;
  }

  #popPage .submitButton {
    width: 172px;
  }

  #popPage .cancelButton {
    width: 110px;
  }
</style>