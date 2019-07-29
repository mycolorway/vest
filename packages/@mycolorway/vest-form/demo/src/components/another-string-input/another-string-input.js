import inputBehavior from '@mycolorway/vest-form/inputs/behaviors/input'

Component({
  behaviors: [inputBehavior],

  options: {
    addGlobalClass: true
  },

  properties: {},

  data: {
    inputType: 'string'
  },

  methods: {
    onInput(e) {
      this.setData({ value: e.detail.value });
      this.triggerEvent('change', {
        name: this.data.name,
        value: e.detail.value
      }, { bubbles: true });
    }
  }
})
