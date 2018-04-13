<template>
  <div class="header" ref="header">
    <div class="header-inner">
      <div class='header-logo'>
        <router-link to='/'>
          <img class='header-logo-asset' src="../../../static/images/LOGO.png">
        </router-link>
      </div>
      <div class="header-menuIcon" @click="triggerMenu">
        <img src="../../../static/images/icon/menu.svg">
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="header-menu" ref="menu" v-if="menuFlag">
        <Menu :open-names="['1']" @on-select="goMenu" accordion>
          <div class="header-navbar" v-for='(item, index) in menuList' :key='index'>
            <Submenu :name="index" v-if='item.children.length' class="header-navbar-subMenu"
                     :class="{'active': Array.isArray(item.index) && item.index.indexOf(+header_index) > -1 }">
              <template slot="title">
                {{item.title}}
                <Icon class='header-navbar-subMenu-icon header-navbar-subMenu-icon-append'
                      type="arrow-down-b" v-if='item.children.length'></Icon>
              </template>
              <MenuItem class='header-navbar-subItem' :class="{'active': +('' + index + i) === +header_index}"
                        :name="'' + index + i"
                        v-for='(childItem, i) in item.children' :key='i'>
                {{childItem.title}}
              </MenuItem>
            </Submenu>
            <MenuItem class='header-navbar-item' :name="index" v-else>
              {{item.title}}
            </MenuItem>
          </div>
        </Menu>
      </div>
    </transition>
  </div>
</template>
<script>
  import isFunction from "lodash/isFunction";
  import {CONF_DIGITAL_CURRENCY_LIST} from "config/config";
  import {Menu, MenuGroup, Submenu, MenuItem, Icon} from "iview";

  export default {
    name: "headerBar",
    components: {
      Menu,
      MenuGroup,
      Submenu,
      MenuItem,
      Icon
    },
    data() {
      return {
        assetLoading: false,
        menuFlag: false,
        logins: [
          {
            title: this.$t("public.register"),
            url: "/user/register",
            index: 5,
            children: []
          },
          {
            title: this.$t("public.login"),
            url: "/user/login",
            index: 6,
            children: []
          }
        ]
      };
    },
    computed: {
      userToken() {
        return this.$store.state.userToken;
      },
      userInfo() {
        return this.$store.state.userInfo;
      },
      nickname() {
        return this.userInfo.nickname || window.localStorage.getItem("nickname");
      },
      soft_disabled() {
        return this.$store.state.userInfo.soft_disabled;
      },
      currencyList() {
        return this.$store.state.code.sellable;
      },
      header_index() {
        return this.$store.state.header_index;
      },
      ajax_source() {
        return this.$store.state.ajax_source.me;
      },
      code() {
        return this.$store.state.code;
      },
      menus() {
        const makeArray = type => {
          const arr = {
            buy: 11,
            sell: 21,
            ad: 30
          };
          return this.currencyList.map((item, index) => {
            const obj = {};
            obj.title = this.$t(`public.${item}`);
            obj.url = `/${type}`;
            obj.index = +arr[type] + index;
            obj.query = {
              currency: item
            };
            return obj;
          });
        };
        return [
          {
            title: this.$t("public.homePage"),
            url: "/",
            index: 0,
            children: [],
            visible: false
          },
          {
            title: this.$t("public.buy"),
            url: "/buy",
            index: 1,
            visible: false,
            children: makeArray("buy")
          },
          {
            title: this.$t("public.sell"),
            url: "/sell",
            index: 2,
            visible: false,
            children: makeArray("sell")
          },
          {
            title: this.$t("public.ad"),
            url: "/ad",
            index: 3,
            visible: false,
            children: makeArray("ad")
          },
          {
            title: this.$t("public.invite"),
            url: "/invite",
            index: 4,
            visible: false,
            children: []
          }
        ];
      },
      users() {
        return [
          {
            title: this.$t("public.order"),
            url: "/myOrder",
            index: 7,
            children: [],
            meta: {}
          },
          {
            title: this.$t("public.asset"),
            url: "/asset",
            index: 8,
            children: [
              {
                title: this.$t("public.recharge"),
                url: "/asset",
                query: {
                  type: 0
                }
              },
              {
                title: this.$t("public.withdraw"),
                url: "/asset",
                query: {
                  type: 1
                }
              },
              {
                title: this.$t("public.assetInfo"),
                url: "/asset",
                query: {
                  type: 0
                }
              }
            ]
          },
          {
            title: this.nickname,
            url: "/user/userCenter",
            index: 9,
            visible: false,
            children: [
              {
                title: this.$t("public.userCenter"),
                url: "/user/userCenter",
                children: []
              },
              {
                title: this.$t("public.myAd"),
                url: "/myAd",
                children: []
              },
              {
                title: this.$t("public.logout"),
                url: "",
                action: () => {
                  this.$store.commit("delToken");
                  this.$goRefresh();
                },
                children: []
              }
            ]
          }
        ];
      },
      menuList() {
        return this.menus.concat(this.userToken ? this.users : this.logins);
      },
      timeout: {
        set(val) {
          this.$store.state.timeout.chat = val;
        },
        get() {
          return this.$store.state.timeout.notice;
        }
      }
    },
    watch: {
      code(val) {
        val && this.init();
      },
      soft_disabled(val) {
        if (val) {
          this.timeout && clearTimeout(this.timeout);
        } else {
          this.timeout && clearTimeout(this.timeout);
          this.timeout = setTimeout(this.getNotice, 30 * 1000);
        }
      }
    },
    methods: {
      hideDropDown(item) {
        item.visible = typeof item.visible !== "undefined" ? false : undefined;
      },
      handleMouseenter(item) {
        item.visible = true;
      },
      handleMouseleave(item) {
        item.visible = false;
      },
      getAssetData() {
        this.assetLoading = true;
        this.$store.dispatch("ajax_me").then(res_me => {
          this.assetLoading = false;
        }).catch(res => {
          this.assetLoading = false;
        });
      },
      getAssetDataCancel() {
        this.ajax_source && this.ajax_source.cancel({cancel: 1});
      },
      getNotice() {
        if (this.userToken) {
          this.$store.dispatch("ajax_notice").then(res => {
            if (res.data && +res.data.error === 0) {
              this.$store.commit("userInfo_notice_setter", +res.data.notice);
            } else {
            }
          }).catch(err => {
          });
        }
        this.timeout && clearTimeout(this.timeout);
        this.timeout = setTimeout(this.getNotice, 30 * 1000);
      },
      triggerMenu() {
        if (this.menuFlag) {
          this.menuFlag = false;
          document.removeEventListener('click', this.hideMenu, false);
        } else {
          this.menuFlag = true;
          document.addEventListener('click', this.hideMenu, false);
        }
      },
      hideMenu(e) {
        if (this.$refs.menu && !this.$refs.menu.contains(e.target)) {
          this.menuFlag = false;
        }
      },
      goMenu(index) {
        if (+index !== +this.header_index) {
          this.menuFlag = false;
          const indexList = (index + "").split("");
          if (indexList[1]) {
            const children = this.menuList[+indexList[0]].children;
            if (children[+indexList[1]]) {
              if (children[+indexList[1]].action && isFunction(children[+indexList[1]].action)) {
                children[+indexList[1]].action();
              } else {
                this.$goRouter(children[+indexList[1]].url, children[+indexList[1]].query);
              }
            }
          } else {
            this.$goRouter(this.menuList[+indexList[0]].url, this.menuList[+indexList[0]].query);
          }
        }
      },
      init() {
      }
    },
    created() {
      this.init();
    },
    destroyed() {
      this.timeout && clearTimeout(this.timeout);
    }
  };
</script>

<style lang="scss" scoped>
  @import "~style/variables";

  .header-navbar-item {
    & /deep/ .ivu-select-dropdown {
      margin: 0;
      z-index: -1;
    }
  }

  $height: 12vh;
  .header {
    width: 100vw;
    background-color: #fff;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    &-inner {
      width: 100vw;
      margin: 0 auto;
      height: $height;
    }
    &-logo {
      height: $height;
      display: flex;
      float: left;
      align-items: center;
      margin: 0 5vw 0 5vw;
      &-asset {
        width: 60vw;
      }
    }
    &-menuIcon {
      height: $height;
      width: $height;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    &-menu {
      position: absolute;
      top: 9vh;
      width: 40vw;
      margin-left: 55vw;
      background-image: linear-gradient(134deg, #0BBFD5 0%, #6DD7B2 100%);
      border-radius: 0.5vh;
      &:before {
        right: 2vw;
        box-shadow: rgba(0, 0, 0, 0.1) -2px -2px 5px 0px;
        /*background-image: linear-gradient(134deg, #0BBFD5 0%, #6DD7B2 100%);*/
        background: #0BBFD5;
        content: " ";
        position: absolute;
        width: 5vh;
        height: 5vh;
        transform: rotate(135deg);
        box-sizing: border-box;
        z-index: -1;
      }
    }
    &-nav {
      float: left;
      font-size: 16px;
    }
    &-frozen {
      float: left;
      font-size: 16px;
      &-text {
        display: flex;
        height: $height;
        color: red;
        align-items: center;
      }
    }
    &-login {
      float: right;
      .header-navbar-item {
        margin: 0 15px;
      }
    }
    &-user {
      float: right;
    }
    &-navbar {
      display: flex;
      width: 40vw;
      color: #fff;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #eee;
      &:last-of-type {
        border: 0;
      }
      &-subMenu {
        /deep/ .ivu-menu-submenu-title {
          height: 7vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ivu-icon {
          transition: transform 0.5s;
        }
        &:hover {
          .header-navbar-item-link,
          .header-navbar-item-icon {
            color: $color-primary;
          }
          .ivu-icon {
            transform: rotate(180deg);
          }
        }
      }
      &-item {
        height: 7vh;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          background-color: #e9edf1;
        }
        &.active {
          .header-navbar-item-link,
          .header-navbar-item-icon {
            color: $color-primary;
          }
          .header-navbar-item-link {
            position: relative;
            &:after {
              content: "";
              position: absolute;
              left: 50%;
              bottom: 10px;
              height: 2px;
              width: 80%;
              background-image: $color-primary-gradient;
              transform: translateX(-50%);
            }
          }
          .ivu-dropdown-item {
          }
        }
        &-link {
          height: $height;
          display: flex;
          align-items: center;
          color: #333;
        }
        &-icon {
          font-size: 12px;
          &-prepend {
            font-size: 16px;
            margin-right: 5px;
          }
          &-append {
            margin-left: 5px;
          }
        }
      }
      &-subItem {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 6vh;
        width: 40vw;
        background: #C8D4E0;
        padding: 0 !important;
        border-bottom: 1px solid #eee;
        &:last-of-type {
          border: 0;
        }
      }
      &-dropdown {
        min-width: 90px;
        width: 90px;
        text-align: center;
        &-user {
          width: 120px;
        }
        .ivu-dropdown-item {
          a {
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
            color: currentColor;
          }
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
      .ivu-menu-submenu {
      }
    }
  }

  .ivu-menu-submenu-title {
    height: 10vh;
  }

  .dotted {
    width: 8px;
    height: 8px;
    background-color: #ed1c24;
    border-radius: 50%;
  }

  .assets {
    padding: 20px;
    min-width: 300px;
    font-size: 14px;
    &-inner {
      display: flex;
      flex-direction: column;
      &-list {
        display: flex;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
      }
      &-footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    &-item {
      margin-right: 20px;

      // font-size:12px;
      // width: 40%;
      &:first-of-type {
        // width: 20%;
      }
      &:last-of-type {
        margin-right: 0;
        // text-align: right;
        // width: 0%;
      }
    }
    &-list {
      &-item {
        padding-top: 20px;
      }
    }
    &-header {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    &-content {
    }
    &-footer {
      padding-top: 20px;
      text-align: center;

    }
    &-btn {
      width: 80px;
      padding: 4px 0;
    }
  }
</style>
