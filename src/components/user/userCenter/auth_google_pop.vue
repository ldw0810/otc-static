<template>
    <div id="popPage">
        <logoDiv></logoDiv>
        <div class="content">
            <div class="title" v-text="$t('user.auth_google_add')" v-if="!auth_flag"></div>
            <div class="title" v-text="$t('user.auth_google_del')" v-else></div>
            <Form class="form" ref="form" @checkValidate='checkValidate' :model="form" :rules="rules">
                <FormItem prop="password" class="formItem">
                    <i-input class="input" type="password" v-model="form.password"
                             :placeholder="$t('user.password_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/Lock-CCCCCC.svg">
                            </span>
                    </i-input>
                </FormItem>
                <FormItem prop="pinCode" class="formItem">
                    <i-input class="input" type="text" v-model="form.pinCode" @on-enter="submit"
                             :placeholder="$t('user.auth_google_code_required')">
                            <span slot="prepend">
                                <img src="../../../static/images/icon/IdentifyingCode-CCCCCC.svg">
                            </span>
                    </i-input>
                </FormItem>
                <FormItem class="formItem submit">
                    <span>
                        <i-button class="submitButton" type="primary" :disabled='!validate' :loading='submitLoading' @click="submit">
                            {{$t('public.confirm')}}
                        </i-button>
                    </span>
                    <span>
                        <i-button class="cancelButton" @click="cancel">
                            {{$t('public.cancel')}}
                        </i-button>
                    </span>
                </FormItem>
            </Form>
        </div>
        <div style="clear: both"></div>
    </div>
</template>
<script type="es6">
    import validateMixin from '@/components/mixins/validate-mixin'
    import logoDiv from "../../public/logo.vue"
    export default {
        mixins: [validateMixin('form')],
        data(){
            return {
                submitLoading: false,
                form: {
                    password: '',
                    pinCode: ''
                },
                rules: {
                    password: [
                        {
                            required: true,
                            message: this.$t("user.password_required"),
                        }
                    ],
                    pinCode: [
                        {
                            required: true,
                            message: this.$t("user.auth_google_code_required"),
                        }
                    ],
                }
            };
        },
        computed: {
            auth_flag(){
                return this.$store.state.userInfo.app_two_factor;
            }
        },
        methods: {
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        if(this.auth_flag) {
                            this.submitLoading = true;
                            this.$store.dispatch("ajax_unbind_google", {
                                code: this.form.pinCode,
                                password:this.form.password
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.data && +res.data.error === 0) {
                                    this.$Message.success(this.$t("user.auth_google_del_success"));
                                    // this.$store.commit("layer_index_setter", 1);
                                    this.$goRouter("/user/userCenter/securitySetting");
                                } else {
                                    this.$Message.error(this.$t("user.auth_google_del_fail"));
                                }
                            }).catch(err => {
                                this.submitLoading = false;
                                this.$Message.error(this.$t("user.auth_google_del_fail"));
                            });
                        } else {
                            this.$store.dispatch("ajax_bind_google", {
                                otp_secret: this.$store.state.googleKey,
                                password:this.form.password,
                                code: this.form.pinCode,
                            }).then(res => {
                                if (res.data && +res.data.error === 0) {
                                    this.$Message.success(this.$t("user.auth_google_add_success"));
                                    // this.$store.commit("layer_index_setter", 1);
                                    this.$goRouter("/user/userCenter/securitySetting");
                                } else {
                                    this.$Message.error(this.$t("user.auth_google_add_fail"));
                                }
                            }).catch(err => {
                                this.$Message.error(this.$t("user.auth_google_add_fail"));
                            });
                        }
                    } else {
                        this.$Message.error(this.$t("user.auth_google_notValid"));
                    }
                });
            },
            cancel(){
                this.$emit('cancel');
            }
        },
        destroyed(){
            // this.$store.commit("layer_index_setter", 1);
        },
        components: {
            logoDiv
        }
    }
</script>
<style scoped>
    #popPage {
    }

    #popPage .content {
        margin: 0 auto 5px auto;
        width: 480px;
        height: 372px;
        background: #FFFFFF;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
    }

    #popPage .content div {
        word-wrap: break-word;
    }

    #popPage .title {
        margin-left: 94px;
        padding-top: 63px;
        font-size: 24px;
        color: #666666;
    }

    #popPage .form {
        margin-top: 20px;
    }

    #popPage .formItem {
        margin-left: 94px;
    }

    #popPage .input {
        width: 292px;
    }

    #popPage .submit {
        margin-top: 50px;
    }

    #popPage .submitButton {
        width: 172px;
    }

    #popPage .cancelButton {
        width: 110px;
        margin-left: 10px;
    }
</style>