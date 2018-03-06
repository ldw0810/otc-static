export default {
    header_index: 0,    //顶部菜单坐标
    layer_index: 1,   //layer层级坐标，默认main层：1，蒙层：2
    footer_is_login: false, //底部footer是否在login、register页面
    user_sider_index: 0,    //个人中心页面的侧边栏坐标

    pinCodeValue: "",   //PIN码的值
    pinCodeRefresh: 0,  //是否刷新PIN码

    googleKey: "", //谷歌验证码
    googleCode: "",     //谷歌二维码的值
    loginInfo: {
        email: "",
        password: ""
    },
    userInfo: { //用户信息
        id:"",
        display_name: "",
        nickname: "",
        email: "",
        phone_number: "",
        activated: false,
        invite: "",
        valid_account: [
            // {
            //     "currency": "eth",
            //     "balance": "0.0",
            //     "locked": "0.0",
            //     "amount": "0.0"
            // },
        ],
        mobile: false,
        app_two_factor: false,
        omt:{},
        stat: {
            trade_count: 0,
            good_count: 0,
            good_rate: "0"
        },
        default_collection: {
            kind: "",   //alipay || bank
            account: "",
            bank: "",
            bank_name: "",
            account_display:"",
        },
    },
    collection: [],
    collection_refresh: 0,  //是否刷新收款方式

    banks: [],
    currencyList: ["dai", "eth"],
    // moneyList: ["CNY", "USD"],
    paymentList: ["alipay", "bank"],
    userToken: null,  //登录后header必携带
    showAuthEmail: false,
    ajax_source: null
}