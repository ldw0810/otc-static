//公共方法(注意加$以区分)
import ajax from "./ajax";
import store from "../store/store";
import queryString from "querystring"; //解决post请求跨域问题
import { BigNumber } from "bignumber.js";
import {
  CONF_DECIMAL_ASSET,
  CONF_DECIMAL_BASE,
  CONF_DECIMAL_LEGAL,
  CONF_DIGITAL_CURRENCY_LIST
} from "config/config";

/**
 * 设置bigNumber的全局参数
 */
// BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

export const fixDecimal = function(value, limit) {
  return BigNumber(value + "")
    .decimalPlaces(limit, BigNumber.ROUND_FLOOR)
    .toFixed(limit)
    .toString();
};
export const fixDecimalsAsset = function(value) {
  return fixDecimal(value, CONF_DECIMAL_ASSET);
};

export const fixDecimalsBase = function(value) {
  return fixDecimal(value, CONF_DECIMAL_BASE);
};

export const fixDecimalsLegal = function(value) {
  return fixDecimal(value, CONF_DECIMAL_LEGAL);
};

export default {
  install(Vue, options) {
    Vue.prototype.$ = function(id) {
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
    Vue.prototype.$plus = function(...args) {
      if (args.length !== 2) {
        throw Error("Must set two params");
      }
      const bigNumber = new BigNumber(args[0]);
      return bigNumber.plus(args[1]);
    };
    /**
     * 减法（解决精度问题）
     */
    Vue.prototype.$minus = function(...args) {
      if (args.length !== 2) {
        throw Error("Must set two params");
      }
      const bigNumber = new BigNumber(args[0]);
      return bigNumber.minus(args[1]);
    };
    /**
     * 乘法（解决精度问题）
     */
    Vue.prototype.$multipliedBy = function(...args) {
      if (args.length !== 2) {
        throw Error("Must set two params");
      }
      const bigNumber = new BigNumber(args[0]);
      return bigNumber.multipliedBy(args[1]);
    };
    /**
     * 除法（解决精度问题）
     */
    Vue.prototype.$dividedBy = function(...args) {
      if (args.length !== 2) {
        throw Error("Must set two params");
      }
      const bigNumber = new BigNumber(args[0]);
      return bigNumber.dividedBy(args[1])
    };
    /**
     * 根据参数定义显示资产位数
     */
    Vue.prototype.$fixDecimalAuto = function(value, currency) {
      if (currency && store.state.code.payable.indexOf(currency) > -1) {
        return fixDecimalsLegal(value);
      }
      return fixDecimalsBase(value);
    };
    /*路由相关*/
    Vue.prototype.$goRouter = function(url, query) {
      if (url && url.length) {
        this.$router.push({ path: url, query: query });
      } else {
        // this.$Message.error(this.$t("public.url_notFound"));
      }
    };
    Vue.prototype.$goBack = function() {
      this.$router.go(-1);
    };
    Vue.prototype.$goRefresh = function() {
      this.$router.go(0);
    };
    /*用户相关*/
    Vue.prototype.$saveUser = function(userName) {
      let userList = JSON.parse(
        window.localStorage.getItem("userList") || "[]"
      );
      userList[userList.length] = userName;
      userList = Array.from(new Set(userList));
      window.localStorage.setItem("userList", JSON.stringify(userList));
    };
    Vue.prototype.$getUserList = function(userName) {
      return JSON.parse(window.localStorage.getItem("userList") || "[]");
    };

    String.prototype.format = function() {
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
    Date.prototype.format = function(format) {
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
    Array.prototype.contains = function(needle) {
      for (let i in this) {
        if (this[i] === needle) return true;
      }
      return false;
    };
  }
};
