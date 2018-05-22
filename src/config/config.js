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

export const DEFAULT_LANGUAGE = "zh-HK";  //默认语言
export const CURRENT_lANGUAGE = window.localStorage.getItem('language') || DEFAULT_LANGUAGE; // 当前语言
export const CHAT_URL = "https://notice.otcmaker.com/chat"; //聊天接口URL
export const AJAX_TIMEOUT = 20000;  //ajax请求的超时时间
export const AJAX_BASEURL = Env === "development" ? "https://alpha.otcmaker.com": "https://www.otcmaker.com";  //ajax请求的地址
export const ZENDESK_DOMAIN_URL = "https://otcmaker.zendesk.com";  //zendesk地址

export const OMT_SHOW = false;  //是否展示注册送omt


const postfixImg =  CURRENT_lANGUAGE.toLowerCase();

// 轮播图
export const HOME_CAROUSEL = {
  defaultIndex: 1,  //默认从第几张图片开始展示(默认第1张，为1)
  speed: 5000,  //轮播图片速度(ms)
  list: [  //轮播图片列表,当数量为1时不轮播
    {
      img: require(`../static/images/home/banner1-${postfixImg}.png`),
      url: "/"
    },
    {
      img: require(`../static/images/home/banner2-${postfixImg}.png`),
      url: "/invite"
    }
  ]
};

// 邀请页面图片
export const CONF_INVITE_BANNER = require(`../static/images/home/banner2-${postfixImg}.png`);
export const CONF_INVITE_IMAGE = require(`../static/images/invite_${postfixImg}.jpg`);

export default config;
