import store from "./store/store";
import Util from "./libs/util";
import Vue from "vue";
import {LoadingBar} from "iview";
import VueRouter from "vue-router";

Vue.use(VueRouter);
if (localStorage.getItem("userToken") && !store.state.userToken) {
  store.commit("saveToken", localStorage.getItem("userToken"));
}
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
        path: "/policy",
        name: "/policy",
        meta: {
          noLogin: true
        },
        component: resolve =>
          require(["./components/policy/index.vue"], resolve)
      },
      {
        path: "/user/login",
        meta: {
          noLogin: true,
          noUser: true
        },
        component: resolve => require(["./components/user/login.vue"], resolve),
        children: [
          {
            path: "/",
            name: "/user/login",
            component: resolve =>
              require(["./components/user/login/index.vue"], resolve)
          },
          {
            path: "modify_password",
            name: "/user/login/modify_password",
            component: resolve =>
              require(["./components/user/login/modify_password.vue"], resolve)
          },
          {
            path: "forget_password",
            name: "/user/login/forget_password",
            component: resolve =>
              require(["./components/user/login/forget_password.vue"], resolve)
          },
          {
            path: "validate",
            name: "/user/login/validate",
            component: resolve =>
              require(["./components/user/login/validate.vue"], resolve)
          }
        ]
      },
      {
        path: "/user/register",
        name: "/user/register",
        meta: {
          noLogin: true,
          noUser: true
        },
        component: resolve =>
          require(["./components/user/register.vue"], resolve)
      },
      {
        path: "/user/userCenter",
        component: resolve =>
          require(["./components/user/userCenter.vue"], resolve),
        children: [
          {
            path: "/",
            name: "/user/userCenter",
            component: resolve =>
              require(["./components/user/userCenter/userInfo.vue"], resolve)
          },
          {
            path: "securitySetting",
            name: "/user/userCenter/securitySetting",
            component: resolve =>
              require([
                "./components/user/userCenter/securitySetting.vue"
              ], resolve)
          },
          {
            path: "modify_password",
            name: "/user/userCenter/modify_password",
            component: resolve =>
              require([
                "./components/user/userCenter/modify_password.vue"
              ], resolve)
          },
          {
            path: "auth_google",
            name: "/user/userCenter/auth_google",
            meta: {
              needEmail: true
            },
            component: resolve =>
              require(["./components/user/userCenter/auth_google.vue"], resolve)
          },
          {
            path: "payment",
            name: "/user/userCenter/payment",
            meta: {
              needEmail: true
            },
            component: resolve =>
              require(["./components/user/userCenter/payment.vue"], resolve)
          }
        ]
      },
      {
        path: "/myOrder",
        name: "/myOrder",
        component: resolve =>
          require(["./components/order/myOrder.vue"], resolve)
      },
      {
        path: "/buy",
        name: "/buy",
        meta: {
          noLogin: true
        },
        component: resolve => require(["./components/ad/adList.vue"], resolve)
      },
      {
        path: "/sell",
        name: "/sell",
        meta: {
          noLogin: true
        },
        component: resolve => require(["./components/ad/adList.vue"], resolve)
      },
      {
        path: "/detail",
        name: "/detail",
        meta: {
          needEmail: true
        },
        component: resolve => require(["./components/ad/adDetail.vue"], resolve)
      },
      {
        path: "/order",
        name: "/order",
        meta: {
          needEmail: true
        },
        component: resolve => require(["./components/order/order.vue"], resolve)
      },
      {
        path: "/asset",
        name: "/asset",
        meta: {
          needEmail: true
        },
        component: resolve => require(["./components/asset/asset.vue"], resolve)
      },
      {
        path: "/ad",
        name: "/ad",
        meta: {
          needEmail: true
        },
        component: resolve => require(["./components/ad/ad.vue"], resolve)
      },
      {
        path: "/myAd",
        name: "/myAd",
        component: resolve => require(["./components/ad/myAd.vue"], resolve)
      },
      {
        path: "/invite",
        name: "/invite",
        component: resolve =>
          require(["./components/invite/invite_friends.vue"], resolve)
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
  LoadingBar.start();
  const goFun = () => {
    if (to.matched.some(r => r.meta.noUser)) {
      if (from.name === "home") {
        LoadingBar.finish();
      }
      next({path: "/"});
    } else if (to.matched.some(r => r.meta.needEmail) && !store.state.userInfo.activated) {
      //地址栏输入的from.name为空
      if (from.name && from.name.indexOf("/user/login") <= -1) {
        LoadingBar.finish();
        store.commit("showAuthEmail_setter", 1);
      } else {
        next({path: "/user/userCenter"});
      }
    } else {
      next();
    }
  };

  Util.title(to.meta.title);
  if (localStorage.getItem("userToken")) {
    if (store.state.userInfo.id) {
      store.dispatch("ajax_me");
      goFun();
    } else {
      store.dispatch("ajax_me").then(res => {
        if (res.data && +res.data.error === 0) {
          goFun();
        } else {
          next({path: "/user/userCenter"});
        }
      }).catch(err => {
        next({path: "/user/userCenter"});
      });
    }
  } else {
    if (to.matched.some(r => r.meta.noLogin)) {
      next();
    } else {
      next({
        path: "/user/login",
        query: {redirect: to.fullPath}
      });
      if (from.name === "/user/login") {
        LoadingBar.finish();
      }
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
