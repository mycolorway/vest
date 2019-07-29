import { DateTime } from 'luxon'

export default Behavior({
  properties: {
    value: {
      type: String,
      observer: '_valueChanged'
    },
    displayFormat: String
  },

  // NOTE: https://tower.im/projects/6d6ca827621042b59878b7d61c8e5681/todos/31b6a07a3e0e476e98b3532bfecfa7ca/
  // data: {
  //   displayValue: null
  // },

  attached() {
    if (this.data.value) {
      this._updateDisplay()
    }
  },

  methods: {
    _valueChanged() {
      this._updateDisplay()
    },

    _updateDisplay() {
      this.setData({
        displayValue: this.formatDisplayValue(this.data.value)
      });
    },

    formatDisplayValue(value) {
      if (value && this.properties.displayFormat) {
        return this.format(value, this.properties.displayFormat);
      } else {
        return value;
      }
    },

    format(value, formatStr) {
      if (!value) return ''

      if (!(value instanceof DateTime)) {
        value = DateTime.fromISO(value)
      }

      // https://github.com/moment/luxon/blob/master/docs/formatting.md#table-of-tokens
      return value.toFormat(formatStr);
    },

    range(start, end, step) {
      step = step === undefined ? (start < end ? 1 : -1) : step;
      let length = Math.max(Math.ceil((end - start) / (step || 1)), 0);

      return Array.from(Array(length), (_, index) => start + index * step);
    }
  }
});
