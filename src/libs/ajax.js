import axios from 'axios'
import env from '../config/env';
import store from "../store/store"
import router from "../router"
import { Message } from 'iview';
import languageData from '../locale'
/**
 * Responsible for all HTTP requests.
 */

const ajaxUrl = env === 'development' ? '/' :
    env === 'production' ? '/' : 'https://otcmaker.itering.com';

axios.defaults.timeout = 10000;
axios.defaults.baseURL = ajaxUrl;

function languageSelectIndex() {
    let index = 0;
    for (let i = 0; i < languageData.length; i++) {
        if (languageData[i].language === (window.localStorage.getItem("language") || "zh-CN")) {
            index = i;
        }
    }
    return index;
}

// http request 拦截器
axios.interceptors.request.use(
    config => {
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
            if (error.response.data) {
                if (+error.response.data.error === 999999) {
                    Message.error(languageData[index].data.request["" + error.response.data.error]);
                    store.commit("delToken");
                    store.commit("delUserInfo");
                    router.push("/user/login");
                } else if(+error.response.data.error === 100031){
                    store.commit("showAuthEmail_setter", 1);
                }else if ([100017, 100038].contains(+error.response.data.error)) {
                } else {
                    Message.error(languageData[index].data.request["" + error.response.data.error]);
                }
            }
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data)
    });

export default axios;