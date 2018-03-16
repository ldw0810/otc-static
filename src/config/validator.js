import languageData from "../locale";
const language = languageData.find(
  item => item.language === (window.localStorage.getItem("language") || "zh-HK")
).data;

// 昵称
export const VALI_NICKNAME = {
  min: 6,
  max: 16,
  message: language.user.userName_notValid
};

// 支付宝名称
export const VALI_ALIPAY_NAME = {
  min: 2,
  max: 20,
  message: language.validate.alipay_name_range
};
// 支付宝账号
export const VALI_ALIPAY_ACCOUNT = {
  min: 4,
  max: 40,
  message: language.validate.alipay_account_range
};
// 银行卡姓名
export const VALI_CARD_HOLDER = {
  min: 2,
  max: 20,
  message: language.validate.card_holder_range
};
// 银行卡卡号
export const VALI_CARD_NUMBER = {
  min: 10,
  max: 20,
  message: language.validate.card_number_range
};
// 提现地址标签
export const VALI_ADDRESS_LABEL = {
  min: 2,
  max: 16,
  message: language.validate.address_label
};
// 发广告备注信息
export const VALI_AD_REMARK = {
  max: 500,
  message: language.validate.max_length.format(500)
};
// 聊天输入框
export const VALI_CHAT = {
  max: 200,
  message: language.validate.max_length.format(1000)
};
// 付款留言
export const VALI_PAYMENT_INFO = {
  max: 200,
  message: language.validate.max_length.format(200)
};
// 
export const VALI_NUMBER = {
  regexp: (value) => {
    return new RegExp('^[0-9]+$', 'g').test(value)
  },
  message: language.validate.must_be_number
}

export const VALI_NUMBER_CALLBACK = (rule, value, callback) => {
  if (value && !VALI_NUMBER.regexp(value)) {
    callback(new Error(VALI_NUMBER.message))
  } else {
    callback();
  }
}

