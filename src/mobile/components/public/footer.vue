<template>
  <div class="footerBar">
    <div class='footer-inner'>
      <div class="copyright" v-text="$t('public.copyright')"></div>
      <div class="footerMenuBar">
        <div class="footerMenuDiv" :class="{'footerMenu': footerItem.url}" v-for="(footerItem, index) in footerList"
             @click="goFooter(index)" v-text="footerItem.name">
        </div>
      </div>
      <div class="language">
        <div class="languageIcon">
          <img src="../../../static/images/icon/Language-FFFFFF.svg" v-if="footer_is_login">
          <img src="../../../static/images/icon/Language-999999.svg" v-else>
        </div>
        <Dropdown placement="top-end" @on-click="changeLanguage">
          <div class="languageText">
            {{languageList[languageSelectIndex].name}}
          </div>
          <div class="languagePullDown">
            <img src="../../../static/images/icon/PullDown-FFFFFF.svg" v-if="footer_is_login">
            <img src="../../../static/images/icon/PullDown-999999.svg" v-else>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(item, index) in languageList" v-text="item.name"
                          class="footer-navbar-dropdown languageMoreButton" :name="index" :key="index">
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div style="clear: both"></div>
    </div>

  </div>
</template>
<script type="es6">
  import languageData from "@/locale";
  import {DEFAULT_LANGUAGE, ZENDESK_DOMAIN_URL} from "config/config";

  const domain = `${ZENDESK_DOMAIN_URL}/hc/${(window.localStorage.getItem("language") || "zh-TW").replace('HK', 'TW').toLowerCase()}`;
  export default {
    name: "footerBar",
    data() {
      return {
        footerList: [
          {
            name: this.$t("public.about"),
            url: `${domain}/articles/360001934074`
          },
          {
            name: this.$t("public.explain"),
            url: `${domain}/articles/360001929453`
          },
          {
            name: this.$t("public.helpCenter"),
            url: `${domain}/categories/360000187674`
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
          if (
            this.languageList[i].language ===
            (window.localStorage.getItem("language") || DEFAULT_LANGUAGE)
          ) {
            index = i;
          }
        }
        return index;
      },
      footer_is_login() {
        return this.$store.state.footer_is_login;
      }
    },
    watch: {},
    methods: {
      changeLanguage(index) {
        if (+index === this.languageSelectIndex) {
          return false;
        } else {
          const language = this.languageList[+index] && this.languageList[+index].language;
          let ln = language;
          if (this.$store.state.userToken) {
            if (["zh-HK", "zh-TW"].contains(ln)) {
              ln = "zh-TW";
            } else if (ln !== "zh-CN") {
              ln = "en";
            }
            this.$store.dispatch("ajax_language", {
              ln: ln
            }).then(res => {
              if (res.data && +res.data.error === 0) {
                window.localStorage.setItem("language", language);
                this.$goRefresh();
              } else {
                return false;
              }
            })
              .catch(err => {
                return false;
              });
          } else {
            window.localStorage.setItem("language", language);
            this.$goRefresh();
          }
        }
      },
      goFooter(index) {
        if (this.footerList[index].url) {
          if (this.$store.state.userToken) {
            this.$store.dispatch("ajax_zendesk").then(res => {
              if (res.data && +res.data.error === 0) {
                const returnUrl = encodeURI(this.footerList[index].url);
                window.location.href = `${ZENDESK_DOMAIN_URL}/access/jwt?jwt=${res.data.token}&return_to=${returnUrl}`;
              } else {
                window.location.href = `${domain}/categories/360000187674`;
              }
            }).catch(err => {
              window.location.href = `${domain}/categories/360000187674`;
            });
          } else if (this.footerList[index].url) {
            window.location.href = this.footerList[index].url;
          }
        }
      }
    }
  };
</script>
<style lang='scss' scoped>
  .footerBar {
    width: 100vw;
    background: #2b2b30;
    color: #999999;
  }

  .footer-inner {
    width: 100vw;
    margin: 0 auto;
  }

  .login {
    background: transparent;
    color: #ffffff;
  }

  .copyright {
    height: 6vh;
    display: flex;
    width: 100vw;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .footerMenuBar {
    display: flex;
    justify-content: flex-start;
  }

  .footerMenuDiv {
  }

  .footerMenu {
    cursor: pointer;
    height: 6vh;
    display: flex;
    width: 50vw;
    font-size: 1rem;
    align-items: center;
    justify-content: center;
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
    height: 8vh;
    display: flex;
    width: 100vw;
    font-size: 1rem;
    align-items: center;
    justify-content: center;
  }

  .language div {
    float: left;
  }

  .language div:first-of-type {
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

  .footer {
    &-navbar {
      &-dropdown {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        font-size: 14px !important;
        &:last-of-type {
          &::after {
            display: none;
          }
        }
        &:after {
          content: "";
          position: absolute;
          bottom: 0;
          width: 80%;
          height: 1px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #e9edf1;
        }
      }
    }
  }
</style>