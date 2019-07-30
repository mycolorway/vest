"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _luxon = require("luxon");

var _default = Behavior({
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
  attached: function attached() {
    if (this.data.value) {
      this._updateDisplay();
    }
  },
  methods: {
    _valueChanged: function _valueChanged() {
      this._updateDisplay();
    },
    _updateDisplay: function _updateDisplay() {
      this.setData({
        displayValue: this.formatDisplayValue(this.data.value)
      });
    },
    formatDisplayValue: function formatDisplayValue(value) {
      if (value && this.properties.displayFormat) {
        return this.format(value, this.properties.displayFormat);
      } else {
        return value;
      }
    },
    format: function format(value, formatStr) {
      if (!value) return '';

      if (!(value instanceof _luxon.DateTime)) {
        value = _luxon.DateTime.fromISO(value);
      } // https://github.com/moment/luxon/blob/master/docs/formatting.md#table-of-tokens


      return value.toFormat(formatStr);
    },
    range: function range(start, end, step) {
      step = step === undefined ? start < end ? 1 : -1 : step;
      var length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
      return Array.from(Array(length), function (_, index) {
        return start + index * step;
      });
    }
  }
});

exports.default = _default;