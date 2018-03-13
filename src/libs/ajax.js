import axios from 'axios'
import env from '../config/env';
import store from "../store/store"
import router from "../router"
import {Message} from 'iview';
import languageData from '../locale'

/**
 * Responsible for all HTTP requests.
 */

axios.defaults.timeout = 15000;
axios.defaults.baseURL = env === 'development' ? '/' : "https://apialpha.otcmaker.com";

function languageSelectIndex() {
  let index = 0;
  for (let i = 0; i < languageData.length; i++) {
    if (languageData[i].language === (window.localStorage.getItem("language") || "zh-HK")) {
      index = i;
    }
  }
  return index;
}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (store.state.userToken) {
      config.headers.Authorization = `${store.state.userToken}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      const index = languageSelectIndex();
      if (+error.response.status === 504) { //服务器超时应退出登陆状态
      } else if (error.response.data) {
        if (+error.response.data.error === 999999) {
          store.commit("delToken");
          Message.error({
            content: languageData[index].data.request["" + error.response.data.error],
            onClose: router.push("/user/login")
          });
        } else if (+error.response.data.error === 100031) {
          // store.commit("showAuthEmail_setter", 1);
        } else if ([100017, 100036, 100038].contains(+error.response.data.error)) {
        } else {
          Message.error(languageData[index].data.request["" + error.response.data.error]);
        }
      }
    } else if(error.message) {
      error.response = {
        data: error.message
      };
    }
    return Promise.reject(error.response.data)
  });

export default axios;