import {
  Message,
  Modal,
  Notice,
  Spin,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Poptip,
  OptionGroup,
  Icon,
  Row,
  Col,
  Page,
  Input,
  CheckboxGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  Option
} from "iview";
import Form from '@/libs/iview/components/form'

const components = {
  Message,
  Modal,
  Notice,
  Spin,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  OptionGroup,
  Poptip,
  Icon,
  Row,
  Col,
  Form,
  FormItem: Form.Item,
  Page,
  Input,
  CheckboxGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  Option
};
const iview = {
  ...components,
  iButton: Button,
  iCol: Col,
  iForm: Form,
  iInput: Input,
};
const install = function(Vue, options) {
  Object.keys(iview).forEach(key => {
    Vue.component(key, iview[key]);
  });
  // import components
  // Vue.prototype.$Loading = LoadingBar;
  Vue.prototype.$Message = Message;
  Vue.prototype.$Modal = Modal;
  Vue.prototype.$Notice = Notice;
  Vue.prototype.$Spin = Spin;
};

export default install