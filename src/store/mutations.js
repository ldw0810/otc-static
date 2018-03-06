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
  userInfo_phone_number_setter(state, value) {
    state.userInfo.phone_number = value;
  },
  userInfo_mobile_setter(state, value) {
    state.userInfo.mobile = value;
  },
  userInfo_app_two_factor_setter(state, value) {
    state.userInfo.app_two_factor = value;
  },
  userInfo_notice_setter(state, value) {
    state.userInfo.notice = value;
  },
  collection_setter(state, value) {
    state.collection = value;
  },
  collection_close_poptip(state, value) {
    state.collection[value].visible = false;
  },
  banks_setter(state, value) {
    state.banks = value;
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
  saveToken(state, value) {
    localStorage.userToken = value;
    state.userToken = value;
  },
  delToken(state) {
    localStorage.removeItem("userToken");
    state.userToken = null;
  },
};
