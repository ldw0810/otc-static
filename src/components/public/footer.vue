<template>
    <div class="footerBar" :class="{'login': footer_is_login}">
        <div class="copyright" v-text="$t('public.copyright')"></div>
        <div class="footerMenuBar">
            <div class="footerMenuDiv" :class="{'footerMenu': footerItem.url}" v-for="(footerItem, index) in footerList"
                 @click="goFooter(index)" v-text="footerItem.name">
            </div>
            <div class="language">
                <div class="languageIcon">
                    <img src="../../static/images/icon/Language-FFFFFF.svg" v-if="footer_is_login">
                    <img src="../../static/images/icon/Language-999999.svg" v-else>
                </div>
                <Dropdown placement="top-end" @on-click="changeLanguage">
                    <div class="languageText">
                        {{languageList[languageSelectIndex].name}}
                    </div>
                    <div class="languagePullDown">
                        <img src="../../static/images/icon/PullDown-FFFFFF.svg" v-if="footer_is_login">
                        <img src="../../static/images/icon/PullDown-999999.svg" v-else>
                    </div>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="(item, index) in languageList" v-text="item.name"
                                      class="languageMoreButton" :name="index" :key="index">
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <div style="clear: both"></div>
    </div>
</template>
<script type="es6">
    import languageData from "../../locale";

    export default {
        name: "footerBar",
        data() {
            return {
                footerList: [
                    {
                        name: this.$t("public.about"),
                        url: "https://otcmakersupporthelp.zendesk.com/hc/zh-tw/articles/360000582731-什么是OTCMAKER"
                    },
                    {
                        name: "|"
                    },
                    {
                        name: this.$t("public.explain"),
                        url: "https://otcmakersupporthelp.zendesk.com/hc/zh-tw/articles/360000613612-费率说明"
                    },
                    {
                        name: "|"
                    },
                    {
                        name: this.$t("public.helpCenter"),
                        url: "https://otcmakersupporthelp.zendesk.com/hc/zh-tw/categories/360000058352-常见问题"
                    },
                    {
                        name: "|"
                    }
                ],
                languageList: languageData,
                isFooter: false,
                screenWidth: document.body.clientWidth
            };
        },
        computed: {
            languageSelectIndex: function () {
                let index = 0;
                for (let i = 0; i < this.languageList.length; i++) {
                    if (this.languageList[i].language === (window.localStorage.getItem("language") || "zh-CN")) {
                        index = i;
                    }
                }
                return index;
            },
            footer_is_login() {
                return this.$store.state.footer_is_login;
            },
            loginFlag() {
                return this.$store.state.loginFlag;
            }
        },
        watch: {},
        methods: {
            changeLanguage(index) {
                if(index === this.languageSelectIndex) {
                    return false;
                } else {
                    window.localStorage.setItem("language", this.languageList[index].language);
                    this.$goRefresh();
                }
            },
            goFooter(index) {
                if (+index === 4) {
                    if (this.loginFlag) {
                        this.$store.dispatch("ajax_zendesk").then(res => {
                                if (res.data && +res.data.error === 0) {
                                    window.location.href = res.data.path;
                                } else {
                                    this.$Message.error(this.$t("public.url_request_fail"));
                                }
                            }).catch(err => {
                                this.$Message.error(this.$t("public.url_request_fail"));
                            });
                    } else {
                        window.location.href = (window.localStorage.getItem("language") || "zh-CN").toLowerCase().indexOf("zh") > -1 ?
                            "https://otcmakersupporthelp.zendesk.com" :
                            "https://otcmakersupporthelp.zendesk.com/hc/en-us"
                    }
                } else if (this.footerList[index].url) {
                    window.location.href = this.footerList[index].url;
                }
            }
        }
    };
</script>
<style lang='scss' scoped>
    .footerBar {
        min-width: 1080px;
        width: 100%;
        background: #2b2b30;
        color: #999999;
    }

    .footerBar div {
        font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
        Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
        sans-serif;
    }

    .login {
        background: transparent;
        color: #ffffff;
    }

    .copyright {
        margin-left: 50px;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        float: left;
    }

    .footerMenuBar {
        float: right;
    }

    .footerMenuDiv {
        display: block;
        min-width: 35px;
        float: left;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        text-align: center;
        padding-right: 20px;
    }

    .footerMenu {
        cursor: pointer;
    }

    .footerMenu:hover,
    .footerMenu:active,
    .footerMenu:visited {
        /* background-image: -webkit-gradient(
                linear,
                left top,
                right bottom,
                color-stop(0, #0bbfd5),
                color-stop(1, #6dd7b2)
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent; */
        color: #fff;
    }

    .footerMenu:hover:after,
    .footerMenu:active:after,
    .footerMenu:visited:after {
        display: block;
        content: "";
        left: 3px;
        right: 3px;
        margin-top: -3px;
        height: 2px;
        /* background-image: linear-gradient(-134deg, #0bbfd5 0%, #6dd7b2 100%); */
        background-color: #fff;
    }

    .language {
        float: right;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        min-width: 35px;
        text-align: center;
        padding: 0 40px 25px 0;
        display: inline-block;
        position: relative;
    }

    .language div {
        float: left;
        padding-right: 5px;
    }

    .languageText,
    .languagePullDown {
        cursor: pointer;
    }

    .languageIcon {
        /* margin-top: 3px; */
        float: left;
        img {
            vertical-align: middle;
        }
    }
</style>