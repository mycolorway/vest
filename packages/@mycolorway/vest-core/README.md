# vest-core

vest-core 是对小程序官方框架的补充，提供了官方框架缺少的一些实用 module。

## 微信接口封装

wx-api module 对微信小程序的接口做了封装，让异步接口返回 Promise，配合 [vest](https://github.com/mycolorway/vest) 的 async/await 的语法支持，可以大大简化调用 API 的代码，例如：

```js
import { wx } from '@mycolorway/vest-core'

Page({
  async onLoad() {
    this.setData(await wx.request({
      url: 'xxx'
    }))
  }
})
```

### 响应式开发

vest-core 引入了跟 Vue 类似的响应式开发 module，可以实现对某个对象或者对象的某个属性进行监控。具体使用方法可以参考[单元测试](https://github.com/mycolorway/vest-core/tree/master/test/reactivity.test.js)。

另外，vest-core 还对官方默认的 Component/Behavior 构造器进行了封装，让自定义组件能够支持跟 Vue 一样的 computed 和 watch 定义段，例如：

```js
// pages/index/multiply-behavior.js
import { Behavior } from '@mycolorway/vest-core'

export default Behavior({
  computed: {
    multiply() {
      return this.data.a * this.data.b * this.data.c
    }
  },

  lifetimes: {
    attached() {
      console.log(this.data.multiply)
    }
  }
})
```

```js
// pages/index/index.js
import multiplyBehavior from './multiply-behavior'
import { Component } from '@mycolorway/vest-core'

Component({

  behaviors: [multiplyBehavior],

  data: {
    a: 1,
    b: 2,
    c: 3
  },

  computed: {
    sum() {
      return this.data.a + this.data.b + this.data.c
    }
  },

  watch: {
    c(newVal, oldValue) {
      console.log(`c changed from ${oldValue} to ${newVal}`)
    },
    b: '_bChanged'
  },

  lifetimes: {
    attached() {
      console.log(this.data.sum) // output: 6
      this.setData({ b: 4, c: 5 })
      console.log(this.data.sum) // output: 10
    }
  },

  methods: {
    _bChanged(newVal, oldValue) {
      console.log(`b changed from ${oldValue} to ${newVal}`)
    }
  }
})
```

## Store

在一些业务比较复杂的 Web 项目里，我们通常会借助 [Vuex](https://vuex.vuejs.org/) 或者 [Redux](https://redux.js.org/) 来实现应用的状态管理。vest-core 的 Store 填补了小程序在这方面的空白。

vest-core Store 的设计借鉴了 [Vuex](https://vuex.vuejs.org/)，大部分接口都跟 Vuex.Store 保持一致：

```js
// store/index.js
import { Store } from '@mycolorway/vest-core'

export default new Store({
  state: {
    name: ''
  },

  mutations: {
    updateName(state, name) {
      state.name = name
    }
  },

  actions: {
    async loadName({commit}) {
      commit('updateName', await requestName())
    }
  },

  modules: {
    child: {
      state: {
        firstName: 'vest',
        lastName: ''
      },
      getters: {
        name(state) {
          return `${state.firstName}-${state.lastName}`
        }
      },
      mutations: {
        updateLastName(state, lastName) {
          state.lastName = lastName
        }
      },
      actions: {
        async loadLastName({commit}) {
          commit('updateLastName', await requestLastName())
        }
      }
    }
  }
})
```

### Map Helpers

为了方便页面开发，跟 Vuex 一样，vest-core 也提供了类似的 helper 方法，可以把 store 的 state properties、getters、mutations 和 actions 映射到自定义组件里。

借助 vest-core 对自定义组件对封装，我们就可以把应用状态跟自定义组件绑定在一起：

```js
// pages/index/index.js
import store from './store'
import { Component } from '@mycolorway/vest-core'
import { mapActions, mapMutations, mapGetters, mapState } from '@mycolorway/vest-core/store'

Component({

  store,

  computed: {
    ...mapState(['name']),

    ...mapGetters('child', {
      childName: 'name'
    })
  },

  methods: {
    ...mapMutations(['updateName']),

    ...mapMutations('child', ['updateLastName']),

    ...mapActions(['loadName']),

    ...mapActions('child', {
      loadChildLastName: 'loadLastName'
    }),

    onLoad() {
      console.log('from page')
      this.updateName('lalala')
      this.loadChildLastName()
    }
  }
})
```

另外，为了避免在每个页面里都重复的去绑定 store，我们可以在 app.js 里面统一绑定：

```js
// app.js
import store from './store/index'

App({
  store
})
```

这样 Component module 会自动将 getApp().store 绑定到每一个自定义组件上。
