<template>
    <div class="header" ref="header">
      <div class='header-logo'>
        <img class='header-logo-asset' src="../../static/images/LOGO.png">
      </div>
      <nav class="header-nav">
        <ul class='header-navbar'>
          <li class='header-navbar-item' v-for='(item, index) in menus' :key='index'>
            <Dropdown>
              <div class='header-navbar-item-wrapper'>
                <a class='header-navbar-item-link' href="javascript:void(0)">
                    {{item.title}}
                </a>
                <Icon class='header-navbar-item-icon header-navbar-item-icon-append ' type="arrow-down-b" v-if='item.children.length'></Icon>
              </div>
              <DropdownMenu class='header-navbar-dropdown' slot="list" v-if='item.children.length'>
                  <DropdownItem v-for='(childItem, i) in item.children' :key='i'>{{childItem.title}}</DropdownItem>
              </DropdownMenu>
          </Dropdown>
          </li>
        </ul>
      </nav>
      <nav class='header-nav header-login' v-if='false'>
        <ul class='header-navbar'>
          <li class='header-navbar-item' v-for='(item, index) in logins' :key='index'>
            <Dropdown>
              <div class='header-navbar-item-wrapper'>
                <a class='header-navbar-item-link' href="javascript:void(0)">
                    {{item.title}}
                </a>
                <Icon class='header-navbar-item-icon header-navbar-item-icon-append' type="arrow-down-b" v-if='item.children.length'></Icon>
              </div>
              <DropdownMenu class='header-navbar-dropdown' slot="list" v-if='item.children.length'>
                  <DropdownItem v-for='(childItem, i) in item.children' :key='i'>{{childItem.title}}</DropdownItem>
              </DropdownMenu>
          </Dropdown>
          </li>
        </ul>
      </nav>
      <nav class='header-nav header-user'>
        <ul class='header-navbar'>
          <template v-for='(item, index) in user'>
            <li class='header-navbar-item' :key = 'index' v-if='index === 0'>
              <div class='header-navbar-item-wrapper'>
                  <i class='header-navbar-item-icon header-navbar-item-icon-prepend icon-document'></i>
                  <a class='header-navbar-item-link' href="javascript:void(0)">
                    {{item.title}}
                  </a>
                  <span class='header-navbar-item-icon header-navbar-item-icon-append dotted'></span>
              </div>
            </li>
            <li class='header-navbar-item' :key = 'index'  v-if='index === 1'>
              <Poptip trigger="hover" placement="bottom-end" width="378" @click="goMenu(81)">
                <div class='header-navbar-item-wrapper'>
                  <i class='header-navbar-item-icon header-navbar-item-icon-prepend icon-dollar'></i>
                  <a class='header-navbar-item-link' href="javascript:void(0)">
                    {{$t("public.asset")}}
                  </a>
                  <Icon class='header-navbar-item-icon header-navbar-item-icon-append' type="arrow-down-b"></Icon>
                </div>
                <div class='assets' slot='content'>
                  <div class="assets-inner">
                    <div class='assets-item'>
                      <header class='assets.header'>{{$t("public.type")}}</header>
                      <article class='assets-content'>
                        <ul>
                          <li class='assets-list-item' v-for="(item, index) in userInfo.valid_account" :key="index">
                            {{$t("public['" + item.currency + "']")}}
                          </li>
                        </ul>
                      </article>
                      <aside class='assets-footer'>
                        <i-button class='assets-btn' @click="goMenu('82')">{{$t("public.recharge")}}</i-button>
                      </aside>
                    </div>
                    <div class='assets-item'>
                      <header class='assets.header'>{{$t("public.balance")}}</header>
                      <article class='assets-content'>
                        <ul>
                          <li class='assets-list-item' v-for="(item, index) in userInfo.valid_account" :key="index">
                            {{item.balance|fix_decimals(8)}}
                          </li>
                        </ul>
                      </article>
                      <aside class='assets-footer'>
                        <i-button class='assets-btn' @click="goMenu('83')">{{$t("public.withdraw")}}</i-button>
                      </aside>
                    </div>
                    <div class='assets-item'>
                      <header class='assets.header'>{{$t("public.locked")}}</header>
                      <article class='assets-content'>
                        <ul>
                          <li class='assets-list-item' v-for="(item, index) in userInfo.valid_account" :key="index">
                            {{item.locked|fix_decimals(8)}}
                          </li>
                        </ul>
                      </article>
                      <aside class='assets-footer'>
                        <i-button class='assets-btn' type='primary' @click="goMenu('84')">{{$t("public.assetInfo")}}</i-button>
                      </aside>
                    </div>
                  </div>
                </div>
              </Poptip>            
            </li>
            <li class='header-navbar-item' :key = 'index'  v-if='index === 2'>
                <Dropdown>
                  <div class='header-navbar-item-wrapper'>
                  <a class='header-navbar-item-link' href="javascript:void(0)">
                      {{userInfo.nickname || 'Aaron'}}
                  </a>
                  <Icon class='header-navbar-item-icon header-navbar-item-icon-append' type="arrow-down-b"></Icon>
                  </div>
                  <DropdownMenu class='header-navbar-dropdown' slot="list">
                      <DropdownItem v-for='(childItem, i) in item.children' :key='i'>{{childItem.title}}</DropdownItem>
                  </DropdownMenu>
              </Dropdown>
            </li>   
          </template>       
        </ul>
      </nav>
    </div>
</template>
<script>
export default {
  name: "headerBar",
  data() {
    return {
      menus: [
        {
          title: this.$t("public.homePage"),
          url: "/",
          children: []
        }
      ],
      logins: [
        {
          title: this.$t("public.register"),
          url: "/user/register",
          children: []
        },
        {
          title: '|',
          url: '',
          children: []
        },
        {
          title: this.$t("public.login"),
          url: "/user/login",
          children: []
        }
      ],
      user: [
        {
          title: this.$t("public.order"),
          url: "/myOrder",
          children: [],
          meta: {}
        },
        {
          title: this.$t("public.asset"),
          url: '',
          children: [],
        },
        {
          title: '',
          url: '',
          children: [
            {
              title: this.$t('public.userCenter'),
              url: '/user/userCenter',
              children: [],
            },
            {
              title: this.$t('public.myAd'),
              url: '/myAd',
              children: [],
            },
            {
              title: this.$t('public.logout'),
              url: '',
              action: () => {
                this.$store.commit("loginFlag_setter", 0);
                this.$store.commit("delToken");
                this.$goRefresh();
              },
              children: [],
            }
          ]
        }
      ],
    };
  },
  computed: {
    loginFlag() {
      return this.$store.state.loginFlag;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    currencyList() {
      return this.$store.state.currencyList;
    },
    header_index() {
      return this.$store.state.header_index + "";
    }
  },
  created() {
    const makeArray = type => {
      return this.currencyList.map(item => {
        const obj = {};
        obj.title = this.$t(`public.${item}`);
        obj.url = `/${type}`;
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
        children: []
      },
      {
        title: this.$t("public.buy"),
        url: "/buy",
        children: makeArray("buy")
      },
      {
        title: this.$t("public.sell"),
        url: "/sell",
        children: makeArray("sell")
      },
      {
        title: this.$t("public.ad"),
        url: "/ad",
        children: makeArray("ad")
      },
      {
        title: this.$t("public.invite"),
        url: "/invite",
        children: []
      },
    ];
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
@import '~style/variables';
$height : 76px;
.header {
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.08);
  width: 100%;
  height: $height;
  margin: 0 auto;
  padding-left: 50px;
  padding-right: 50px;
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
      cursor: pointer;
      margin-right: 20px;
      margin-left: 20px;
      &-wrapper {
        display: flex;
        align-items: center;
      }
      &:first-of-type {
        margin-left: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
      &:hover {
        .header-navbar-item-link, .header-navbar-item-icon {
          color: $color-primary;
        }
      }
      &.active {
        color: $color-primary;
        .header-navbar-item-link {
          color: currentColor;
          position: relative;
          &:after {
            content: '';
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
          background-color: #e9edf1;
        }
      }
      // .ivu-icon {
        
        // margin-left: 4px;
      // }
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
      .ivu-dropdown-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        font-size: 14px !important;
        &:last-of-type{
          &::after {
            display: none;
          }
        }
        &:after {
          content: '';
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
  background-color: #ED1C24;
  border-radius: 50%;
}
.assets {
  padding: 20px;
  font-size: 14px;
  &-inner {
    display: flex;
  }
  &-item {
    width: 33%;
  }
  &-list {
    &-item {
      padding-top: 12px;
    }
  }
  &-header {
    padding: 10px 0;
    border-bottom: 1px solid #eee; 
  }
  &-content {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  &-footer {
    padding-top: 20px;
    padding-bottom: 5px;
    text-align: center;
  }
  &-btn {
    width: 80px;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
