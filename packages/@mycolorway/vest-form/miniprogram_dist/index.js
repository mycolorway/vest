"use strict";

var _input = _interopRequireDefault(require("./inputs/behaviors/input"));

var _behavior = _interopRequireDefault(require("./fieldset/behavior"));

var _behavior2 = _interopRequireDefault(require("./behavior"));

var _vestCore = require("@mycolorway/vest-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
  behaviors: [_behavior2.default],
  relations: {
    'inputBehavior': {
      type: 'child',
      target: _input.default
    },
    'fieldsetBehavior': {
      type: 'child',
      target: _behavior.default
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
    getInputs: function getInputs() {
      return this.getRelationNodes('inputBehavior');
    },
    getAllInputs: function getAllInputs() {
      var inputs = this.getRelationNodes('inputBehavior');
      this.getFieldsets().forEach(function (fieldset) {
        inputs = inputs.concat(fieldset.getInputs());
      });
      return inputs;
    },
    getFieldsets: function getFieldsets() {
      return this.getRelationNodes('fieldsetBehavior');
    },
    getInputByName: function getInputByName(name) {
      return this.getAllInputs().find(function (i) {
        return i.data.name === name;
      });
    },
    getInputByType: function getInputByType(inputType) {
      return this.getAllInputs().filter(function (i) {
        return i.data.inputType === inputType;
      });
    },
    getValues: function getValues() {
      var values = {};
      this.getFieldsets().forEach(function (fieldset) {
        return fieldset.collectValue(values);
      });
      this.getInputs().forEach(function (i) {
        if (!i.data.disabled) i.collectValue(values);
      });
      return values;
    },
    showErrors: function showErrors(errors) {
      var _this = this;

      var errorMessage = [];
      var firstErrorInput = null;
      errors.forEach(function (error) {
        if (!error.inputName || error.inputName === 'base') {
          errorMessage.push(error.message);
        } else {
          var input = _this.getInputByName(error.inputName);

          if (input) {
            input.showError(error);
            firstErrorInput = firstErrorInput || input;
          }
        }
      });
      this.setData({
        errorMessage: errorMessage.join('; ')
      }, function () {
        if (firstErrorInput) _this.scrollToInput(firstErrorInput);
      });
    },
    hideErrors: function hideErrors() {
      this.setData({
        errorMessage: ''
      });
      this.getAllInputs().forEach(function (input) {
        return input.hideError();
      });
    },
    scrollToInput: function scrollToInput(input) {
      var _this2 = this;

      _vestCore.wx.createSelectorQuery().in(input).select('.weui-cell, .form-input').boundingClientRect(function (rect) {
        _vestCore.wx.createSelectorQuery().selectViewport().scrollOffset(function (result) {
          _vestCore.wx.pageScrollTo({
            scrollTop: result.scrollTop + rect.top - _this2.properties.scrollOffset
          });
        }).exec();
      }).exec();
    },
    submit: function submit() {
      this.hideErrors();
      this.triggerEvent('submit', {
        values: this.getValues()
      });
    },
    reset: function reset() {
      this.hideErrors();
      this.getAllInputs().forEach(function (i) {
        return i.reset();
      });
      this.triggerEvent('reset');
    }
  }
});