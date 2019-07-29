# vest-form

基于 [vest](https://github.com/mycolorway/vest) 开发的小程序表单组件。

## 使用方法

1. 将 vest-form 添加为项目依赖：

```bash
npm i --save @mycolorway/vest-form
```

2. 重新编译项目：

```bash
vest build
```

如果当前项目不是 vest 项目，则需要手动点击微信开发者工具的“构建 npm”选项。

3. 添加 vest-form 组件需要的全局样式：

```scss
// app.scss
/*= import './miniprogram_npm/@mycolorway/vest-form/styles/base' */
```

如果当前项目不是 vest 项目：

```scss
// app.wxss
@import './miniprogram_npm/@mycolorway/vest-form/styles/base'
```

4. 然后就可以在页面中添加需要的表单和字段组件了，具体可以参考 [demo](https://github.com/mycolorway/vest-form/tree/master/demo/src/pages/index)

## 编写新的表单字段组件

vest-form 只提供了一些基础类型的表单字段，我们可以在项目中根据业务需要编写新的表单字段组件，具体可以参考[这个例子](https://github.com/mycolorway/vest-form/blob/master/demo/src/components/another-string-input/another-string-input.js)。

注意，表单字段组件的定义中必须使用 vest-form 提供的一个 behavior，然后打开 addGlobalClass 选项：

```js
import inputBehavior from '@mycolorway/vest-form/inputs/behaviors/input'

Component({
  behaviors: [inputBehavior],

  options: {
    addGlobalClass: true
  },

  ...
})
```