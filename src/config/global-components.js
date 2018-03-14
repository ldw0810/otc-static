import {
  Message,
  Modal,
  Notice,
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
  Option,
} from "iview";
import Loading from '@/components/public/loading';
import Form from '@/libs/iview/components/form';

const components = {
  Message,
  Modal,
  Notice,
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
  Option,
};
const iview = {
  ...components,
  iButton: Button,
  iCol: Col,
  iForm: Form,
  iInput: Input, // i开头的组件为iview自带的组件
  cLoading: Loading, // c开头的组件为自己定义的全局组件
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
};

export default install