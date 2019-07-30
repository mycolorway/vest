"use strict";

var _input = _interopRequireDefault(require("../behaviors/input"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
  behaviors: [_input.default],
  options: {
    addGlobalClass: true
  },
  properties: {
    focus: {
      type: Boolean,
      value: false
    }
  },
  data: {
    inputType: 'string'
  },
  methods: {
    onInput: function onInput(e) {
      this.setData({
        value: e.detail.value
      });
      this.triggerEvent('change', {
        name: this.data.name,
        value: e.detail.value
      }, {
        bubbles: true
      });
    }
  }
});