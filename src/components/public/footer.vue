<template>
  <div class="footerBar" :class="{'login': footer_is_login}">
    <div class='footer-inner'>
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
                            class="footer-navbar-dropdown languageMoreButton" :name="index" :key="index">
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div style="clear: both"></div>
    </div>

  </div>
</template>
<script type="es6">
  import languageData from "../../locale";
  import {DEFAULT_LANGUAGE} from "config/config";

  const domain = `https://otcmaker.zendesk.com/hc/${(window.localStorage.getItem("language") || "zh-TW").replace('HK', 'TW')
    .toLowerCase()}`;

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
            name: "|"
          },
          {
            name: this.$t("public.explain"),
            url: `${domain}/articles/360001929453`
          },
          {
            name: "|"
          },
          {
            name: this.$t("public.helpCenter"),
            url: `${domain}/categories/360000187674`
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
        if (index === this.languageSelectIndex) {
          return false;
        } else {
          if (this.$store.state.userToken) {
            this.$store.dispatch("ajax_language", {
              ln: this.$getLanguage
            }).then(res => {
              if (res.data && +res.data.error === 0) {
                window.localStorage.setItem(
                  "language",
                  this.languageList[index].language
                );
                this.$goRefresh();
              } else {
                return false;
              }
            })
              .catch(err => {
                return false;
              });
          } else {
            window.localStorage.setItem(
              "language",
              this.languageList[index].language
            );
            this.$goRefresh();
          }
        }
      },
      goFooter(index) {
        if (+index === 4) {
          if (this.$store.state.userToken) {
            this.$store
              .dispatch("ajax_zendesk")
              .then(res => {
                if (res.data && +res.data.error === 0) {
                  window.location.href = res.data.path;
                } else {
                }
              })
              .catch(err => {
              });
          } else {
            window.location.href = `${domain}`
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
    min-width: 1200px;
    width: 100%;
    background: #2b2b30;
    color: #999999;
  }

  .footer-inner {
    width: 1170px;
    margin: 0 auto;
  }

  .login {
    background: transparent;
    color: #ffffff;
  }

  .copyright {
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
    padding: 0 0 25px 0;
    display: inline-block;
    position: relative;
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
          left: 5px;
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