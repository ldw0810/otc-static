import { BigNumber } from "bignumber.js";
import { fixDecimalsAsset } from "./functions";

export default {
  install(Vue, options) {
    Vue.filter("capitalize", function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    });
    Vue.filter("fix_decimals", function(value, num) {
      return BigNumber(value)
        .decimalPlaces(num)
        .toString();
    });
    // 资产显示统一保留位数
    Vue.filter("fix_decimals_assets", value => {
      return fixDecimalsAsset(value);
    });
    Vue.filter("txid_substr", function(value) {
      return value == null || value.toString().length === 0
        ? ""
        : value.toString().substring(0, 29) + "...";
    });
  }
};
