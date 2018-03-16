import Vue from "vue";
import globalComponents from '@/config/global-components';
import {DEFAULT_LANGUAGE} from "config/config";
import router from "./router";
import Vuex from "vuex";
import App from "./app.vue";
import Functions from "./libs/functions";
import Filters from "./libs/filters";
import "@/style/lib/index.less";
import "@/style/index.scss";
import store from "./store/store";
import VueI18n from "vue-i18n";
import languageData from "./locale";
import VueClipboard from "vue-clipboard2";

Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(globalComponents);
Vue.use(Functions);
Vue.use(Filters);
Vue.use(VueClipboard);

// 自动设置语言
const navLang = navigator.language || navigator.userLanguage;
const langs = ['zh-CN', 'zh-HK', 'en-US'];
const localLang = langs.indexOf(navLang) > -1 ? navLang : DEFAULT_LANGUAGE;
const currentLanguage = window.localStorage.getItem("language");
let lang;
if (currentLanguage) {
  lang = currentLanguage
} else {
  window.localStorage.setItem('language', localLang);
  lang = localLang
}
Vue.config.lang = lang;

// 多语言配置
for (let i = 0; i < languageData.length; i++) {
  Vue.locale(languageData[i].language, languageData[i].data);
}

new Vue({
  el: "#app",
  router: router,
  store: store,
  render: h => h(App)
});
