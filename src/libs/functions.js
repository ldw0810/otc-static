//公共方法(注意加$以区分)
import ajax from "./ajax";
import store from "../store/store";
import queryString from "querystring"; //解决post请求跨域问题
import {BigNumber} from "bignumber.js";
import {
  CONF_DECIMAL_ASSET,
  CONF_DECIMAL_BASE,
  CONF_DECIMAL_LEGAL,
  CONF_DIGITAL_CURRENCY_LIST,
  DEFAULT_LANGUAGE
} from "config/config";

/**
 * 设置bigNumber的全局参数
 */
// BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });
export const fixDecimal = function (value, limit) {
  return BigNumber(value + "")
    .decimalPlaces(limit, BigNumber.ROUND_FLOOR)
    .toFixed(limit)
    .toString();
};
export const fixDecimalsAsset = function (value) {
  return fixDecimal(value, CONF_DECIMAL_ASSET);
};

export const fixDecimalsBase = function (value) {
  return fixDecimal(value, CONF_DECIMAL_BASE);
};

export const fixDecimalsLegal = function (value) {
  return fixDecimal(value, CONF_DECIMAL_LEGAL);
};

export default {
  install(Vue, options) {
    Vue.prototype.$ = function (id) {
      return document.getElementById(id);
    };
    // Vue.prototype.$schema = schema;
    Vue.prototype.$queryString = queryString;
    Vue.prototype.$ajax = ajax;

    /** 资产小数位数相关 */
    Vue.prototype.$fixDecimal = fixDecimal;
    /**
     * 资产默认位数
     */
    Vue.prototype.$fixDecimalsAsset = fixDecimalsAsset;
    /**
     * 数字币基本位数
     */
    Vue.prototype.$fixDecimalsBase = fixDecimalsBase;
    /**
     * 法币显示位数
     */
    Vue.prototype.$fixDecimalsLegal = fixDecimalsLegal;
    /**
     * 加法（解决精度问题）
     */
    Vue.prototype.$plus = function (...args) {
      if (args.length !== 2) {
        throw Error("Must set two params");
      }
      const bigNumber = new BigNumber(args[0]);
      return bigNumber.plus(args[1]);
    };
    /**
     * 减法（解决精度问题）
     */
    Vue.prototype.$minus = function (...args) {
      if (args.length !== 2) {
        throw Error("Must set two params");
      }
      const bigNumber = new BigNumber(args[0]);
      return bigNumber.minus(args[1]);
    };
    /**
     * 乘法（解决精度问题）
     */
    Vue.prototype.$multipliedBy = function (...args) {
      if (args.length !== 2) {
        throw Error("Must set two params");
      }
      const bigNumber = new BigNumber(args[0]);
      return bigNumber.multipliedBy(args[1]);
    };
    /**
     * 除法（解决精度问题）
     */
    Vue.prototype.$dividedBy = function (...args) {
      if (args.length !== 2) {
        throw Error("Must set two params");
      }
      const bigNumber = new BigNumber(args[0]);
      return bigNumber.dividedBy(args[1])
    };
    /**
     * 根据参数定义显示资产位数
     */
    Vue.prototype.$fixDecimalAuto = function (value, currency) {
      if (currency && store.state.code.payable.indexOf(currency) > -1) {
        return fixDecimalsLegal(value);
      }
      return fixDecimalsBase(value);
    };
    /*路由相关*/
    Vue.prototype.$open = function (url, query, onComplete, onAbort) {
      const {href} = this.$router.resolve({path: url, query: query});
      window.open(href, '_blank');
    };
    Vue.prototype.$goRouter = function (url, query, onComplete, onAbort) {
      if (url && url.length) {
        this.$router.push({path: url, query: query}, onComplete, onAbort);
      } else {
        // this.$Message.error(this.$t("public.url_notFound"));
      }
    };
    Vue.prototype.$goBack = function () {
      this.$router.go(-1);
    };
    Vue.prototype.$goRefresh = function () {
      this.$router.go(0);
    };
    //替换当前页面地址
    Vue.prototype.$goReplace = function (name, query, delParams, onComplete, onAbort) {
      let index = 0;
      let url = name;
      if (query) {
        for (let key in query) {
          if (key && key !== delParams && (query[key] || query[key] === 0)) {
            url += index === 0 ? "?" : "&";
            url += key + "=" + query[key];
            index++;
          }
        }
      }
      return this.$router.replace(url, onComplete, onAbort);
    };
    /*用户相关*/
    Vue.prototype.$saveUser = function (userName) {
      let userList = JSON.parse(
        window.localStorage.getItem("userList") || "[]"
      );
      userList[userList.length] = userName;
      userList = Array.from(new Set(userList));
      window.localStorage.setItem("userList", JSON.stringify(userList));
    };
    Vue.prototype.$getLanguage = function () {
      let ln = window.localStorage.getItem("language") || DEFAULT_LANGUAGE;
      if (["zh-HK", "zh-TW"].contains(ln)) {
        ln = "zh-TW";
      } else if (ln !== "zh-CN") {
        ln = "en";
      }
      return ln;
    };
    Vue.prototype.$getUserList = function (userName) {
      return JSON.parse(window.localStorage.getItem("userList") || "[]");
    };
    /*密码*/
    Vue.prototype.$checkPassword = function (password) {
      let level = 0;
      if (!password || password.length < 6) {
      } else {
        if (password.match(/[a-z]/g)) {
          level++;
        }
        if (password.match(/[0-9]/g)) {
          level++;
        }
        if (password.match(/(.[^a-z0-9])/g)) {
          level++;
        }
        if (password.length < 6) {
          level = 0;
        }
        if (level > 3) {
          level = 3;
        }
      }
      return level;
    };
    /*其他*/
    String.prototype.format = function () {
      if (arguments.length === 0) return this;
      let param = arguments[0];
      let s = this;
      if (typeof param === "object") {
        for (let key in param)
          s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
      } else {
        for (let i = 0; i < arguments.length; i++)
          s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
      }
    };
    Date.prototype.format = function (format) {
      let date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (let k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? date[k]
              : ("00" + date[k]).substr(("" + date[k]).length)
          );
        }
      }
      return format;
    };
    Array.prototype.contains = function (needle) {
      for (let i in this) {
        if (this[i] === needle) return true;
      }
      return false;
    };
  }
};
