# vest

微信/飞书小程序的开发增强工具。

vest 就像官方开发者工具的贴身小马甲，在原汁原味保留官方开发体验的基础上，提供了这些好处：

* 同时支持小程序项目和[小程序 npm 包](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)项目
* 支持在项目文件中插入环境变量，按环境编译小程序（基于 dotenv）
* 支持 @babel/presets-env 中定义的所有高级语法，包括异步函数（async function）
* 支持使用 sass 编写小程序样式，并且可以引入 npm 包中的第三方样式
* 支持依赖 node package，自动构建小程序的 miniprogram_npm 文件夹，不需要在开发者工具上手动点“构建 npm”
* 允许在所有文件中使用相对于小程序代码根目录的相对路径，例如：`import request from '@/modules/request'`
* 支持 ESLint
* 支持编写 js 单元测试（基于 [Jest](https://jestjs.io)）
* [vest-core](https://github.com/mycolorway/vest/tree/master/packages/%40mycolorway/vest-core)/wx 对小程序的接口做了封装，让异步接口返回 Promise，可以配合 async/await 语法使用
* [vest-core](https://github.com/mycolorway/vest/tree/master/packages/%40mycolorway/vest-core)/reactivity 提供了跟 Vue 类似的响应式开发方案
* [vest-core](https://github.com/mycolorway/vest/tree/master/packages/%40mycolorway/vest-core)/store 借鉴 Vuex.Store，小程序的应用状态管理方案

### 使用方法

首先，把 vest 作为 global package 安装：

```bash
npm i -g @mycolorway/vest-cli
```

创建新的 vest 项目：

```bash
vest create tower
```

进入项目根目录，编译 vest 项目，编译之前会自动安装项目依赖：

```bash
cd tower
vest build
```

或者：

```bash
vest dev
```

最后用开发者工具打开 vest 项目根目录（如果是小程序 npm 项目，需要打开根目录里的 `demo` 文件夹）。

更多关于 vest command 和 options 的使用方法可以参考：

```bash
vest -h
```

### 插入环境变量

首先，在 vest 项目根目录里创建对应的 dot 文件，例如 `.env.production`：

```
apiHost = 'https://x.zhiren.com'
amapKey = 'xxxxxxxxxxxxxxxxxxxx'
```

然后在任意项目文件中都可以通过 erb 语法插入定义好的环境变量，比如：

```js
const apiHost = '<%= apiHost %>'
const amapKey = '<%= amapKey %>'

export { apiHost, amapKey }
```

### 异步函数（async/await）

确保 vest 项目的依赖中有 `regenerator-runtime`（`vest create` 命令创建的项目会自动添加这个依赖），然后就可以直接在 js 文件中使用 `async/await` 了：

```js
Page({
  async onLoad() {
    this.setData(await this.loadData())
  }
})
```

### Sass

vest 会自动将所有的 `*.scss` 文件编译为 `*.wxss` 文件。

但是有个需要注意的问题，小程序的 wxss 本身是支持 import 其他 wxss 文件的，scss 在编译的过程中会把 `@import` 语句直接编译成相应的 css 代码，也就是说 `@import` 语句没有办法保留到 wxss 文件里。

为了解决这个问题，vest 引入了一种特殊的 import 语法，例如：

```scss
// app.scss

/*= import 'styles/base' */

@import '~@mycolorway/weui-wxss/dist/style/weui.wxss';
```

会被编译为：

```scss
// app.wxss

@import 'styles/base';

.weui-xxx {
  ...
}

...
```

#### Sass 自定义函数

可以在项目根目录创建 `vest.config.js`，然后制定 Sass 编译过程中需要使用的自定义函数：

```js
const sassInlineImage = require('sass-inline-image');
const path = require('path');

module.exports = {
  sass: {
    functions: sassInlineImage({
      base: path.resolve(__dirname, 'src'),
    }),
  },
};
```

### npm 支持

关于 npm 支持，请参考官方文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html

vest 只是对“构建 npm”操作做了自动化处理。

在 `src/vendor` 文件夹里面添加文件可以创建自定义的 node module bundle，例如：

```js
// src/vendor/date-fns.js
export { compareAsc } from 'date-fns'
```

会在 `dist/miniprogram_npm` 里面生成 `date-fns/index.js`，这个 `date-fns` 的包里只包含 `compareAsc` 的内容。
