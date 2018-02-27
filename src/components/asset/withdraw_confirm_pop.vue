<template>
<div class="asset-model">
    <h3 class='asset-model-title'>{{$t("asset.asset_withdraw_confirm")}}</h3>
    <div class='asset-model-content'>
        <div class="content">
            <Row>
                <i-col span='4'>
                    <div>{{$t("asset.asset_withdraw_address")}}</div>
                </i-col>
                <i-col span='20'>
                    <div>{{form.address}}</div>
                </i-col>
            </Row>
            <Row>
                <i-col span='4'>
                    <div>{{$t("asset.asset_withdraw_number")}}</div>
                </i-col>
                <i-col span='20'>
                    <div>{{form.number}}</div>
                </i-col>
            </Row>
        </div>
    </div>
    <div>
        <span>
            <i-button class="submitButton" type="primary" @click="submit">
                {{$t('public.confirm')}}
            </i-button>
        </span>
        <span>
            <i-button class="cancelButton" @click="cancel">
                {{$t('public.cancel')}}
            </i-button>
        </span>
    </div>
</div>
</template>
<script type="es6">
    import logoDiv from "../public/logo.vue"
    export default {
        props: {
            form: {
                address: "",
                number: 0,
                id: 0,
            }
        },
        data(){
            return {};
        },
        methods: {
            submit(){
                this.$emit("close", 1);
            },
            cancel(){
                this.$emit("close", 0);
            }
        },
        components: {
            logoDiv
        }
    }
</script>
<style lang="scss" scoped>
.asset {
  &-model {
    padding: 44px 30px 54px;
    &-title {
        font-size: 24px;
        color: #666666;
        line-height: 28px;
        font-weight: normal;
        margin-bottom: 16px;
    }
    &-content {
        font-size: 16px;
        color: #666666;
        line-height: 28px;
        margin-bottom: 28px;
    }
    &-warn {
        font-size: 16px;
        color: #ED1C24;
        line-height: 20px;
        margin-bottom: 37px;
    }
  }
}
</style>

<style scoped>
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
</style>