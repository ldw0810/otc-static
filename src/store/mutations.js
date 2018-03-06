export default {
  header_index_setter(state, value) {
    state.header_index = value;
  },
  layer_index_setter(state, value) {
    state.layer_index = value;
  },
  footer_is_login_setter(state, value) {
    state.footer_is_login = value;
  },
  user_sider_index_setter(state, value) {
    state.user_sider_index = value;
  },
  pinCodeValue_setter(state, value) {
    state.pinCodeValue = value.toUpperCase();
  },
  pinCodeRefresh_setter(state, value) {
    state.pinCodeRefresh = value;
  },
  googleKey_setter(state, value) {
    state.googleKey = value;
  },
  googleCode_setter(state, value) {
    state.googleCode = value;
  },
  loginInfo_setter(state, value) {
    state.loginInfo = value;
  },
  userInfo_setter(state, value) {
    state.userInfo = value;
  },
  userInfo_display_name_setter(state, value) {
    state.userInfo.display_name = value;
  },
  userInfo_nickname_setter(state, value) {
    state.userInfo.nickname = value;
  },
  userInfo_email_setter(state, value) {
    state.userInfo.email = value;
  },
  userInfo_phone_number_setter(state, value) {
    state.userInfo.phone_number = value;
  },
  userInfo_activated_setter(state, value) {
    state.userInfo.activated = value;
  },
  userInfo_invite_setter(state, value) {
    state.userInfo.invite = value;
  },
  userInfo_valid_accounts_setter(state, value) {
    state.userInfo.valid_account = value;
  },
  userInfo_stat_setter(state, value) {
    state.userInfo.stat = value;
  },
  userInfo_default_collection_setter(state, value) {
    state.userInfo.default_collection = value.map(item => {
      item.visible = false;
      return item;
    });
  },
  userInfo_mobile_setter(state, value) {
    state.userInfo.mobile = value;
  },
  userInfo_app_two_factor_setter(state, value) {
    state.userInfo.app_two_factor = value;
  },
  collection_setter(state, value) {
    state.collection = value;
  },
  collection_close_poptip(state, value) {
    state.collection[value].visible = false;
  },
  collection_refresh_setter(state, value) {
    state.collection_refresh = value;
  },
  banks_setter(state, value) {
    state.banks = value;
  },
  userToken_setter(state, value) {
    state.userToken = value;
  },
  loginFlag_setter(state, value) {
    state.loginFlag = value;
  },
  saveToken(state, value) {
    localStorage.userToken = value;
    state.userToken = value;
  },
  saveUserInfo(state, value) {
    state.userInfo = value;
    state.loginFlag = true;
  },
  delToken(state) {
    localStorage.removeItem("userToken");
    state.userToken = null;
  },
  delUserInfo(state) {
    state.userInfo = {
      id: ""
    };
    state.loginFlag = false;
  },
  showAuthEmail_setter(state, value) {
    if (value) {
      state.showAuthEmail = !value;
    }
    state.showAuthEmail = value;
  },
  ajax_source_setter(state, value) {
    state.ajax_source = value;
  },
};
