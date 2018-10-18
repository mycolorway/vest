# vest

一个微信小程序的开发增强工具。

顾名思义，vest 就像官方开发者工具的贴身小马甲，在原汁原味保留官方开发体验的基础上，提供了这些好处：

* 同时支持小程序项目和[小程序 npm 包](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)项目
* 支持在项目文件中插入环境变量，按环境编译小程序（基于 dotenv）
* 支持 @babel/presets-env 中定义的所有高级语法，包括异步函数（async function）
* 支持使用 sass 编写小程序样式，并且可以引入 npm 包中的第三方样式
* 自动构建小程序的 miniprogram_npm 文件夹，不需要在开发者工具上手动点“构建 npm”
* 允许在所有文件中使用相对于小程序代码根目录的相对路径，例如：`import request from '@/modules/request'`
* 支持 ESLint
* 支持编写 js 单元测试（基于 [Jest](https://jestjs.io)）
* 子项目 [vest-pocket](https://github.com/mycolorway/vest-pocket) 提供了一些实用的 module

### 使用方法

首先，把 vest 作为 global package 安装：

```bash
npm i -g @mycolorway/vest
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

最后用微信开发者工具打开 vest 项目根目录（如果是小程序 npm 项目，需要打开根目录里的 `demo` 文件夹）。

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

@import '~weui-wxss/dist/style/weui.wxss';
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

### npm 支持

关于 npm 支持，请参考官方文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html

vest 只是对“构建 npm”操作做了自动化处理。

### vest-pocket

[vest-pocket](https://github.com/mycolorway/vest-pocket) 是对小程序官方框架的补充，提供了官方框架缺少的一些实用 module：

* wx：对微信小程序的接口做了封装，让异步接口返回 Promise，配合 vest 可以支持 async/await 语法
* 自定义组件增强：对 Component/Behavior 构造器做了一些封装，让 Behavior 中定义的页面的生命周期函数能被依次调用
* Store：借鉴 Vuex.Store，在小程序中实现应用状态管理

通过 vest 创建的小程序项目，会自动将 `vest-pocket` 添加为项目依赖。
