//公共方法(注意加$以区分)
import ajax from './ajax'
import queryString from 'querystring'   //解决post请求跨域问题
// import schema from 'async-validator';    //异步验证

export default {
    install(Vue, options) {
        Vue.prototype.$ = function (id) {
            return document.getElementById(id);
        };
        // Vue.prototype.$schema = schema;
        Vue.prototype.$queryString = queryString;
        Vue.prototype.$ajax = ajax;

        /*路由相关*/
        Vue.prototype.$goRouter = function (url, query) {
            if (url && url.length) {
                this.$router.push({path: url, query: query})
            } else {
                this.$Message.error(this.$t("public.url_notFound"));
            }
        };
        Vue.prototype.$goBack = function () {
            this.$router.go(-1);
        };
        Vue.prototype.$goRefresh = function () {
            this.$router.go(0);
        };
        /*用户相关*/
        Vue.prototype.$saveUser = function (userName) {
            let userList = JSON.parse(window.localStorage.getItem("userList") || "[]");
            userList[userList.length] = userName;
            userList = Array.from(new Set(userList));
            window.localStorage.setItem("userList", JSON.stringify(userList));
        };
        Vue.prototype.$getUserList = function (userName) {
            return JSON.parse(window.localStorage.getItem("userList") || "[]");
        };


        String.prototype.format = function () {
            if (arguments.length === 0) return this;
            let param = arguments[0];
            let s = this;
            if (typeof(param) === 'object') {
                for (let key in param)
                    s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
                return s;
            } else {
                for (let i = 0; i < arguments.length; i++)
                    s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
                return s;
            }
        };
        Date.prototype.format = function (format) {
            let date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (let k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length === 1
                        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        };
        Array.prototype.contains = function (needle) {
            for (let i in this) {
                if (this[i] === needle) return true;
            }
            return false;
        }
    }
}