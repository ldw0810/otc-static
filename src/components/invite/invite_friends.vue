<template>
    <div class='invite'>
        <div class="banner">
        </div>
        <article class='invite-container'>
            <section class="invite-target g-shadow">
                <div class='invite-target-desc'>
                    {{$t('public.invite_title')}}
                    <a class='invite-target-desc-sub'
                       href='https://otcmakersupporthelp.zendesk.com/hc/zh-tw/articles/360000615892' target="_blank">{{$t('public.invite_question')}}</a>
                </div>
                <div class='copy-area'>
                    <div class='copy-input-wrapper'>
                        <input type="text" class='copy-input' v-model="link" readonly>
                    </div>
                    <div class='copy-btn-wrapper'>
                        <button type="button" class="copy-btn" v-clipboard:copy="link"
                                v-clipboard:success="copySuccess">
                            {{$t("public.invite_copy")}}
                        </button>
                    </div>
                </div>
                <!-- <div class="score-cards">
                        <div class="score-cards-item">
                                <div class="number">938</div>
                                <div class="border"></div>
                                <div class="text">{{$t("public.invite_invited")}}</div>
                        </div>
                        <div class="score-cards-item">
                                <div class="number">720340.37</div>
                                <div class="border"></div>
                                <div class="text">{{$t("public.invite_omt")}}</div>
                        </div>
                </div> -->
            </section>
            <section class="invite-rules g-shadow">
                <h3 class='invite-rules-title'>
                    {{$t("public.invite_rules")}}
                </h3>
                <div class='invite-rules-content' v-html='$t("public.invite_rules_content")'>
                </div>
            </section>
        </article>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                link: window.location.href.replace("invite", "user/register?invitationCode=" + this.$store.state.userInfo.invite)
            };
        },
        computed: {},
        methods: {
            copySuccess() {
                this.$Message.success(this.$t("public.invite_copy_success"));
            },
        },
        mounted() {
            this.$store.commit("header_index_setter", "4");
        }
    }
</script>
<style lang='scss' scoped>
    $baseImage: '~images';
    .banner {
        height: 530px;
        background: url(#{$baseImage}/Invite-Banner.jpg) no-repeat center;
        background-size: cover;
    }

    .invite {
        margin-bottom: 30px;
        &-container {
            width: 970px;
            margin: 370px - 530px auto 0;
        }
        &-target {
            background-color: #fff;
            border-radius: 2px;
            padding: 48px 70px;
            margin-bottom: 30px;
            &-desc {
                font-size: 16px;
                color: #ED1C24;
                margin-bottom: 26px;
                &-sub {
                    color: #2EA2F8;
                }
            }
            .copy-area {
                display: flex;
                justify-content: space-between;
                margin-bottom: 38px;
            }
            .copy-input-wrapper {
                width: 700px;
            }
            .copy-input {
                width: 100%;
                border: 1px solid #CCCCCC;
                border-radius: 2px;
                height: 40px;
                font-size: 16px;
                padding: 8px 20px;
            }
            .copy-btn-wrapper {
                width: 101px;
            }
            .copy-btn {
                border: 0;
                width: 101px;
                height: 40px;
                font-size: 14px;
                color: #FFFFFF;
                background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
                box-shadow: 0 5px 5px 0 rgba(102, 187, 191, 0.14);
                border-radius: 2px;
                cursor: pointer;
            }
        }
        .score-cards {
            display: flex;
            justify-content: space-between;
            &-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-weight: normal;
                width: 370px;
                height: 198px;
                background: #FFFFFF url(#{$baseImage}/Invite-Card.png) no-repeat center;
                background-size: 100%;
                .number {
                    margin-top: 50px;
                    font-size: 41px;
                    line-height: 57px;
                    color: #FFFFFF;
                }
                .border {
                    height: 1px;
                    width: 58px;
                    background-color: #fff;
                    margin-top: 22px;
                    margin-bottom: 10px;
                }
                .text {
                    font-size: 26px;
                    line-height: 37px;
                    color: #FFFFFF;
                }
            }
        }
        &-rules {
            width: 970px;
            height: 424px;
            background: #FFFFFF;
            border-radius: 2px;
            padding: 40px 70px 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            &-title {
                font-weight: normal;
                font-size: 26px;
                line-height: 37px;
                margin-bottom: 20px;
            }
            &-content {
                border-top: 1px solid #eee;
                padding-top: 20px;
                font-size: 16px;
                letter-spacing: 0;
                line-height: 32px;
            }
        }
    }
</style>
