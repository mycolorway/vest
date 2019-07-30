"use strict";

var _input = _interopRequireDefault(require("../inputs/behaviors/input"));

var _behavior = _interopRequireDefault(require("../behavior"));

var _behavior2 = _interopRequireDefault(require("./behavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
  behaviors: [_behavior2.default],
  relations: {
    'inputBehavior': {
      type: 'child',
      target: _input.default
    },
    'formBehavior': {
      type: 'parent',
      target: _behavior.default
    }
  },
  options: {
    addGlobalClass: true
  },
  properties: {
    name: String,
    label: String,
    bottomHint: String,
    withItemsInput: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    getInputs: function getInputs() {
      return this.getRelationNodes('inputBehavior');
    },
    getForm: function getForm() {
      var form = this.getRelationNodes('formBehavior');
      return form.length > 0 ? form[0] : null;
    },
    getInputByName: function getInputByName(name) {
      return this.getInputs().find(function (i) {
        return i.data.name === name;
      });
    },
    collectValue: function collectValue(formValues) {
      var values = this.data.name ? formValues[this.data.name] = {} : formValues;
      this.getInputs().forEach(function (input) {
        if (!input.data.disabled) {
          input.collectValue(values);
        }
      });
    }
  }
});