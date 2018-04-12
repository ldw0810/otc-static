<template>
  <div class='login-wrapper'>
    <!--<div class="bg"></div>-->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <div style="clear: both"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    created: function () {
      this.$store.commit("footer_is_login_setter", true);
      this.$store.commit("header_index_setter", "6");
    },
    destroyed: function () {
      this.$store.commit("footer_is_login_setter", false);
    },
  }
</script>
<style lang='scss' scoped>
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bg {
    background-image: url("../../../static/images/Login-BG.jpg");
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
    /* z-index: -1; */
    height: 100%;
    width: 100%;
    /* min-width: 1080px; */
  }
</style>