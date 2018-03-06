<template>
  <div class="header" ref="header">
    <div class="header-inner">
      <div class='header-logo'>
        <router-link to='/'>
          <img class='header-logo-asset' src="../../static/images/LOGO.png">
        </router-link>
      </div>
      <nav class="header-nav">
        <ul class='header-navbar'>
          <li
              class='header-navbar-item'
              :class="{'active': Array.isArray(item.index) && item.index.indexOf(+header_index) > -1 }"
              v-for='(item, index) in menus' :key='index'>
            <Dropdown
                :ref='"menu-" + index'
            >
              <div class='header-navbar-item-wrapper'>
                <a class='header-navbar-item-link' href="javascript:void(0)" @click='goMenu(item)'>
                  {{item.title}}
                </a>
                <Icon class='header-navbar-item-icon header-navbar-item-icon-append ' type="arrow-down-b"
                      v-if='item.children.length'></Icon>
              </div>
              <DropdownMenu class='header-navbar-dropdown' slot="list" v-if='item.children.length'>
                <DropdownItem :class="{'active': childItem.index === header_index}"
                              v-for='(childItem, i) in item.children' :key='i'>
                  <a @click='goMenu(childItem)'>{{childItem.title}}</a>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>
      </nav>
      <nav class='header-nav header-login' v-if='!userToken'>
        <ul class='header-navbar'>
          <li class='header-navbar-item' :class="{'active': item.index === header_index}"
              v-for='(item, index) in logins' :key='index'>
            <Dropdown>
              <div class='header-navbar-item-wrapper' @click='goMenu(item)'>
                <a class='header-navbar-item-link' href="javascript:void(0)">
                  {{item.title}}
                </a>
                <Icon class='header-navbar-item-icon header-navbar-item-icon-append' type="arrow-down-b"
                      v-if='item.children.length'></Icon>
              </div>
              <DropdownMenu class='header-navbar-dropdown' slot="list" v-if='item.children.length'>
                <DropdownItem :class="{'active': childItem.index === header_index}"
                              v-for='(childItem, i) in item.children' :key='i'>
                  <a @click='goMenu(childItem)'>{{childItem.title}}</a>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>
      </nav>
      <nav class='header-nav header-user' v-if='userToken'>
        <ul class='header-navbar'>
          <template v-for='(item, index) in user'>
            <li class='header-navbar-item' :key='index' :class="{'active': item.index === header_index}"
                v-if='index === 0'>
              <div class='header-navbar-item-wrapper' @click='goMenu(item)'>
                <i class='header-navbar-item-icon header-navbar-item-icon-prepend icon-document'></i>
                <a class='header-navbar-item-link' href="javascript:void(0)">
                  {{item.title}}
                </a>
                <span class='header-navbar-item-icon header-navbar-item-icon-append dotted'
                      v-if='userInfo.notice > 0'></span>
              </div>
            </li>
            <li class='header-navbar-item' :key='index' :class="{'active': item.index === header_index}"
                v-if='index === 1'>
              <Poptip trigger="hover" placement="bottom" @on-popper-show="getAssetData"
                      @on-popper-hide="getAssetDataCancel">
                <div class='header-navbar-item-wrapper' @click='goMenu(item)'>
                  <i class='header-navbar-item-icon header-navbar-item-icon-prepend icon-dollar'></i>
                  <a class='header-navbar-item-link' href="javascript:void(0)">
                    {{$t("public.asset")}}
                  </a>
                  <Icon class='header-navbar-item-icon header-navbar-item-icon-append' type="arrow-down-b"></Icon>
                </div>
                <div class='assets' slot='content'>
                  <div class="assets-inner">
                    <div class='assets-inner-list'>
                      <template v-for='(childItem, i) in item.children'>
                        <div class='assets-item' v-if='i === 0' :key='i'>
                          <header class='assets.header'>{{$t("public.type")}}</header>
                          <article class='assets-content'>
                            <ul>
                              <li class='assets-list-item' v-for="(item, index) in userInfo.valid_account" :key="index">
                                {{$t("public['" + item.currency + "']")}}
                              </li>
                            </ul>
                          </article>

                        </div>
                        <div class='assets-item' v-if='i === 1' :key='i'>
                          <header class='assets.header'>{{$t("public.balance")}}</header>
                          <article class='assets-content'>
                            <ul>
                              <li class='assets-list-item' v-for="(item, index) in userInfo.valid_account" :key="index">
                                {{item.balance|fix_decimals(8)}}
                              </li>
                            </ul>
                          </article>

                        </div>
                        <div class='assets-item' v-if='i === 2' :key='i'>
                          <header class='assets.header'>{{$t("public.locked")}}</header>
                          <article class='assets-content'>
                            <ul>
                              <li class='assets-list-item' v-for="(item, index) in userInfo.valid_account" :key="index">
                                {{item.locked|fix_decimals(8)}}
                              </li>
                            </ul>
                          </article>
                        </div>
                      </template>
                    </div>
                    <div class='assets-inner-footer'>
                      <template v-for='(childItem, i) in item.children'>
                        <aside class='assets-footer' v-if='i === 0' :key='i'>
                          <i-button class='assets-btn' @click="goMenu(childItem)">{{$t("public.recharge")}}</i-button>
                        </aside>
                        <aside class='assets-footer' v-if='i === 1' :key='i'>
                          <i-button class='assets-btn' @click="goMenu(childItem)">{{$t("public.withdraw")}}</i-button>
                        </aside>
                        <aside class='assets-footer' v-if='i === 2' :key='i'>
                          <i-button class='assets-btn' type='primary' @click="goMenu(childItem)">
                            {{$t("public.assetInfo")}}
                          </i-button>
                        </aside>
                      </template>
                    </div>
                  </div>
                </div>
              </Poptip>
            </li>
            <li
                class='header-navbar-item' :key='index'
                :class="{'active': Array.isArray(item.index) && item.index.indexOf(+header_index) > -1 }"
                v-if='index === 2'
            >
              <Dropdown>
                <div class='header-navbar-item-wrapper' @click='goMenu(item)'>
                  <a class='header-navbar-item-link' href="javascript:void(0)">
                    {{userInfo.nickname}}
                  </a>
                  <Icon class='header-navbar-item-icon header-navbar-item-icon-append' type="arrow-down-b"></Icon>
                </div>
                <DropdownMenu class='header-navbar-dropdown header-navbar-dropdown-user' slot="list">
                  <DropdownItem :class="{'active': childItem.index === header_index}"
                                v-for='(childItem, i) in item.children' :key='i'>
                    <a @click='goMenu(childItem)'>{{childItem.title}}</a>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
          </template>
        </ul>
      </nav>
    </div>

  </div>
</template>
<script>
  import isFunction from "lodash/isFunction";

  export default {
    name: "headerBar",
    data() {
      return {
        assetLoading: false,
        noticeTimer: 0,
        menus: [
          {
            title: this.$t("public.homePage"),
            url: "/",
            index: 0,
            children: []
          }
        ],
        logins: [
          {
            title: this.$t("public.register"),
            url: "/user/register",
            index: 5,
            children: []
          },
          {
            title: "|",
            url: "",
            children: []
          },
          {
            title: this.$t("public.login"),
            url: "/user/login",
            index: 6,
            children: []
          }
        ],
        user: [
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
                title: this.$t("public.type"),
                url: "/asset",
                query: {
                  type: 0
                }
              },
              {
                title: this.$t("public.balance"),
                url: "/asset",
                query: {
                  type: 1
                }
              },
              {
                title: this.$t("public.locked"),
                url: "/asset",
                query: {
                  type: 0
                }
              }
            ]
          },
          {
            title: "",
            url: "/user/userCenter",
            index: [91, 92],
            visible: false,
            children: [
              {
                title: this.$t("public.userCenter"),
                url: "/user/userCenter",
                index: 91,
                children: []
              },
              {
                title: this.$t("public.myAd"),
                url: "/myAd",
                index: 92,
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
      currencyList() {
        return this.$store.state.currencyList;
      },
      header_index() {
        return +this.$store.state.header_index;
      },
      ajax_source() {
        return this.$store.state.ajax_source;
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
        this.ajax_source && this.ajax_source.cancel({});
      },
      getNotice() {
        this.noticeTimer && clearTimeout(this.noticeTimer);
        if(this.userToken) {
          this.$store.dispatch("ajax_notice").then(res => {
            if (res.data && +res.data.error === 0) {
              this.$store.commit("userInfo_notice_setter", +res.data.notice);
            } else {
            }
          }).catch(err => {
          });
          this.noticeTimer = setTimeout(this.getNotice, 60 * 1000);
        }
      },
      goMenu(item, index) {
        if (item.action && isFunction(item.action)) {
          item.action();
        } else {
          this.$router.push({
            path: item.url,
            query: item.query
          });
        }
      }
    },
    created() {
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
          obj.index = arr[type] + index;
          obj.query = {
            currency: item
          };
          return obj;
        });
      };
      this.menus = [
        {
          title: this.$t("public.homePage"),
          url: "/",
          index: [0],
          children: [],
          visible: false
        },
        {
          title: this.$t("public.buy"),
          url: "/buy",
          index: [11, 12],
          visible: false,
          children: makeArray("buy")
        },
        {
          title: this.$t("public.sell"),
          url: "/sell",
          index: [21, 22],
          visible: false,
          children: makeArray("sell")
        },
        {
          title: this.$t("public.ad"),
          url: "/ad",
          index: [30, 31],
          visible: false,
          children: makeArray("ad")
        },
        {
          title: this.$t("public.invite"),
          url: "/invite",
          index: [4],
          visible: false,
          children: []
        }
      ];
    },
    mounted(){
      this.getNotice();
    },
    destroyed(){
      this.noticeTimer && clearTimeout(this.noticeTimer);
    }
  };
</script>
<style lang='scss'>
  .header-navbar-item {
    .ivu-select-dropdown {
      margin: 0;
      z-index: -1;
    }
  }
</style>

<style lang="scss" scoped>
  @import "~style/variables";

  $height: 76px;
  .header {
    width: 100%;
    min-width: 1200px;
    background-color: #fff;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    &-inner {
      width: 1170px;
      margin: 0 auto;
      height: $height;
    }
    &-logo {
      height: $height;
      display: flex;
      float: left;
      align-items: center;
      margin-right: 80px;
      &-asset {
        width: 195px;
        height: 30px;
      }
    }
    &-nav {
      float: left;
      font-size: 16px;
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
      height: $height;
      display: flex;
      &-item {
        margin-right: 20px;
        margin-left: 20px;
        .ivu-dropdown {
          position: relative;
        }
        .ivu-dropdown-item {
          padding: 0;
          &.active {
            background-color: #e9edf1;
          }
        }
        &-wrapper {
          display: flex;
          cursor: pointer;
          align-items: center;
        }
        &:first-of-type {
          margin-left: 0;
        }
        &:last-of-type {
          margin-right: 0;
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
