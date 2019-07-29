import { Component } from '@mycolorway/vest-core'

Component({
  methods: {
    onSubmit(e) {
      console.log(e.detail.values)
    },

    toggleErrors(e) {
      this._showErrors = !this._showErrors
      const form = this.selectComponent('#demo-form')
      if (this._showErrors) {
        form.showErrors([{
          inputName: 'name',
          message: '具体错误信息'
        }, {
          inputName: 'englishName',
          message: '英文名错误'
        }, {
          inputName: 'married',
          message: '你确定？'
        }, {
          inputName: 'birthday',
          message: '生日错误啦啊啦啦'
        }, {
          inputName: 'birthdayTime',
          message: '出生时间错误啦啊啦啦'
        }, {
          inputName: 'birthdayMonth',
          message: '出生年月错误啦啊啦啦'
        }, {
          inputName: 'age',
          message: '年龄不对啦啦啦'
        }, {
          inputName: 'favoriteColor',
          message: '颜色不对啦啦啦'
        }, {
          inputName: 'comment',
          message: '备注不对啦啦啦'
        }])
      } else {
        form.hideErrors()
      }
    }
  }
})
