# 简介

由于在vue项目中，可以设置代码库为scoped,因此并不需要特别考虑css作用域的污染问题，因此并没有特别的类似BME,OOCSS等风格习惯。本项目css方面使用了sass，less以及postcss等插件。

### sass
项目中的sass样式除了在vue单文件中，也存放于style文件夹内，编写了通用的mixin以及placeholder,为后续ui组件化做准备。

### less
项目中使用less主要是为了修改iview的样式

### postcss
为了使用其中的autoprefixer插件，自动给css3属性添加浏览器前缀。