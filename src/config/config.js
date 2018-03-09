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
export const decimalAsset = 8; // 资产显示统一保留8位小数
export const decimalBase = 4; // 基本资产保留4位小数
export const decimalLegal = 2; // 法币保留2位
export const digitalCurrencyList = ["DAI", "ETH"]; // 当前平台支持的数字币
export const legalCurrencyList = ["CNY"]; // 当前平台支持的法币

export default config;
