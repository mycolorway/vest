"use strict";

var _behavior = _interopRequireDefault(require("../behavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
  options: {
    addGlobalClass: true
  },
  relations: {
    'formBehavior': {
      type: 'ancestor',
      target: _behavior.default
    }
  },
  properties: {
    type: {
      type: String,
      value: 'primary'
    },
    loading: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    onTap: function onTap() {
      var form = this.getForm();
      if (form) form.submit();
    },
    getForm: function getForm() {
      var form = this.getRelationNodes('formBehavior');
      return form.length > 0 ? form[0] : null;
    }
  }
});