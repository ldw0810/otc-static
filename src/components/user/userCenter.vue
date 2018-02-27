<template>
    <div>
        <div class="bg">
            <div class="title" v-text="$t('user.userCenter')"></div>
        </div>
        <div class="contentBg"></div>
        <div class="page">
            <div class="g-tabs-vertical g-shadow sider">
                <div class="g-tabs-vertical-bar" :class="{'g-tabs-vertical-bar-active': siderIndex == 0}">
                    <div class="siderTextDiv" v-text="$t('user.info')" @click="doSider(0)"></div>
                </div>
                <div class="g-tabs-vertical-bar" :class="{'g-tabs-vertical-bar-active': siderIndex == 1}">
                    <div class="siderTextDiv" v-text="$t('user.securitySetting')" @click="doSider(1)"></div>
                </div>
            </div>
            <div class="content">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
        <div style="clear: both"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        computed: {
            siderIndex() {
                return this.$store.state.user_sider_index;
            }
        },
        methods: {
            doSider(index) {
                this.$store.commit("user_sider_index_setter", index);
                if (+index === 0) {
                    this.$goRouter("/user/userCenter");
                } else if (+index === 1) {
                    this.$goRouter("/user/userCenter/securitySetting");
                }
            }
        },
        mounted(){
            this.$store.commit("header_index_setter", "91");
        }
    }
</script>

<style scoped>
    div {
        font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
    }

    .bg {
        height: 89px;
        width: 100%;
        background-image: url("../../static/images/UserCenter-Banner.jpg");
        background-size: cover;
    }

    .title {
        min-width: 1180px;
        height: 89px;
        line-height: 89px;
        margin-left: 215px;
        font-size: 35px;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .contentBg {
        position: absolute;
        left: 0;
        top: 0;
        min-width: 1180px;
        width: 100%;
        height: 100%;
        background: #FAFBFD;
        z-index: -1;
    }

    .page {
        width: 1180px;
        margin: 0 auto;
    }

    .sider {
        float: left;
        width: 170px;
        height: 88px;
        line-height: 44px;
        font-size: 16px;
        color: #666666;
        margin: 30px 30px 0 0;
        background: #FFFFFF;
    }

    .siderTextDiv {
        float: left;
        width: 165px;
        height: 44px;
        font-size: 14px;
        color: #666666;
        text-align: center;
        cursor: pointer;
    }

    .content {
        float: left;
        margin-top: 30px;
        margin-bottom: 30px;
        width: 970px;
        min-height: 596px;
        background: #FFFFFF;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
        border-radius: 2px;
    }

    .content div {
        word-wrap: break-word;
    }

    .fade-enter-active {
        animation: fade-in .5s;
    }

    .fade-leave-active {
        animation: fade-out .5s;
    }

    @keyframes fade-out {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
