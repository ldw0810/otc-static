import Env from "./env";
import { BigNumber } from "bignumber.js";

let config = {
  env: Env,
  webSocketUrl: "wss://alpha.otcmaker.com:8080/",
  poundage: 0.005,
  limit: 500
};

export const decimalAsset = 8; // 资产显示统一保留8位小数
export const decimalBase = 4; // 基本资产保留4位小数
export const decimalLegal = 2; // 法币保留2位

export function fixDecimal(value, limit) {
  return BigNumber(value + "")
    .decimalPlaces(limit)
    .toFixed(limit)
    .toString();
}

export function fixDecimalsAsset(value) {
  return fixDecimal(value, decimalAsset);
}

export function fixDecimalsBase(value) {
  return fixDecimal(value, decimalBase);
}

export function fixDecimalsLegal(value) {
  return fixDecimal(value, decimalLegal);
}

export const DigitalCurrency = ["DAI", "ETH"]; // 当前平台支持的数字币
export const legalTender = ["CNY"]; // 当前平台支持的法币

export default config;
