<template>
    <div id="popPage">
        <logoDiv></logoDiv>
        <div class="content">
            <div class="content_1" v-text="$t('user.authentication_email_beenSend')"></div>
            <div class="content_2" v-text="email"></div>
            <div class="content_3" v-text="$t('user.authentication_email_beenSend_info')"></div>
            <div class="content_4" v-text="$t('user.authentication_email_reSend_link')" @click="sendEmail"></div>
            <i-button class="submitButton" type="primary" :loading='loading' @click="submit">
                {{$t('public.confirm')}}
            </i-button>
        </div>
        <div style="clear: both"></div>
    </div>
</template>
<script type="es6">
import logoDiv from "../../public/logo.vue";
export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    email: function() {
      return this.$store.state.userInfo.email;
    }
  },
  methods: {
    sendEmail() {
      this.loading = true;
      this.$store
        .dispatch("ajax_send_activation", {
          email: this.email
        })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submit() {
      // this.$store.commit("layer_index_setter", 1);
      this.$emit("close", 1);
    }
  },
  destroyed() {
    // this.$store.commit("layer_index_setter", 1);
  },
  components: {
    logoDiv
  }
};
</script>
<style scoped>
#popPage {
  /* position: fixed;
        left: 35%;
        top: 5%;
        width: 480px;
        height: 472px;
        margin: 0 auto;
        z-index: 100; */
}

#popPage .content {
  margin: 0 auto 5px auto;
  width: 480px;
  height: 372px;
  background: #ffffff;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
}

#popPage .content div {
  word-wrap: break-word;
}

#popPage .content .content_1 {
  width: 480px;
  text-align: center;
  padding-top: 63px;
  font-size: 24px;
  color: #666666;
}

#popPage .content .content_2 {
  width: 480px;
  text-align: center;
  margin-top: 10px;
  font-size: 24px;
  color: #666666;
}

#popPage .content .content_3 {
  width: 480px;
  text-align: center;
  margin-top: 25px;
  font-size: 16px;
  color: #666666;
  line-height: 21px;
}

#popPage .content .content_4 {
  width: 480px;
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: #00a6ae;
  letter-spacing: 0;
  cursor: pointer;
}

#popPage .submitButton {
  margin: 50px 0 0 94px;
  width: 292px;
}
</style>