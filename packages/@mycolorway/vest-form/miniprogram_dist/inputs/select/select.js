"use strict";

var _input = _interopRequireDefault(require("../behaviors/input"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Component({
  behaviors: [_input.default],
  options: {
    addGlobalClass: true
  },
  properties: {
    value: {
      type: null,
      observer: '_updateDisplay'
    },
    collection: {
      type: Array,
      value: [],
      observer: '_updateDisplay'
    }
  },
  data: {
    inputType: 'select',
    index: null,
    range: [],
    selectedItems: []
  },
  attached: function attached() {},
  methods: {
    onChange: function onChange(e) {
      var _this = this;

      this.setData({
        index: e.detail.value,
        value: this._getValueByIndex(e.detail.value)
      }, function () {
        _this.triggerEvent('change', {
          name: _this.data.name,
          value: _this.data.value
        }, {
          bubbles: true
        });
      });
    },
    onReset: function onReset() {
      this.reset();
      this.triggerEvent('change', {
        name: this.data.name,
        value: this.data.value
      }, {
        bubbles: true
      });
    },
    _updateDisplay: function _updateDisplay() {
      this.setData({
        range: this._convertCollectionToRange(),
        index: this._getIndexByValue(this.properties.value)
      });
    },
    _getIndexByValue: function _getIndexByValue(value) {
      var _this2 = this;

      var index = this.properties.collection.findIndex(function (element) {
        return _this2._normalizeElement(element).id == value;
      });
      return index === -1 ? null : index;
    },
    _getValueByIndex: function _getValueByIndex(index) {
      if (index == -1) return null;
      return this._normalizeElement(this.properties.collection[index]).id;
    },
    _convertCollectionToRange: function _convertCollectionToRange() {
      var _this3 = this;

      return this.properties.collection.map(function (element) {
        return _this3._normalizeElement(element);
      });
    },
    _normalizeElement: function _normalizeElement(element) {
      if (element instanceof Array) {
        return {
          id: element[1],
          name: element[0]
        };
      } else if (_typeof(element) === 'object') {
        return element;
      } else {
        return {
          id: element,
          name: element
        };
      }
    },
    collectValue: function collectValue(formValues) {
      if (this.data.name) {
        formValues[this.data.name] = this.data.value;
      }
    }
  }
});