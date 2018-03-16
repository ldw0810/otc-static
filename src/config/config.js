import Env from "./env";

let config = {
  env: Env,
};

export const CONF_PAYMENT_LIST = ["alipay", "bank"]; // 支付方式
/*
 资产小数位数相关
*/
export const CONF_DECIMAL_ASSET = 8; // 资产显示统一保留8位小数
export const CONF_DECIMAL_BASE = 4; // 基本资产保留4位小数
export const CONF_DECIMAL_LEGAL = 2; // 法币保留2位

export const CONF_DIGITAL_CURRENCY_LIST = [ // 当前平台支持的数字币
  {
    currency: "dai",  //货币
    targetCurrency: "cny",  //目标货币
    buyLimit: 0,  //最小购买交易数:cny
    sellLimit: 50,  //最小出售交易数:cny
  },
  {
    currency: "dai",  //货币
    targetCurrency: "usd",  //目标货币
    buyLimit: 0,  //最小购买交易数:usd
    sellLimit: 50,  //最小出售交易数:usd
  },
  {
    currency: "eth",
    targetCurrency: "dai",
    buyLimit: 50,  //最小购买交易数:dai
    sellLimit: 0.01,  //最小出售交易数:dai
  },
];

/**
 * 矿工费
 */
export const CONF_MINERSFEE = [
  {
    name: 'dai',
    fee: 1
  },
  {
    name: 'eth',
    fee: 0.005
  }
];
export const DEFAULT_LANGUAGE = "zh-HK";  //默认语言

// export const webSocketUrl = "wss://alpha.otcmaker.com:8080/";
export default config;
