<template>
    <form :class="classes" :autocomplete="autocomplete" @monitorEvent='monitorEvent'><slot></slot></form>
</template>
<script>
// https://github.com/ElemeFE/element/blob/dev/packages/form/src/form.vue
import { oneOf } from "../../utils/assist";

const prefixCls = "ivu-form";

export default {
  name: "iForm",
  props: {
    model: {
      type: Object
    },
    rules: {
      type: Object
    },
    labelWidth: {
      type: Number
    },
    labelPosition: {
      validator(value) {
        return oneOf(value, ["left", "right", "top"]);
      },
      default: "right"
    },
    inline: {
      type: Boolean,
      default: false
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    autocomplete: {
      validator(value) {
        return oneOf(value, ["on", "off"]);
      },
      default: "off"
    }
  },
  data() {
    return {
      fields: []
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-label-${this.labelPosition}`,
        {
          [`${prefixCls}-inline`]: this.inline
        }
      ];
    }
  },
  methods: {
    validateStatus() {
      let valid = true;
      this.fields.forEach(field => {
        field.checkValidateStatus(errors => {
          if (errors) {
            valid = false;
          }
        });
      });
      return valid;
    },
    monitorEvent() {
      const result = this.validateStatus();
      this.$emit("checkValidate", result);
    },
    resetFields() {
      this.fields.forEach(field => {
        field.resetField();
      });
    },
    validate(callback) {
      return new Promise(resolve => {
        let valid = true;
        let count = 0;
        this.fields.forEach(field => {
          field.validate("", errors => {
            if (errors) {
              valid = false;
            }
            if (++count === this.fields.length) {
              // all finish
              resolve(valid);
              if (typeof callback === "function") {
                callback(valid);
              }
            }
          });
        });
      });
    },
    validateField(prop, cb) {
      const field = this.fields.filter(field => field.prop === prop)[0];
      if (!field) {
        throw new Error(
          "[iView warn]: must call validateField with valid prop string!"
        );
      }

      field.validate("", cb);
    },
    /**
     * @augments options { prop, message }
     */
    forcedError(options) {
      if (!Array.isArray(options)) {
        throw Error("Params must be array");
      }
      if (options.length) {
        this.fields.forEach(field => {
          const reslut = options.find(item => item.prop === field.prop)
          if (reslut) {
            field.forcedError(reslut.message)
          }
        });
      }
    }
  },
  watch: {
    rules() {
      this.validate();
    }
  },
  created() {
    this.monitorEvent();
    this.$on("on-form-item-change", field => {
      this.monitorEvent();
    });
    this.$on("on-form-item-add", field => {
      if (field) this.fields.push(field);
      this.monitorEvent();
      return false;
    });
    this.$on("on-form-item-remove", field => {
      if (field.prop) this.fields.splice(this.fields.indexOf(field), 1);
      return false;
    });
  }
};
</script>
