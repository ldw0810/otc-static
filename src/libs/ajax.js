import axios from 'axios'
import env from '../config/env';
import store from "../store/store";
import router from "../router";
import Alert from '@/components/public/alert';
import languageData from '../locale';
import {DEFAULT_LANGUAGE} from "config/config";

/**
 * Responsible for all HTTP requests.
 */

axios.defaults.timeout = 20000;
axios.defaults.baseURL = env === 'development' ? '/' : "https://alpha.otcmaker.com";

function languageSelectIndex() {
  let index = 0;
  for (let i = 0; i < languageData.length; i++) {
    if (languageData[i].language === (window.localStorage.getItem("language") || DEFAULT_LANGUAGE)) {
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
      const errMsg = languageData[index].data.request["" + error.response.data.error];
      if (error.response.data) {
        if (+error.response.data.error === 999999) {
          store.commit("delToken");
          Alert.error({
            title: languageData[index].data.public.error_title_default,
            content: languageData[index].data.request["" + error.response.data.error],
            onCancel: router.push("/user/login")
          });
        } else if (+error.response.data.error === 100031) {
          // store.commit("showAuthEmail_setter", 1);
        } else if ([100017, 100021, 100033, 100036, 100038, 100039].contains(+error.response.data.error)) {
        } else {
          errMsg && Alert.error({
            title: languageData[index].data.public.error_title_default,
            content: errMsg
          });
        }
      }
    } else if(error.message) {
      error.response = {
        data: error.message
      }
    }
    return Promise.reject(error.response.data)
  });

export default axios;