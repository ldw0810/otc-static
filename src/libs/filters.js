import {BigNumber} from 'bignumber.js';

export default {
    install(Vue, options) {
        Vue.filter('capitalize', function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        });
        Vue.filter('fix_decimals', function (value, num) {
            return BigNumber(value).decimalPlaces(num).toString()
        });
        Vue.filter('txid_substr', function (value) {
            return value == null || value.toString().length === 0 ? '' : value.toString().substring(0, 29) + '...'
        });
    }
}