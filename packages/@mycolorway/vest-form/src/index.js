import inputBehavior from './inputs/behaviors/input'
import fieldsetBehavior from './fieldset/behavior'
import formBehavior from './behavior'
import { wx } from '@mycolorway/vest-core'

Component({

  behaviors: [formBehavior],

  relations: {
    'inputBehavior': {
      type: 'child',
      target: inputBehavior
    },
    'fieldsetBehavior': {
      type: 'child',
      target: fieldsetBehavior
    },
    './button/button': {
      type: 'descendant'
    }
  },

  options: {
    multipleSlots: true,
    addGlobalClass: true
  },

  properties: {
    showButtons: {
      type: Boolean,
      value: true
    },
    scrollOffset: {
      type: Number,
      value: 0
    }
  },

  data: {
    errorMessage: null
  },

  methods: {
    getInputs() {
      return this.getRelationNodes('inputBehavior')
    },

    getAllInputs() {
      let inputs = this.getRelationNodes('inputBehavior')

      this.getFieldsets().forEach(fieldset => {
        inputs = inputs.concat(fieldset.getInputs())
      })

      return inputs
    },

    getFieldsets() {
      return this.getRelationNodes('fieldsetBehavior')
    },

    getInputByName(name) {
      return this.getAllInputs().find(i => {
        return i.data.name === name
      })
    },

    getInputByType(inputType) {
      return this.getAllInputs().filter(i => {
        return i.data.inputType === inputType
      })
    },

    getValues() {
      const values = {}

      this.getFieldsets().forEach(fieldset => fieldset.collectValue(values))

      this.getInputs().forEach(i => {
        if (!i.data.disabled) i.collectValue(values)
      })

      return values
    },

    showErrors(errors) {
      const errorMessage = []
      let firstErrorInput = null
      errors.forEach(error => {
        if (!error.inputName || error.inputName === 'base') {
          errorMessage.push(error.message)
        } else {
          const input = this.getInputByName(error.inputName)
          if (input) {
            input.showError(error)
            firstErrorInput = firstErrorInput || input
          }
        }
      })

      this.setData({
        errorMessage: errorMessage.join('; ')
      }, () => {
        if (firstErrorInput) this.scrollToInput(firstErrorInput)
      })
    },

    hideErrors() {
      this.setData({ errorMessage: '' });
      this.getAllInputs().forEach(input => input.hideError())
    },

    scrollToInput(input) {
      wx.createSelectorQuery().in(input)
        .select('.weui-cell, .form-input')
        .boundingClientRect(rect => {
          wx.createSelectorQuery().selectViewport()
            .scrollOffset(result => {
              wx.pageScrollTo({
                scrollTop: result.scrollTop + rect.top - this.properties.scrollOffset
              })
            })
            .exec()
        })
        .exec()
    },

    submit() {
      this.hideErrors();
      this.triggerEvent('submit', {values: this.getValues()})
    },

    reset() {
      this.hideErrors()
      this.getAllInputs().forEach(i => i.reset())
      this.triggerEvent('reset')
    }
  }

})
