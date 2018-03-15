import isArray from 'lodash/isArray'
import isString from 'lodash/isString'

// 验证表单，暴露 validate 实时暴露验证结果
export default (form) => {
  if (isArray(form)) {
    const validate = {};
    const methods = {};
    form.map(item => {
      validate[item] = false;
      methods[`checkValidate_${item}`] = function (bool) {
        this.validate[item] = bool;
      };
      return item;
    });

    return {
      data() {
        return {
          validate
        };
      },
      methods,
    };
  } else if (isString(form)) {
    return {
      data() {
        return {
          validate: false
        };
      },
      methods: {
        checkValidate(bool) {
          this.validate = bool;
        },
      }
    };
  }
  throw new Error("Need the correct parameters.");
};
