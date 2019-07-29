import InputBehavoir from '../behaviors/input'
import dateInputBehavior from '../behaviors/date'

Component({
  behaviors: [InputBehavoir, dateInputBehavior],

  options: {
    addGlobalClass: true
  },

  properties: {
    displayFormat: {
      type: String,
      value: 'yyyy-MM'
    },
  },

  data: {
    inputType: 'month',
    displayValue: null
  },

  methods: {
    onChange(e) {
      this.setData({
        value: e.detail.value,
        displayValue: this.formatDisplayValue(e.detail.value)
      });
      this.triggerEvent('change', {
        name: this.data.name,
        value: e.detail.value
      }, { bubbles: true });
    },

    onReset() {
      this.reset()
      this.triggerEvent('change', {
        name: this.data.name,
        value: this.data.value
      }, { bubbles: true })
    },
  }
});
