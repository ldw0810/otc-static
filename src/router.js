import store from "./store/store";
import Util from "./libs/util";
import Vue from "vue";
import {LoadingBar} from "iview";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const routers = [
  {
    path: "/",
    meta: {
      title: "OTCMAKER"
    },
    component: resolve => require(["./pages/index.vue"], resolve),
    children: [
      {
        path: "/",
        name: "home",
        meta: {
          noLogin: true
        },
        component: resolve => require(["./components/home.vue"], resolve)
      },
      // 服务条款
      {
        path: "policy",
        name: "policy",
        meta: {
          noLogin: true
        },
        component: resolve =>
          require(["./components/policy/index.vue"], resolve)
      },
      // 用户协议
      {
        path: "user-agreement",
        name: "user-agreement",
        meta: {
          noLogin: true
        },
        component: resolve =>
          require(["./components/policy/user-agreement.vue"], resolve)
      },
      {
        path: "user/login",
        meta: {
          noLogin: true,
          noUser: true
        },
        component: resolve => require(["./components/user/login.vue"], resolve),
        children: [
          {
            path: "/",
            name: "user/login",
            component: resolve =>
              require(["./components/user/login/index.vue"], resolve)
          },
          {
            path: "modify_password",
            name: "user/login/modify_password",
            component: resolve =>
              require(["./components/user/login/modify_password.vue"], resolve)
          },
          {
            path: "forget_password",
            name: "user/login/forget_password",
            component: resolve =>
              require(["./components/user/login/forget_password.vue"], resolve)
          },
          {
            path: "validate",
            name: "user/login/validate",
            component: resolve =>
              require(["./components/user/login/validate.vue"], resolve)
          }
        ]
      },
      {
        path: "user/register",
        name: "user/register",
        meta: {
          noLogin: true,
          noUser: true
        },
        component: resolve =>
          require(["./components/user/register.vue"], resolve)
      },
      {
        path: "user/userCenter",
        component: resolve =>
          require(["./components/user/userCenter.vue"], resolve),
        children: [
          {
            path: "/",
            name: "user/userCenter",
            component: resolve =>
              require(["./components/user/userCenter/userInfo.vue"], resolve)
          },
          {
            path: "securitySetting",
            name: "user/userCenter/securitySetting",
            component: resolve =>
              require([
                "./components/user/userCenter/securitySetting.vue"
              ], resolve)
          },
          {
            path: "modify_password",
            name: "user/userCenter/modify_password",
            component: resolve =>
              require([
                "./components/user/userCenter/modify_password.vue"
              ], resolve)
          },
          {
            path: "auth_google",
            name: "user/userCenter/auth_google",
            meta: {
              needEmail: true
            },
            component: resolve =>
              require(["./components/user/userCenter/auth_google.vue"], resolve)
          },
          {
            path: "payment",
            name: "user/userCenter/payment",
            meta: {
              needEmail: true
            },
            component: resolve =>
              require(["./components/user/userCenter/payment.vue"], resolve)
          }
        ]
      },
      {
        path: "myOrder",
        name: "myOrder",
        meta: {
          freeze: true
        },
        component: resolve =>
          require(["./components/order/myOrder.vue"], resolve)
      },
      {
        path: "buy",
        name: "buy",
        meta: {
          noLogin: true,
          freeze: true
        },
        component: resolve => require(["./components/ad/adList.vue"], resolve)
      },
      {
        path: "sell",
        name: "sell",
        meta: {
          noLogin: true,
          freeze: true
        },
        component: resolve => require(["./components/ad/adList.vue"], resolve)
      },
      {
        path: "detail",
        name: "detail",
        meta: {
          needEmail: true,
          freeze: true
        },
        component: resolve => require(["./components/ad/adDetail.vue"], resolve)
      },
      {
        path: "order",
        name: "order",
        meta: {
          needEmail: true,
          freeze: true
        },
        component: resolve => require(["./components/order/order.vue"], resolve)
      },
      {
        path: "asset",
        name: "asset",
        meta: {
          needEmail: true
        },
        component: resolve => require(["./components/asset/asset.vue"], resolve)
      },
      {
        path: "ad",
        name: "ad",
        meta: {
          needEmail: true,
          freeze: true
        },
        component: resolve => require(["./components/ad/ad.vue"], resolve)
      },
      {
        path: "myAd",
        name: "myAd",
        meta: {
          freeze: true
        },
        component: resolve => require(["./components/ad/myAd.vue"], resolve)
      },
      {
        path: "invite",
        name: "invite",
        meta: {
          freeze: true
        },
        component: resolve =>
          require(["./components/invite/invite_friends.vue"], resolve)
      }
    ]
  },
  {
    path: "/mobile",
    meta: {
      title: "OTCMAKER"
    },
    component: resolve => require(["./mobile/pages/index.vue"], resolve),
    children: [
      {
        path: "/",
        name: "mobile/home",
        meta: {
          noLogin: true
        },
        component: resolve => require(["./mobile/components/home.vue"], resolve)
      },
      // 服务条款
      {
        path: "policy",
        name: "mobile/policy",
        meta: {
          noLogin: true
        },
        component: resolve =>
          require(["./mobile/components/policy/index.vue"], resolve)
      },
      // 用户协议
      {
        path: "user-agreement",
        name: "mobile/user-agreement",
        meta: {
          noLogin: true
        },
        component: resolve =>
          require(["./mobile/components/policy/user-agreement.vue"], resolve)
      },
      {
        path: "user/login",
        meta: {
          noLogin: true,
          noUser: true
        },
        component: resolve => require(["./mobile/components/user/login.vue"], resolve),
        children: [
          {
            path: "/",
            name: "mobile/user/login",
            component: resolve =>
              require(["./mobile/components/user/login/index.vue"], resolve)
          },
          {
            path: "modify_password",
            name: "mobile/user/login/modify_password",
            component: resolve =>
              require(["./mobile/components/user/login/modify_password.vue"], resolve)
          },
          {
            path: "forget_password",
            name: "mobile/user/login/forget_password",
            component: resolve =>
              require(["./mobile/components/user/login/forget_password.vue"], resolve)
          },
          {
            path: "validate",
            name: "mobile/user/login/validate",
            component: resolve =>
              require(["./mobile/components/user/login/validate.vue"], resolve)
          }
        ]
      },
      {
        path: "user/register",
        name: "mobile/user/register",
        meta: {
          noLogin: true,
          noUser: true
        },
        component: resolve =>
          require(["./mobile/components/user/register.vue"], resolve)
      },
      {
        path: "user/userCenter",
        component: resolve =>
          require(["./mobile/components/user/userCenter.vue"], resolve),
        children: [
          {
            path: "/",
            name: "mobile/user/userCenter",
            component: resolve =>
              require(["./mobile/components/user/userCenter/userInfo.vue"], resolve)
          },
          {
            path: "securitySetting",
            name: "mobile/user/userCenter/securitySetting",
            component: resolve =>
              require(["./mobile/components/user/userCenter/securitySetting.vue"], resolve)
          },
          {
            path: "modify_password",
            name: "mobile/user/userCenter/modify_password",
            component: resolve =>
              require(["./mobile/components/user/userCenter/modify_password.vue"], resolve)
          },
          {
            path: "auth_google",
            name: "mobile/user/userCenter/auth_google",
            meta: {
              needEmail: true
            },
            component: resolve =>
              require(["./mobile/components/user/userCenter/auth_google.vue"], resolve)
          },
          {
            path: "payment",
            name: "mobile/user/userCenter/payment",
            meta: {
              needEmail: true
            },
            component: resolve =>
              require(["./mobile/components/user/userCenter/payment.vue"], resolve)
          }
        ]
      },
      {
        path: "myOrder",
        name: "mobile/myOrder",
        meta: {
          freeze: true
        },
        component: resolve =>
          require(["./mobile/components/order/myOrder.vue"], resolve)
      },
      {
        path: "buy",
        name: "mobile/buy",
        meta: {
          noLogin: true,
          freeze: true
        },
        component: resolve => require(["./mobile/components/ad/adList.vue"], resolve)
      },
      {
        path: "sell",
        name: "mobile/sell",
        meta: {
          noLogin: true,
          freeze: true
        },
        component: resolve => require(["./mobile/components/ad/adList.vue"], resolve)
      },
      {
        path: "detail",
        name: "mobile/detail",
        meta: {
          needEmail: true,
          freeze: true
        },
        component: resolve => require(["./mobile/components/ad/adDetail.vue"], resolve)
      },
      {
        path: "order",
        name: "mobile/order",
        meta: {
          needEmail: true,
          freeze: true
        },
        component: resolve => require(["./mobile/components/order/order.vue"], resolve)
      },
      {
        path: "asset",
        name: "mobile/asset",
        meta: {
          needEmail: true
        },
        component: resolve => require(["./mobile/components/asset/asset.vue"], resolve)
      },
      {
        path: "ad",
        name: "mobile/ad",
        meta: {
          needEmail: true,
          freeze: true
        },
        component: resolve => require(["./mobile/components/ad/ad.vue"], resolve)
      },
      {
        path: "myAd",
        name: "mobile/myAd",
        meta: {
          freeze: true
        },
        component: resolve => require(["./mobile/components/ad/myAd.vue"], resolve)
      },
      {
        path: "invite",
        name: "mobile/invite",
        meta: {
          freeze: true
        },
        component: resolve =>
          require(["./mobile/components/invite/invite_friends.vue"], resolve)
      }
    ]
  },
  {
    path: "*",
    component: resolve => require(["./pages/not-found.vue"], resolve)
  }
];

const router = new VueRouter({
  mode: "history",
  routes: routers
});

router.beforeEach((to, from, next) => {
  const judgeFrom = (name) => {
    if (from.name && from.name.indexOf(name) > -1) {
      LoadingBar.finish();
      return true;
    } else {
      return false;
    }
  };
  const judgeDevice = (nextPath) => {
    if(nextPath) {
      if (+store.state.device === 0) {
        if (nextPath.path.indexOf("/mobile") > -1) {
          next(Object.assign({
            path: nextPath.path.substring("/mobile".length)
          }, nextPath));
        } else {
          next();
        }
      } else {
        if (nextPath.path.indexOf("/mobile") > -1) {
          next();
        } else {
          next(Object.assign({
            path: "/mobile" + nextPath.path
          }, nextPath));
        }
      }
    } else {
      if (+store.state.device === 0) {
        if (to.fullPath.indexOf("/mobile") > -1) {
          next({
            path: to.fullPath.substring("/mobile".length)
          });
        } else {
          next();
        }
      } else {
        if (to.fullPath.indexOf("/mobile") > -1) {
          next();
        } else {
          next({
            path: "/mobile" + to.fullPath
          });
        }
      }
    }
  };
  LoadingBar.start();
  Util.title(to.meta.title);
  if (localStorage.getItem("userToken")) {
    if (to.matched.some(r => r.meta.noUser)) {  //登陆注册页面
      judgeFrom("home");
      judgeDevice({path: "/"});
    } else if (to.matched.some(r => r.meta.freeze) && store.state.userInfo.soft_disabled) { //账户软冻结
      judgeFrom("home");
      judgeDevice({path: "/"});
    } else if (to.matched.some(r => r.meta.needEmail) && !store.state.userInfo.activated) { //邮箱未验证
      //地址栏输入的from.name为空
      if (judgeFrom("user/login")) {
        store.commit("showAuthEmail_setter", 1);
      } else {
        judgeDevice({path: "/user/userCenter"});
      }
    } else {
      judgeDevice();
    }
  } else {
    if (to.matched.some(r => r.meta.noLogin)) {
      judgeDevice();
    } else {
      judgeFrom("user/login");
      judgeDevice({
        path: "/user/login",
        query: {redirect: to.fullPath}
      });
    }
  }
});
router.afterEach((to, from) => {
  LoadingBar.finish();
  window.scrollTo(0, 0);
  if (window.gtag) {
    gtag("event", to.fullPath, {
      from: from.fullPath,
      to: to.fullPath
    });
  }
});

export default router;
