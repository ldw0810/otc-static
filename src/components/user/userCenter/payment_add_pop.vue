<template>
    <div id="popPage">
        <logoDiv></logoDiv>
        <div class="container-payment">
            <div class="g-tabs" v-if="payment_alipay_flag">
                <div class="g-tabs-bar" @click="changeContent(0)" :class="{'g-tabs-bar-active':contentIndex === 0}">
                    <span class="g-tabs-bar-asset">
                        <img src="../../../static/images/icon/Alipay-999999.svg">
                    </span>
                    <span class="g-tabs-bar-text" v-text="$t('user.alipay_title')"></span>
                </div>
                <div class="g-tabs-bar" @click="changeContent(1)" :class="{'g-tabs-bar-active':contentIndex === 1}">
                    <span class="g-tabs-bar-asset">
                        <img src="../../../static/images/icon/Card-999999.svg">
                    </span>
                    <span class="g-tabs-bar-text" v-text="$t('user.bankCard_title_1')"></span>
                </div>
            </div>
            <div class='content'>
                <div class="alipay" v-if="+contentIndex === 0">
                    <Form class="form" ref="alipayForm" @checkValidate='checkValidate_alipayForm' :model="alipayForm"
                          :rules="alipayRules">
                        <FormItem prop="userName" class="formItem">
                            <i-input class="input" type="text" v-model="alipayForm.userName"
                                     :placeholder="$t('user.alipay_userName_required')">
                                <span slot="prepend">
                                    <img src="../../../static/images/icon/User-999999.svg">
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem prop="account" class="formItem">
                            <i-input class="input" type="text" v-model="alipayForm.account"
                                     :placeholder="$t('user.alipay_account_required')">
                                <span slot="prepend">
                                    <img src="../../../static/images/icon/Alipay-999999.svg">
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem prop="reAccount" class="formItem">
                            <i-input class="input" type="text" v-model="alipayForm.reAccount"
                                     :placeholder="$t('user.alipay_reAccount_required')">
                                <span slot="prepend">
                                    <img src="../../../static/images/icon/Alipay-999999.svg">
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem class="formItem submit">
                            <div class='g-comfirm-group '>
                                <i-button class="submitButton" type="primary" :disabled='!validate.alipayForm'
                                          @click="submit('alipayForm')">
                                    {{$t('public.confirm')}}
                                </i-button>
                                <i-button class="cancelButton" @click="cancel">
                                    {{$t('public.cancel')}}
                                </i-button>
                            </div>
                        </FormItem>
                    </Form>
                </div>
                <div class="bankCard" v-else-if="+contentIndex === 1">
                    <div class="titleBank" v-if='!payment_alipay_flag'>
                        <div class="title" v-text="$t('user.bankCard_title_2')"></div>
                    </div>
                    <Form class="form" ref="bankCardForm" @checkValidate='checkValidate_bankCardForm'
                          :model="bankCardForm" :rules="bankCardRules">
                        <FormItem prop="userName" class="formItem">
                            <i-input class="input" type="text" v-model="bankCardForm.userName"
                                     :placeholder="$t('user.bankCard_userName_required')">
                                <span slot="prepend">
                                    <img src="../../../static/images/icon/User-999999.svg">
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem prop="bank" class="formItem">
                            <Select v-model="bankCardForm.bank" class="input select">
                                <Option v-for="item in bankList" :value="item.code" :key="item.code">
                                    {{item.name}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="number" class="formItem">
                            <i-input class="input" type="text" v-model="bankCardForm.number"
                                     :placeholder="$t('user.bankCard_number_required')">
                                <span slot="prepend">
                                    <img src="../../../static/images/icon/Card-999999.svg">
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem prop="reNumber" class="formItem">
                            <i-input class="input" type="text" v-model="bankCardForm.reNumber"
                                     :placeholder="$t('user.bankCard_reNumber_required')">
                                <span slot="prepend">
                                    <img src="../../../static/images/icon/Card-999999.svg">
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem class="formItem submit">
                            <div class='g-comfirm-group '>
                                <i-button class="submitButton" type="primary" :disabled='!validate.bankCardForm'
                                          @click="submit('bankCardForm')">
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
    import validateMixin from "@/components/mixins/validate-mixin";
    import logoDiv from "../../public/logo.vue";

    export default {
        mixins: [validateMixin(["alipayForm", "bankCardForm"])],

        data() {
            const that = this;
            const validateReAccount = (rule, value, callback) => {
                if (!value || !value.length) {
                    callback(new Error(this.$t("user.alipay_reAccount_required")));
                } else if (value !== this.alipayForm.account) {
                    callback(new Error(this.$t("user.alipay_account_different")));
                } else {
                    callback();
                }
            };
            const validateReNumber = (rule, value, callback) => {
                if (!value || !value.length) {
                    callback(new Error(this.$t("user.bankCard_reNumber_required")));
                } else if (value !== that.bankCardForm.number) {
                    callback(new Error(this.$t("user.bankCard_number_different")));
                } else {
                    callback();
                }
            };
            const validateBank = (rule, value, callback) => {
                let tvalue = Number(value).toString();
                let verify = true;
                let sum = 0;
                if (tvalue.length < 16 || tvalue.length > 19) {
                    verify = false;
                }
                // else {
                //     for (let i = 0; i <= tvalue.length - 2; i++) {
                //         if (i % 2 === 0) {
                //             sum += (Number(tvalue[i]) * 2) % 10 + parseInt((Number(tvalue[i]) * 2) / 10)
                //             console.log((Number(tvalue[i]) * 2) % 10, parseInt((Number(tvalue[i]) * 2) / 10))
                //         } else {
                //             sum += Number(tvalue[i])
                //         }
                //     }
                //     verify = 10 - sum % 10 === Number(tvalue[tvalue.length - 1])
                // }
                if (verify === false) {
                    callback(new Error(this.$t("user.bankCard_number_invalid")));
                } else {
                    callback();
                }
            };
            return {
                contentIndex: 0,
                alipayForm: {
                    userName: "",
                    account: "",
                    reAccount: ""
                },
                bankCardForm: {
                    userName: "",
                    bank: "",
                    number: "",
                    reNumber: ""
                },
                alipayRules: {
                    userName: [
                        {
                            required: true,
                            message: this.$t("user.alipay_userName_required")
                        }
                    ],
                    account: [
                        {
                            required: true,
                            message: this.$t("user.alipay_account_required")
                        }
                    ],
                    reAccount: [
                        {
                            validator: validateReAccount
                        }
                    ]
                },
                bankCardRules: {
                    userName: [
                        {
                            required: true,
                            message: this.$t("user.bankCard_userName_required")
                        }
                    ],
                    bank: [
                        {
                            required: true,
                            message: this.$t("user.bankCard_bank_required")
                        }
                    ],
                    number: [
                        {
                            validator: validateBank
                        }
                    ],
                    reNumber: [
                        {
                            validator: validateReNumber
                        }
                    ]
                }
            };
        },
        methods: {
            changeContent(index) {
                this.contentIndex = +index;
            },
            submit(index) {
                this.$refs[index].validate(valid => {
                    if (valid) {
                        if (index === "alipayForm") {
                            this.addReceiving({
                                name: this.alipayForm.userName,
                                account: this.alipayForm.account
                            });
                        } else if (index === "bankCardForm") {
                            this.addReceiving({
                                name: this.bankCardForm.userName,
                                account: this.bankCardForm.number,
                                bank: this.bankCardForm.bank
                            });
                        }
                    }
                });
            },
            cancel() {
                this.$emit("cancel");
            },
            addReceiving(requestData) {
                this.$store
                    .dispatch("ajax_add_receiving", requestData)
                    .then(res => {
                        if (res.data && +res.data.error === 0) {
                            this.$Message.success(this.$t("user.receivables_add_success"));
                            this.$store.commit("collection_refresh_setter", 1);
                        } else {
                            this.$Message.error(this.$t("user.receivables_add_fail"));
                        }
                    })
                    .catch(err => {
                        this.$Message.error(this.$t("user.receivables_add_fail"));
                    });
            },
            getBankList() {
                this.$store
                    .dispatch("ajax_banks")
                    .then(res => {
                        if (res.data && +res.data.error === 0) {
                            this.$store.commit("banks_setter", res.data.list || []);
                        } else {
                            this.$Message.error(this.$t("user.banks_request_fail"));
                        }
                    })
                    .catch(err => {
                        this.$Message.error(this.$t("user.banks_request_fail"));
                    });
            }
        },
        computed: {
            bankList() {
                return this.$store.state.banks;
            },
            payment_alipay_flag() {
                let collection = this.$store.state.collection || [];
                for (let i = 0; i < collection.length; i++) {
                    if (!collection[i].bank) {
                        this.contentIndex = 1;
                        return false;
                    }
                }
                return true;
            }
        },
        mounted() {
            this.getBankList();
        },
        destroyed() {
            // this.$store.commit("layer_index_setter", 1);
        },
        components: {
            logoDiv
        }
    };
</script>
<style lang='scss' scoped>
    #popPage {
        // position: fixed;
        // left: 35%;
        // top: 5%;
        // width: 480px;
        // height: 472px;
        // margin: 0 auto;
        // z-index: 100;
    }

    .container-payment {
        width: 480px;
        background: #ffffff;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
    }

    #popPage .content {
        padding: 45px 94px 54px;
    }

    #popPage .content div {
        word-wrap: break-word;
    }

    #popPage .titleBoth {
        height: 50px;
        width: 480px;
    }

    #popPage .titleBoth .titleFocus {
        background: #ffffff;
    }

    #popPage .titleBoth .titleBlur {
        background: #f4f6f9;
    }

    #popPage .titleBoth .title {
        width: 240px;
        height: 50px;
        float: left;
        font-size: 16px;
        color: #666666;
        text-align: center;
    }

    #popPage .titleBoth .title .img {
        display: inline-block;
    }

    #popPage .titleBoth .title .text {
        display: inline-block;
        cursor: pointer;
        margin-top: 14px;
    }

    #popPage .titleBoth .title .text:hover {
        background-image: -webkit-gradient(
                        linear,
                        left top,
                        right bottom,
                        color-stop(0, #0bbfd5),
                        color-stop(1, #6dd7b2)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    #popPage .titleBoth .title .text:hover:after {
        display: block;
        content: "";
        left: 3px;
        right: 3px;
        height: 2px;
        background-image: linear-gradient(-134deg, #0bbfd5 0%, #6dd7b2 100%);
    }

    #popPage .titleBank .title {
        margin-bottom: 20px;
        font-size: 24px;
        color: #666666;
    }

    #popPage .submit {
        margin-top: 40px;
        margin-bottom: 0;
    }

    #popPage .alipay .form {
        margin-top: 35px;
    }

    #popPage .alipay .submit {
        margin-bottom: 80px - 54px;
    }

    #popPage .input {
        width: 292px;
    }

    #popPage .submitButton {
        width: 172px;
    }

    #popPage .cancelButton {
        width: 110px;
    }
</style>