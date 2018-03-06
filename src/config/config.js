import Env from './env';

let config = {
    env: Env,
    webSocketUrl: "wss://alpha.otcmaker.com:8080/",
    poundage: 0.005,
    limit: 500
};

export const decimalAsset = 8 // 资产显示统一保留8位小数
export const decimalBase = 4 // 基本资产保留4位小数
export const decimalLegal = 2 // 法币保留2位


export default config;