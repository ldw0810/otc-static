<template>
    <div class="header" ref="header">
        <Menu class="menu" mode="horizontal" theme="light" :active-name="header_index" @on-select="goMenu">
            <div class="menu-logo" @click="$goRouter('/')">
                <img src="../../static/images/LOGO.png">
            </div>
            <div class="menu-item">
                <MenuItem class="menuItem" name="0">
                    {{$t("public.homePage")}}
                </MenuItem>
                <Submenu name="1">
                    <template slot="title">
                        {{$t("public.buy")}}
                    </template>
                    <MenuItem v-for="(item, index) in currencyList" :name="'1' + (index + 1)" :key="index">
                        {{$t("public['" + item + "']")}}
                    </MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        {{$t("public.sell")}}
                    </template>
                    <MenuItem v-for="(item, index) in currencyList" :name="'2' + (index + 1)" :key="index">
                        {{$t("public['" + item + "']")}}
                    </MenuItem>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        {{$t("public.ad")}}
                    </template>
                    <MenuItem v-for="(item, index) in currencyList" :name="'3' + (index + 1)" :key="index">
                        {{$t("public['" + item + "']")}}
                    </MenuItem>
                </Submenu>
                <MenuItem class="menuItem" name="4">
                    {{$t("public.invite")}}
                </MenuItem>
            </div>
            <div class="menu-login">
                <MenuItem class="menuItem loginMenu" name="5" v-if="!loginFlag">
                    {{$t("public.register")}}
                </MenuItem>
                <MenuItem class="menuItem loginMenu" name="6" v-if="!loginFlag">
                    {{$t("public.login")}}
                </MenuItem>
                <MenuItem class="menuItem loginMenu" name="7" v-if="loginFlag">
                    <!-- <img class='menu-login-icon' src="../../static/images/icon/Order-666666.svg"> -->
                    <i class='menu-login-icon icon-document'></i>
                    <Badge class="badge" :count="userInfo.notice" overflow-count="999" :dot="userInfo.notice > 0">
                        {{$t("public.order")}}
                    </Badge>
                </MenuItem>
                <MenuItem class="menuItem loginMenu" name="8" v-if="loginFlag">

                    <Poptip trigger="hover" placement="bottom" width="378" @click="goMenu(81)">
                        <!-- <img class='menu-login-icon' src="../../static/images/icon/Asset-666666.svg"> -->
                        <div class='loginMenu-property'>
                            <i class='menu-login-icon icon-dollar'></i>
                            {{$t("public.asset")}}
                            <Icon type="ios-arrow-down"></Icon>
                        </div>

                        <!-- <div > -->
                        <table class="assetInfo" slot="content">
                            <thead>
                            <tr class='assetInfo-tr'>
                                <th class='assetInfo-tr-th'>{{$t("public.type")}}</th>
                                <th class='assetInfo-tr-th'>{{$t("public.balance")}}</th>
                                <th class='assetInfo-tr-th'>{{$t("public.locked")}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class='assetInfo-tr' v-for="(item, index) in userInfo.valid_account" :key="index">
                                <td :class="{'bottom': index == userInfo.valid_account.length - 1}">
                                    {{$t("public['" + item.currency + "']")}}
                                </td>
                                <td :class="{'bottom': index == userInfo.valid_account.length - 1}">
                                    {{item.balance|fix_decimals(8)}}
                                </td>
                                <td :class="{'bottom': index == userInfo.valid_account.length - 1}">
                                    {{item.locked|fix_decimals(8)}}
                                </td>
                            </tr>
                            <tr class='assetInfo-tr-footer'>
                                <td>
                                    <i-button class='assetInfo-tr-button' @click="goMenu('82')">
                                        {{$t("public.recharge")}}
                                    </i-button>
                                </td>
                                <td class="button">
                                    <i-button class='assetInfo-tr-button' @click="goMenu('83')">
                                        {{$t("public.withdraw")}}
                                    </i-button>
                                </td>
                                <td>
                                    <i-button class='assetInfo-tr-button' type='primary' @click="goMenu('84')">
                                        {{$t("public.assetInfo")}}
                                    </i-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- </div> -->
                    </Poptip>
                </MenuItem>
                <Submenu class="menuItem loginMenu" name="9" v-if="loginFlag">
                    <template slot="title" @click="goMenu(9)">
                        <!-- <img class='menu-login-icon' src="../../static/images/icon/User-666666.svg"> -->
                        <i class='menu-login-icon icon-user'></i>
                        {{userInfo.nickname}}
                    </template>
                    <MenuItem name="91">
                        {{$t("public.userCenter")}}
                    </MenuItem>
                    <MenuItem name="92">
                        {{$t("public.myAd")}}
                    </MenuItem>
                    <MenuItem name="93">
                        {{$t("public.logout")}}
                    </MenuItem>
                </Submenu>
            </div>
        </Menu>
        <div style="clear: both"></div>
    </div>
</template>
<script>
    import {Menu, MenuItem, Submenu, Badge} from "iview";

    export default {
        name: "headerBar",
        components: {
            Menu,
            MenuItem,
            Submenu,
            Badge
        },
        data() {
            return {};
        },
        computed: {
            loginFlag() {
                return this.$store.state.loginFlag;
            },
            userInfo() {
                return this.$store.state.userInfo;
            },
            currencyList() {
                return this.$store.state.currencyList;
            },
            header_index() {
                return this.$store.state.header_index + "";
            }
        },
        methods: {
            goMenu(index) {
                if (+index[0] == 0) {
                    this.$goRouter("/");
                } else if (+index[0] == 1) {
                    if (+index[1]) {
                        this.$goRouter("/buy", {
                            currency: this.currencyList[+index[1] - 1]
                        });
                    } else {
                        this.$goRouter("/buy");
                    }
                } else if (+index[0] == 2) {
                    if (+index[1]) {
                        this.$goRouter("/sell", {
                            currency: this.currencyList[+index[1] - 1]
                        });
                    } else {
                        this.$goRouter("/sell");
                    }
                } else if (+index[0] == 3) {
                    if (+index[1]) {
                        this.$goRouter("/ad", {
                            currency: this.currencyList[+index[1] - 1]
                        });
                    } else {
                        this.$goRouter("/ad");
                    }
                } else if (+index[0] == 4) {
                    this.$goRouter("/invite");
                } else if (+index[0] == 5) {
                    this.$goRouter("/user/register");
                } else if (+index[0] == 6) {
                    this.$goRouter("/user/login");
                } else if (+index[0] == 7) {
                    this.$goRouter("/myOrder");
                } else if (+index[0] == 8) {
                    if (+index[1] == 1) {
                        return false;
                    } else if (+index[1] == 2) {
                        this.$goRouter("/asset", {
                            type: 0
                        });
                    } else if (+index[1] == 3) {
                        this.$goRouter("/asset", {
                            type: 1
                        });
                    } else if (+index[1] == 4) {
                        this.$goRouter("/asset", {
                            type: 0
                        });
                    }
                    // else {
                    //     this.$goRouter("/asset");
                    // }
                } else if (+index[0] == 9) {
                    if (+index[1] == 1) {
                        this.$goRouter("/user/userCenter");
                    } else if (+index[1] == 2) {
                        this.$goRouter("/myAd");
                    } else if (+index[1] == 3) {
                        this.$store.commit("delToken");
                        this.$store.commit("delUserInfo");
                        this.$goRefresh();
                    } else {
                        this.$goRouter("/user/userCenter");
                    }
                }
            }
        }
    };
</script>
<style>
    .loginMenu .ivu-poptip-rel {
        vertical-align: middle;
    }

    .loginMenu-property .ivu-icon {
        transition: transform 0.5s;
    }

    .loginMenu-property:hover .ivu-icon {
        transform: rotate(180deg);
    }

    .loginMenu-property .badge .ivu-badge-dot {
        right: -16px;
        top: 4px;
    }
</style>

<style lang="scss" scoped>
    .header {
        background: #ffffff;
    }

    .menu {
        min-width: 1100px;
        line-height: 73px;
        display: flex;
        font-size: 16px;
        padding-top: 15px;
        &-logo {
            width: 195px;
            height: 30px;
            margin: 10px 40px 33px 40px;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
        }
        &-item {
            flex: 1;
        }
        &-login {
            padding-right: 30px;
        }
    }

    .ivu-menu-horizontal {
        height: 60px;
        line-height: 40px;
    }

    .ivu-menu-horizontal.ivu-menu-light:after {
        display: none;
    }

    .ivu-menu-horizontal
    .ivu-menu-submenu
    .ivu-select-dropdown
    .ivu-menu-item-selected,
    .ivu-menu-horizontal
    .ivu-menu-submenu
    .ivu-select-dropdown
    .ivu-menu-item-selected:hover {
        color: #495060;
        background: #eeeeee;
    }

    .ivu-menu-item {
        font-size: 16px;
    }

    .assetInfo {
        color: #333;
        table-layout: fixed;
        width: 378px - 32px;
        padding-left: 4px;
        padding-right: 4px;
        cursor: default;
    }

    .assetInfo-tr {
        height: 50px;
        th {
            width: 28px + 90px;
            &:last-of-type {
                width: auto;
            }
        }
    }

    .assetInfo-tr-th {
        font-weight: normal;
        font-size: 14px;
    }

    .assetInfo-tr-button {
        width: 80px;
        text-align: center;
        padding: 0;
        height: 30px;
        line-height: 30px;
        // height: 30px;
    }

    .assetInfo-tr-footer {
        text-align: center;
        height: 60px;
        line-height: 60px;
    }

    .assetInfo table {
        color: #495060;
        border-collapse: collapse;
    }

    .assetInfo td,
    .assetInfo th {
        // width: 28px + 90px;
        // width: 120px;
        height: 25px;
        text-align: left;
    }

    .assetInfo th,
    .assetInfo .bottom {
        border-bottom: 1px solid #eeeeee;
    }

    .menu-login-icon {
        vertical-align: middle;
        margin-right: 2px;
        color: #666;
    }

    .loginMenu {
        vertical-align: middle;
        &:hover {
            .menu-login-icon {
                color: currentColor;
            }
        }
        .badge {
            vertical-align: inherit;
        }
    }
</style>
