<template>
  <div class="asset-model">
    <h3 class='asset-model-title'>{{$t("asset.asset_withdraw_confirm")}}</h3>
    <div class='asset-model-content'>
      <div class="content">
        <div class='content-item'>
          <h3 class='content-item-title'>{{$t("asset.asset_withdraw_address")}}</h3>
          <p class='content-item-address'>{{form.address}}</p>
        </div>
        <div class='content-item'>
          <h3 class='content-item-title'>{{$t("asset.asset_withdraw_number")}}</h3>
          <p class='content-item-address'>
            {{form.number}}
            {{$t("public['" + currency + "']")}}
            （{{$t('asset.asset_miners_fee')}}
            {{currencyFee}}
            {{$t("public['" + currency + "']")}}）
          </p>
        </div>
      </div>
      <p class='desc'>{{$t('asset.asset_withdraw_confirm_tip')}}</p>
    </div>
    <div class='g-comfirm-group'>
      <i-button class="submitButton" type="primary" @click="submit">
        {{$t('public.confirm')}}
      </i-button>
      <i-button class="cancelButton" @click="cancel">
        {{$t('public.cancel')}}
      </i-button>
    </div>
  </div>
</template>
<script type="es6">
  import {CONF_DIGITAL_CURRENCY_LIST} from "config/config";
  import logoDiv from "../public/logo.vue"

  export default {
    props: {
      form: {
        address: "",
        number: 0,
        id: 0,
      },
      withdraw: {}
    },
    data() {
      return {};
    },
    computed: {
      currency() {
        return (this.$route.query.currency || CONF_DIGITAL_CURRENCY_LIST[0].currency);
      },
      currencyFee() {
        return this.withdraw.withdraw_channels.fee;
      }
    },
    methods: {
      submit() {
        this.$emit("close", 1);
      },
      cancel() {
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
      width: 580px;
      padding: 48px 75px 60px;
      &-title {
        font-size: 24px;
        color: #333;
        line-height: 33px;
        font-weight: normal;
        margin-bottom: 34px;
      }
      &-content {
        font-size: 16px;
        color: #666666;
        line-height: 28px;
        margin-bottom: 28px;
      }
      .content {
        margin-bottom: 30px - 16px;
      }
      .desc {
        font-size: 16px;
        color: #ED1C24;
        line-height: 22px;
        margin-bottom: 34px;
      }
      .content-item {
        margin-bottom: 16px;
        &-title {
          font-size: 16px;
          font-weight: normal;
          color: #333333;
          line-height: 22px;
          margin-bottom: 3px;
        }
        &-address {
          font-size: 18px;
          color: #2EA2F8;
          word-wrap: break-word;
        }
      }

      &-warn {
        font-size: 16px;
        color: #ED1C24;
        line-height: 20px;
        margin-bottom: 37px;
      }
    }
  }

  .submitButton {
    width: 240px;
  }

  .cancelButton {
    width: 150px;
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