<template>
  <div>
    <div class="bg">
      <div class="title" v-text="$t('user.userCenter')"></div>
    </div>
    <div class="contentBg"></div>
    <div class="page">
      <div class="g-mobile-tabs-vertical g-mobile-shadow sider">
        <div class="siderDiv" :class="{'siderFocus': +siderIndex === 0}" @click="doSider(0)">
          <div class="siderTextDiv" :class="{'siderTextFocus': +siderIndex === 0}"
               v-text="$t('user.info')"></div>
        </div>
        <div class="siderDiv" :class="{'siderFocus': +siderIndex === 1}" @click="doSider(1)">
          <div class="siderTextDiv" :class="{'siderTextFocus': +siderIndex === 1}"
               v-text="$t('user.securitySetting')"></div>
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
        return +this.$store.state.user_sider_index;
      }
    },
    methods: {
      doSider(index) {
        if(this.siderIndex !== +index) {
          this.$store.commit("user_sider_index_setter", index);
          if (+index === 0) {
            this.$goRouter("/user/userCenter");
          } else if (+index === 1) {
            this.$goRouter("/user/userCenter/securitySetting");
          }
        }
      }
    },
    mounted() {
      this.$store.commit("header_index_setter", "91");
    }
  }
</script>

<style lang='scss' scoped>
  .bg {
    width: 100vw;
    background-image: url("../../../static/images/UserCenter-Banner.jpg");
    background-size: cover;
  }

  .title {
    height: 8vh;
    display: flex;
    width: 100vw;
    align-items: center;
    padding-left: 5vw;
    color: #FFFFFF;
    font-size: 2rem;
    letter-spacing: 0;
  }

  .contentBg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #FAFBFD;
    z-index: -1;
  }

  .page {
    width: 100vw;
    margin: 0 auto;
  }

  .sider {
    display: flex;
    width: 100vw;
    font-size: 1rem;
    color: #666666;
    background: #FFFFFF;
  }

  .siderDiv {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50vw;
    height: 8vh;
    color: #666666;
    cursor: pointer;
  }

  .siderFocus {
    background: #FAFBFD;
  }

  .siderTextDiv {
    font-size: 1rem;
    color: #666666;
  }

  .siderTextFocus {
  }

  .content {
    display: flex;
    width: 100vw;
    min-height: 72vh;
    background: #FFFFFF;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
    border-radius: 2px;
  }

  .content div {
    word-wrap: break-word;
  }
</style>
