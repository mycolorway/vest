"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _behavior = _interopRequireDefault(require("../../behavior"));

var _behavior2 = _interopRequireDefault(require("../../fieldset/behavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = Behavior({
  behaviors: ['wx://form-field'],
  relations: {
    'formBehavior': {
      type: 'parent',
      target: _behavior.default
    },
    'fieldsetBehavior': {
      type: 'parent',
      target: _behavior2.default
    }
  },
  properties: {
    label: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    readonly: {
      type: Boolean,
      value: false
    },
    required: {
      type: Boolean,
      value: false
    },
    error: {
      type: null,
      value: false
    },
    clearable: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    getForm: function getForm() {
      var fieldset = this.getFieldset();

      if (fieldset) {
        return fieldset.getForm();
      } else {
        var form = this.getRelationNodes('formBehavior');
        return form.length > 0 ? form[0] : null;
      }
    },
    getFormId: function getFormId() {
      var form = this.getForm();

      if (!form.id) {
        throw new Error("".concat(this.data.inputType, " input requires parent form with id."));
      }

      return form.id;
    },
    getFieldset: function getFieldset() {
      var fieldset = this.getRelationNodes('fieldsetBehavior');
      return fieldset.length > 0 ? fieldset[0] : null;
    },
    reset: function reset() {
      this.setData({
        value: ''
      });
    },
    collectValue: function collectValue(formValues) {
      if (this.data.name) {
        formValues[this.data.name] = this.data.value !== undefined ? this.data.value : '';
      }
    },
    showError: function showError(error) {
      this.setData({
        error: error
      });
    },
    hideError: function hideError() {
      this.setData({
        error: false
      });
    }
  }
});

exports.default = _default;