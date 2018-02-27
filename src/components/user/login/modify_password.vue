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
                    <i-button class="submitButton" type="primary" :disabled='!validate' @click="submit">{{$t('public.complete')}}
                    </i-button>
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
        data() {
            const validatePassword = (rule, value, callback) => {
                if (!value || !value.length) {
                    callback(new Error(this.$t("user.password_required")));
                } else if (!/^.{6,}$/.test(value)) {   //6位以上的密码
                    callback(new Error(this.$t("user.password_minLength")));
                } else {
                    callback();
                }
            };
            const validateRePassword = (rule, value, callback) => {
                if (!value || !value.length) {
                    callback(new Error(this.$t("user.rePassword_required")));
                } else if (!/^.{6,}$/.test(value)) {   //6位以上的密码
                    callback(new Error(this.$t("user.password_minLength")));
                } else if (value !== this.form.password) {
                    callback(new Error(this.$t("user.password_different")));
                } else {
                    callback();
                }
            };
            return {
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
                }
            };
        },
        mounted() {
            if (this.$route.query && this.$route.query.token) {
                this.token = this.$route.query.token;
                //先判断 token valid
                this.$store.dispatch("ajax_verified_token", {
                    token: this.token
                }).then(res => {
                    if (!res.data || res.data.error != 0) {
                        this.$Message.error(this.$t("user.email_token_invalid"));
                        this.$goRouter("/user/login");
                    }
                }).catch(err => {
                    this.$Message.error(this.$t("user.email_token_invalid"));
                    this.$goRouter("/user/login");
                });

            }
        },
        methods: {
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch("ajax_forget_password", {
                            token: this.token,
                            password: this.form.password
                        }).then(res => {
                            if (res.data && res.data.error == 0) {
                                this.$Message.success(this.$t("user.password_modify_success"));
                                this.$goRouter("/user/login");
                            } else {
                                this.$Message.success(this.$t("user.password_modify_fail"));
                            }
                        }).catch(err => {
                            this.$Message.success(this.$t("user.password_modify_fail"));
                        });
                    } else {
                        this.$Message.error(this.$t("user.password_modify_notValid"));
                    }
                });
            }
        },
        components: {
            logoDiv
        }
    }
</script>
<style scoped>
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
        background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
        box-shadow: 0 5px 5px 0 rgba(102, 187, 191, 0.14);
        border-radius: 2px;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 21px;
    }
</style>