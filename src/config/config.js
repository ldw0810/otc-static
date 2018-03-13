import Env from "./env";

let config = {
  env: Env,
  webSocketUrl: "wss://alpha.otcmaker.com:8080/",
  poundage: 0.005,
  limit: 500
};

/*
 资产小数位数相关
*/
export const CONF_DECIMAL_ASSET = 8; // 资产显示统一保留8位小数
export const CONF_DECIMAL_BASE = 4; // 基本资产保留4位小数
export const CONF_DECIMAL_LEGAL = 2; // 法币保留2位

export const CONF_DIGITAL_CURRENCY_LIST = ["DAI", "ETH"]; // 当前平台支持的数字币
export const CONF_LEGAL_CURRENCY_LIST = ["CNY"]; // 当前平台支持的法币

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
]

export default config;
